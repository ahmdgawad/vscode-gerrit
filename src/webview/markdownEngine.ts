/*
 * @Author: liupei
 * @Date: 2019-10-11 15:42:13
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-11 18:47:32
 */

import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import * as hljs from 'highlight.js';
import * as MarkdownIt from 'markdown-it';

import { isWindows } from '../utils/osUtils';
import { gerritChannel } from '../gerritChannel';

class MarkdownEngine implements vscode.Disposable {
    private engine: MarkdownIt;
    private config: MarkdownConfiguration;
    private listener: vscode.Disposable;

    public get localResourceRoots(): vscode.Uri[] {
        return [vscode.Uri.file(path.join(this.config.extRoot, 'media'))];
    }

    constructor() {
        this.engine = this.initEngine();
        this.config = new MarkdownConfiguration();
        this.listener = vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
            if (event.affectsConfiguration('markdown')) {
                this.reload();
            }
        }, this);
    }

    public reload(): void {
        this.engine = this.initEngine();
        this.config = new MarkdownConfiguration();
    }

    public render(md: string, env?: any): string {
        return this.engine.render(md, env);
    }

    public getStyles(): string {
        return [
            this.getBuiltinStyles(),
            this.getSettingsStyles(),
        ].join(os.EOL);
    }

    public dispose(): void {
        this.listener.dispose();
    }

    private getBuiltinStyles(): string {
        let styles: vscode.Uri[] = [];
        try {
            const stylePaths: string[] = require(path.join(this.config.extRoot, 'package.json'))['contributes']['markdown.previewStyles'];
            styles = stylePaths.map((p: string) => vscode.Uri.file(path.join(this.config.extRoot, p)).with({ scheme: 'vscode-resource' }));
        } catch (error) {
            gerritChannel.appendLine('[Error] Fail to load built-in markdown style file.');
        }
        return styles.map((style: vscode.Uri) => `<link rel='stylesheet' type='text/css' href='${style.toString()}'>`).join(os.EOL);
    }

    private getSettingsStyles(): string {
        const { fontSize, fontFamily, lineHeight } = this.config;
        return [
            `<style>`,
            `body {`,
            `    ${!fontFamily ? `` : `font-family: ${fontFamily};`}`,
            `    ${isNaN(fontSize) ? `` : `font-size: ${fontSize}px;`}`,
            `    ${isNaN(lineHeight) ? `` : `line-height: ${lineHeight};`}`,
            `}`,
            `</style>`,
        ].join(os.EOL);
    }

    private initEngine(): MarkdownIt {
        const md: MarkdownIt = new MarkdownIt({
            linkify: true,
            typographer: true,
            highlight: (code: string, lang?: string): string => {
                switch (lang && lang.toLowerCase()) {
                    case 'mysql':
                        lang = 'sql';
                        break;
                    case 'json5':
                        lang = 'json';
                        break;
                    case 'python3':
                        lang = 'python';
                        break;
                }
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, code, true).value;
                    } catch (_) { /* do not highlight */ }
                }
                return '';
            },
        });

        this.addCodeBlockHighlight(md);
        this.addImageUrlCompletion(md);
        this.addLinkValidator(md);

        return md;
    }

    private addCodeBlockHighlight(md: MarkdownIt): void {
        const codeBlock: MarkdownIt.TokenRender = md.renderer.rules['code_block'];
        md.renderer.rules['code_block'] = (tokens, idx, options, env, self) => {
            // if any token uses lang-specified code fence, then do not highlight code block
            if (tokens.some((token: any) => token.type === 'fence')) {
                return codeBlock(tokens, idx, options, env, self);
            }
            // otherwise, highlight with default lang in env object.
            const highlighted: string = options.highlight(tokens[idx].content, env.lang);
            return [
                `<pre><code ${self.renderAttrs(tokens[idx])} >`,
                highlighted || md.utils.escapeHtml(tokens[idx].content),
                `</code></pre>`
            ].join(os.EOL);
        };
    }

    private addImageUrlCompletion(md: MarkdownIt): void {
        const image: MarkdownIt.TokenRender = md.renderer.rules['image'];
        md.renderer.rules['image'] = (tokens, idx, options, env, self) => {
            const imageSrc: string[] | undefined = tokens[idx].attrs.find((value: string[]) => value[0] === 'src');
            if (env.host && imageSrc && imageSrc[1].startsWith('/')) {
                imageSrc[1] = `${env.host}${imageSrc[1]}`;
            }
            return image(tokens, idx, options, env, self);
        };
    }

    private addLinkValidator(md: MarkdownIt): void {
        const validateLink: (link: string) => boolean = md.validateLink;
        md.validateLink = (link: string): boolean => {
            return validateLink(link) || link.startsWith('file:');
        };
    }
}

class MarkdownConfiguration {
    public readonly extRoot: string;
    public readonly fontSize: number;
    public readonly lineHeight: number;
    public readonly fontFamily: string;

    constructor() {
        const markdownConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('markdown', null);
        this.extRoot = path.join(vscode.env.appRoot, 'extensions', 'markdown-language-features');
        this.fontSize = Math.max(8, Number(markdownConfig.get<number>('preview.fontSize', NaN)));
        this.lineHeight = Math.max(0.6, Number(markdownConfig.get<number>('preview.lineHeight', NaN)));
        this.fontFamily = this.resolveFontFamily(markdownConfig);
    }

    private resolveFontFamily(config: vscode.WorkspaceConfiguration): string {
        let fontFamily: string = config.get<string>('preview.fontFamily', '');
        if (isWindows() && fontFamily === config.inspect<string>('preview.fontFamily')!.defaultValue) {
            fontFamily = `${fontFamily}, 'Microsoft Yahei UI'`;
        }
        return fontFamily;
    }
}

export const markdownEngine: MarkdownEngine = new MarkdownEngine();
