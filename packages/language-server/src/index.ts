import { createTsLanguageModule } from './languages/ts';
import { createHtmlLanguageModule, HTMLTemplateFile } from './languages/html';
import createTsPlugin from 'volar-service-typescript';
import type { Config, Diagnostic, Service } from '@volar/language-service';

export const resolveConfig = (config: Config, ts?: typeof import('typescript/lib/tsserverlibrary')) => {
	if (ts) {
		config.languages ??= {};
		config.languages['angular/html'] ??= createHtmlLanguageModule(ts);
		config.languages['angular/ts'] ??= createTsLanguageModule(ts);
	}
	config.services ??= {};
	config.services.typescript ??= createTsPlugin();
	config.services['angular/ng-template'] ??= ngTemplatePlugin;
	return config;
}

const ngTemplatePlugin: Service = (context): ReturnType<Service> => ({

	provideDiagnostics(document) {

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
