/*
 * @Author: liupei
 * @Date: 2019-10-11 15:21:30
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-11 18:47:34
 */

import * as vscode from 'vscode';

import { GerritWebviewOption } from '../shared';
import { markdownEngine } from './markdownEngine';
import { promptHintMessage, openSettingsEditor } from '../utils/uiUtils';

export abstract class GerritWebview implements vscode.Disposable {
    protected readonly viewType: string = 'gerrit.webview';
    protected panel: vscode.WebviewPanel | undefined;

    private listeners: vscode.Disposable[] = [];

    protected showWebviewInternal(): void {
        const { title, viewColumn, preserveFocus } = this.getWebviewOption();
        if (!this.panel) {
            this.panel = vscode.window.createWebviewPanel(this.viewType, title, {
                viewColumn,
                preserveFocus,
            }, {
                enableScripts: true,
                enableFindWidget: true,
                enableCommandUris: true,
                retainContextWhenHidden: true,
                localResourceRoots: markdownEngine.localResourceRoots,
            });
            this.panel.onDidDispose(this.onDidDisposeWebview, this, this.listeners);
            this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, this, this.listeners);
            vscode.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.listeners);
        } else {
            this.panel.title = title;
            this.panel.reveal(viewColumn, preserveFocus);
        }
        this.panel.webview.html = this.getWebviewContent();
        this.showMarkdownConfigHint();
    }

    protected onDidDisposeWebview(): void {
        this.panel = undefined;
        for (const listener of this.listeners) {
            listener.dispose();
        }
        this.listeners = [];
    }

    protected async onDidChangeConfiguration(event: vscode.ConfigurationChangeEvent): Promise<void> {
        if (this.panel && event.affectsConfiguration('markdown')) {
            this.panel.webview.html = this.getWebviewContent();
        }
    }

    protected async onDidReceiveMessage(_message: any): Promise<void> { }

    protected abstract getWebviewOption(): GerritWebviewOption;

    protected abstract getWebviewContent(): string;

    public dispose(): void {
        if (this.panel) {
            this.panel.dispose();
        }
    }

    private async showMarkdownConfigHint(): Promise<void> {
        await promptHintMessage(
            `hint.configWebviewMarkdown`,
            `You can change the webview appearance ("fontSize", "lineWidth", "fontFamily") in "markdown.preview" configuration.`,
            `Open settings`,
            (): Promise<any> => openSettingsEditor('markdown.preview'),
        );
    }
}
