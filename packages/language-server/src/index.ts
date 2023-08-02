import { createTsLanguageModule } from './languages/ts';
import { createHtmlLanguageModule, HTMLTemplateFile } from './languages/html';
import createTsPlugin from '@volar-plugins/typescript';
import { LanguageServerPlugin } from '@volar/language-server';
import type { Diagnostic, LanguageServicePlugin, LanguageServicePluginInstance } from '@volar/language-service';

export const resolveConfig: ReturnType<LanguageServerPlugin>['resolveConfig'] = (config, modules) => {
	const ts = modules.typescript;
	if (ts) {
		config.languages ??= {};
		config.languages['angular/html'] ??= createHtmlLanguageModule(ts);
		config.languages['angular/ts'] ??= createTsLanguageModule(ts);
	}
	config.plugins ??= {};
	config.plugins.typescript ??= createTsPlugin();
	config.plugins['angular/ng-template'] ??= ngTemplatePlugin;
	return config;
}

const ngTemplatePlugin: LanguageServicePlugin = (context): LanguageServicePluginInstance => ({

	provideSyntacticDiagnostics(document) {

		const file = context?.documents.getVirtualFileByUri(document.uri);

		if (file instanceof HTMLTemplateFile) {
			return (file.parsed.errors ?? []).map<Diagnostic>(error => ({
				range: {
					start: { line: error.span.start.line, character: error.span.start.col },
					end: { line: error.span.end.line, character: error.span.end.col },
				},
				severity: error.level === 1 ? 1 : 2,
				source: 'ng-template',
				message: error.msg,
			}));
		}
	},
});
