const { afterEach, beforeEach, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const quibble = require('quibble');

describe('lib/user-agent.js', () => {
	let subject;

	beforeEach(() => {
		quibble('@dotcom-reliability-kit/app-info', {
			systemCode: 'mock-system-code',
			releaseVersion: 'mock-release-version'
		});
		quibble('node:process', { version: 'v1.2.3' });
		subject = require('../../lib/user-agent');
	});

	afterEach(() => {
		quibble.reset();
	});

	describe('buildUserAgent(options)', () => {
		beforeEach(() => {
			quibble('mock-library-1/package.json', {
				name: 'mock-library-1-name',
				version: 'mock-library-1-version'
			});
			quibble('mock-library-2/package.json', {
				name: 'mock-library-2-name',
				version: 'mock-library-2-version'
			});
		});

		describe('when `options` is undefined', () => {
			it('returns a user-agent string containing only the system code and version', () => {
				assert.equal(
					subject.buildUserAgent(),
					'FTSystem/mock-system-code/mock-release-version (Node.js/1.2.3)'
				);
			});
		});

		describe('when `options.libraries` is defined', () => {
			it('returns a user-agent string containing the specified library versions', () => {
				assert.equal(
					subject.buildUserAgent({ libraries: ['mock-library-1', 'mock-library-2'] }),
					'FTSystem/mock-system-code/mock-release-version (mock-library-1-name/mock-library-1-version; mock-library-2-name/mock-library-2-version; Node.js/1.2.3)'
				);
			});

			describe('when a library does not exist', () => {
				it('exludes that library from the user-agent string', () => {
					assert.equal(
						subject.buildUserAgent({ libraries: ['mock-library-1', 'mock-library-nope'] }),
						'FTSystem/mock-system-code/mock-release-version (mock-library-1-name/mock-library-1-version; Node.js/1.2.3)'
					);
				});
			});

			describe('when none of the libraries exist', () => {
				it('exludes all libraries from the user-agent string', () => {
					assert.equal(
						subject.buildUserAgent({ libraries: ['mock-library-nope'] }),
						'FTSystem/mock-system-code/mock-release-version (Node.js/1.2.3)'
					);
				});
			});

			describe('when a library has a non-string name', () => {
				beforeEach(() => {
					quibble('mock-library-badname/package.json', {
						name: null,
						version: 'mock-library-2-version'
					});
				});

				it('exludes that library from the user-agent string', () => {
					assert.equal(
						subject.buildUserAgent({ libraries: ['mock-library-1', 'mock-library-badname'] }),
						'FTSystem/mock-system-code/mock-release-version (mock-library-1-name/mock-library-1-version; Node.js/1.2.3)'
					);
				});
			});

			describe('when a library has a non-string version', () => {
				beforeEach(() => {
					quibble('mock-library-barversion/package.json', {
						name: 'mock-library-badversion-name',
						version: null
					});
				});

				it('defaults the version for that library', () => {
					assert.equal(
						subject.buildUserAgent({ libraries: ['mock-library-1', 'mock-library-barversion'] }),
						'FTSystem/mock-system-code/mock-release-version (mock-library-1-name/mock-library-1-version; mock-library-badversion-name/0.0.0; Node.js/1.2.3)'
					);
				});
			});
		});

		describe('when `options.urls` is defined', () => {
			it('returns a user-agent string containing the specified URLs', () => {
				assert.equal(
					subject.buildUserAgent({ urls: ['mock-url-1', 'mock-url-2'] }),
					'FTSystem/mock-system-code/mock-release-version (+mock-url-1; +mock-url-2; Node.js/1.2.3)'
				);
			});
		});

		describe('when `options.libraries` and `options.urls` are defined', () => {
			it('returns a user-agent string containing the specified libraries and URLs', () => {
				assert.equal(
					subject.buildUserAgent({ libraries: ['mock-library-1'], urls: ['mock-url-1'] }),
					'FTSystem/mock-system-code/mock-release-version (mock-library-1-name/mock-library-1-version; +mock-url-1; Node.js/1.2.3)'
				);
			});
		});

		describe('when the app system code or release version is null', () => {
			beforeEach(() => {
				quibble.reset();
				quibble('@dotcom-reliability-kit/app-info', {});
				quibble('node:process', { version: 'v1.2.3' });
				subject = require('../../lib/user-agent');
			});

			it('returns a user-agent string containing default values', () => {
				assert.equal(subject.buildUserAgent(), 'FTSystem/unknown/0.0.0 (Node.js/1.2.3)');
			});
		});
	});
});
