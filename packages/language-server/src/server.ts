import { createConnection, LanguageServerPlugin, startLanguageServer } from '@volar/language-server/node';
import { resolveConfig } from '.';

const connection = createConnection();
const baseExts = ['js', 'cjs', 'mjs', 'ts', 'cts', 'mts', 'jsx', 'tsx', 'json', 'svelte'];
const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => {
	return {
		tsconfigExtraFileExtensions: [{ extension: 'html', isMixedContent: true, scriptKind: 7 }],
		diagnosticDocumentSelector: [
			{ language: 'javascript' },
			{ language: 'typescript' },
			{ language: 'javascriptreact' },
			{ language: 'typescriptreact' },
			{ language: 'html' },
		],
		extensions: {
			fileRenameOperationFilter: baseExts,
			fileWatcher: baseExts,
		},
		resolveConfig: resolveConfig,
	}
};

startLanguageServer(connection, plugin);
