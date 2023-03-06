export const COMMIT_TYPES = {
  feat: {
    emoji: '🆕',
    description: 'Add new feature',
    release: true
  },
  fix: {
    emoji: '🐛',
    description: 'A bug fix',
    release: true
  },
  perf: {
    emoji: '⚡️',
    description: 'Improve performance',
    release: true
  },
  refactor: {
    emoji: '⚒️',
    description: 'Change of existing code without affecting the usage of the application',
    release: true
  },
  build: {
    emoji: '🏗',
    description: 'Changes that affect the build system or external dependencies',
    release: false
  },
  revert: {
    emoji: '🔙',
    description: 'Revert changes of a previous commit',
    release: false
  },
  docs: {
    emoji: '📕',
    description: 'Documentation changes only',
    release: false
  },
  style: {
    emoji: '💅',
    description: 'Changes that are related to the style of the document ',
    release: false
  },
  test: {
    emoji: '🧪',
    description: 'Add or update tests',
    release: false
  },
  ci: {
    emoji: '🚀',
    description: 'Changes to our CI configuration files and scripts',
    release: false
  }
}
