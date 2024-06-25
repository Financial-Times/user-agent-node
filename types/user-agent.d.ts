declare module '@financial-times/user-agent' {
	export type BuildOptions = {
		libraries?: string[] | undefined;
		urls?: string[] | undefined;
	};

	export function buildUserAgent(options?: BuildOptions): string;
}
