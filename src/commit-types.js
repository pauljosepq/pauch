export const COMMIT_TYPES = {
  feat: {
    emoji: '๐',
    description: 'Add new feature',
    release: true
  },
  fix: {
    emoji: '๐',
    description: 'A bug fix',
    release: true
  },
  perf: {
    emoji: 'โก๏ธ',
    description: 'Improve performance',
    release: true
  },
  refactor: {
    emoji: 'โ๏ธ',
    description: 'Change of existing code without affecting the usage of the application',
    release: true
  },
  build: {
    emoji: '๐',
    description: 'Changes that affect the build system or external dependencies',
    release: false
  },
  revert: {
    emoji: '๐',
    description: 'Revert changes of a previous commit',
    release: false
  },
  docs: {
    emoji: '๐',
    description: 'Documentation changes only',
    release: false
  },
  style: {
    emoji: '๐',
    description: 'Changes that are related to the style of the document ',
    release: false
  },
  test: {
    emoji: '๐งช',
    description: 'Add or update tests',
    release: false
  },
  ci: {
    emoji: '๐',
    description: 'Changes to our CI configuration files and scripts',
    release: false
  }
}
