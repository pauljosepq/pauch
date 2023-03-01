import { intro, isCancel, multiselect, outro, select, text, confirm } from '@clack/prompts';
import { COMMIT_TYPES } from "./commit-types.js";
import { GIT_ACTIONS } from './git-actions.js';
import colors from "picocolors";
import { trytm } from '@bdsqqq/try';
import { getChangedFiles, getLastMessage, getStagedFiles, gitAdd, gitAmend, gitCommit } from './git.js'
import { exitProgram } from './utils.js';

intro(colors.bgCyan('Commit helper'))

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

if (errorChangedFiles ?? errorStagedFiles) {
    outro(colors.red('Error: Nonexistent git repository'))
    process.exit(1)
}

if (stagedFiles.length === 0 && changedFiles.length > 0) {
    const files = await multiselect({
        message: colors.cyan('Select the files to stage:'),
        options: changedFiles.map(file => ({
            value: file,
            label: file
        }))
    })

    if (isCancel(files)) exitProgram()

    await gitAdd({ files })
}

const action = await select({
    message: colors.cyan('Select the action'),
    options: Object.entries(GIT_ACTIONS).map(([key, value]) => ({
        value: key,
        label: `${key.padEnd(5, ' ')} · ${value.description}`
    }))
})

if(action === GIT_ACTIONS.amend.name) {

    const previousCommit = await getLastMessage();

    const amendMessage = await confirm({
        initialValue: true,
        message: `${colors.cyan('Do you want to rename the commit?')}
      ${colors.green(colors.bold(previousCommit))}`
    })

    if (amendMessage) {

        const type = await selectType();

        const message = await writeCommitMessage();

        const breakingChange = checkBreakingChange(type)

        let commit = `${type}: ${message}`
        commit = breakingChange ? `${commit}\nBREAKING CHANGE: ` : commit

        await confirmCommit(commit)

        await gitAmend({ commit, amendMessage })

        outro(colors.green('🟢 Commit amended successfully'))
        process.exit(0)
    }

    await gitAmend({amendMessage});

    outro(colors.green('🟢 Commit amended successfully'))
    process.exit(0)

}

const type = await selectType();

const message = await writeCommitMessage()

const breakingChange = checkBreakingChange(type)

let breakingChangeMessage = '';

if (breakingChange) {
    breakingChangeMessage = await text({
        message: colors.cyan('Commit message:')
    })

    if (isCancel(breakingChangeMessage)) exitProgram()
}


let commit = `${type}: ${message}`
commit = breakingChange ? `${commit}\nBREAKING CHANGE: ${breakingChangeMessage}` : commit

await confirmCommit()

await gitCommit({ commit })

outro(colors.green('🟢 Commit created successfully'))
process.exit(0)

async function selectType () {
    const type = await select({
        message: colors.cyan('Select the type of commit'),
        options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
            value: key,
            label: `${value.emoji} ${key.padEnd(5, ' ')} · ${value.description}`
        }))
    })

    if (isCancel(type)) exitProgram()

    return type;
}

async function writeCommitMessage() {
    const message = await text({
        message: colors.cyan('Commit message:'),
        validate: (value) => {
            if (value.length === 0) {
                return colors.red('The message cannot be empty')
            }

            if (value.length > 100) {
                return colors.red('The message cannot have more than 100 characters')
            }
        }
    })

    if (isCancel(message)) exitProgram()

    return message;
}

function checkBreakingChange (type) {
    const { release } = COMMIT_TYPES[type]

    let breakingChange = false
    if (release) {
        breakingChange = confirm({
            initialValue: false,
            message: `${colors.cyan('Is this a breaking change?')} ${colors.yellow('If so, create a "BREAKING CHANGE" commit and increase the version when releasing')}`
        })

        if (isCancel(breakingChange)) exitProgram()

        return breakingChange;
    }
}

async function confirmCommit (commit) {
    const shouldContinue = await confirm({
        initialValue: true,
        message: `${colors.cyan('The commit will look like this')}
      ${colors.green(colors.bold(commit))}
      ${colors.cyan('Continue?')}`
    })

    if (isCancel(shouldContinue)) exitProgram()

    if (!shouldContinue) {
        outro(colors.yellow('Commit not created'))
        process.exit(0)
    }
}
