import { createHtmlLanguageModule, createTsLanguageModule, HTMLTemplateFile } from '@volar-examples/angular-language-core';
import * as createTsPlugin from '@volar-plugins/typescript';
import { LanguageServiceContext } from '@volar/language-server';
import type { Config, Diagnostic, LanguageServicePlugin, LanguageServicePluginInstance } from '@volar/language-service';

export function resolveConfig(config: Config, ctx: LanguageServiceContext) {
    const ts = ctx.host.getTypeScriptModule?.();
    if (ts) {
        config.languages ??= {};
        config.languages['angular/html'] ??= createHtmlLanguageModule(ts);
        config.languages['angular/ts'] ??= createTsLanguageModule(ts);
    }
    config.plugins ??= {};
    config.plugins.typescript ??= createTsPlugin();
    config.plugins['angular/ng-template'] ??= ngTemplatePlugin;
}

const ngTemplatePlugin: LanguageServicePlugin = (context): LanguageServicePluginInstance => ({

	validation: {

		onSyntactic(document) {

			const file = context.documents.getVirtualFileByUri(document.uri);

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
	}
});
