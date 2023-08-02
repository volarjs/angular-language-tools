import { createConnection, LanguageServerPlugin, startLanguageServer } from '@volar/language-server/node';
import { resolveConfig } from '.';

const connection = createConnection();
const plugin: LanguageServerPlugin = (_, modules): ReturnType<LanguageServerPlugin> => {
	return {
		extraFileExtensions: [{ extension: 'html', isMixedContent: true, scriptKind: 7 }],
		watchFileExtensions: ['js', 'cjs', 'mjs', 'ts', 'cts', 'mts', 'jsx', 'tsx', 'json', 'svelte'],
		resolveConfig: config => resolveConfig(config, modules?.typescript),
	}
};

startLanguageServer(connection, plugin);
