const appInfo = require('@dotcom-reliability-kit/app-info');
const process = require('node:process');

const leadingV = /^v/i;

/**
 * @type {import('@financial-times/user-agent').buildUserAgent}
 */
function buildUserAgent(options = {}) {
	const { libraries = [], urls = [] } = options;

	const systemCode = appInfo.systemCode || 'unknown';
	const systemVersion = appInfo.releaseVersion || '0.0.0';
	const baseUserAgent = `FTSystem/${systemCode}/${systemVersion}`;

	const nodeToken = `Node.js/${process.version.replace(leadingV, '')}`;
	const libraryTokens = libraries.map(getLibraryToken).filter(Boolean);
	const urlTokens = urls.map((url) => `+${url}`);
	const tokens = [...libraryTokens, ...urlTokens, nodeToken];

	if (tokens.length) {
		return `${baseUserAgent} (${tokens.join('; ')})`;
	}

	return baseUserAgent;
}

/**
 * @param {string} libraryName
 * @returns {string | null}
 */
function getLibraryToken(libraryName) {
	try {
		let { name, version } = require(`${libraryName}/package.json`);
		if (typeof name === 'string') {
			return `${name}/${typeof version === 'string' ? version : '0.0.0'}`;
		}
	} catch (error) {}
	return null;
}

exports.buildUserAgent = buildUserAgent;
