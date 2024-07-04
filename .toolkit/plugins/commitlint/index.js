const { fork } = require('node:child_process');
const { hookFork, waitOnExit } = require('@dotcom-tool-kit/logger');
const { Task } = require('@dotcom-tool-kit/base');

const commitlintCLIPath = require.resolve('.bin/commitlint');

module.exports = class Commitlint extends Task {
	async run() {
		const child = fork(commitlintCLIPath, ['--edit'], { silent: true });
		hookFork(this.logger, 'commitlint', child);
		return waitOnExit('commitlint', child);
	}
};
