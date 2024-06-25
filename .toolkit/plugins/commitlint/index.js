const { fork } = require('node:child_process');
const { hookFork, waitOnExit } = require('@dotcom-tool-kit/logger');
const { Task } = require('@dotcom-tool-kit/types');

const commitlintCLIPath = require.resolve('.bin/commitlint');

class Commitlint extends Task {
	async run() {
		const child = fork(commitlintCLIPath, ['--edit'], { silent: true });
		hookFork(this.logger, 'commitlint', child);
		return waitOnExit('commitlint', child);
	}
}

exports.tasks = [Commitlint];
