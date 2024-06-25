const { fork } = require('node:child_process');
const { hookFork, waitOnExit } = require('@dotcom-tool-kit/logger');
const { Task } = require('@dotcom-tool-kit/types');

class NodeTest extends Task {
	async run() {
		const child = fork('--test', ['--test-reporter', 'spec'], { silent: true });
		hookFork(this.logger, 'node test', child);
		return waitOnExit('node test', child);
	}
}

exports.tasks = [NodeTest];
