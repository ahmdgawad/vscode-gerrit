/*
 * @Author: liupei
 * @Date: 2019-10-12 10:27:35
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-14 15:59:08
 */

import * as vscode from 'vscode';

import { GerritWebview } from './gerritWebview';
import { GerritWebviewOption } from '../shared';
import { markdownEngine } from './markdownEngine';
import { GerritNode } from '../explorer/gerritNode';

class GerritPreviewProvider extends GerritWebview {
    protected readonly viewType: string = 'gerrit.preview';

    private node: GerritNode | undefined;
    private description: string | undefined;
    private sideMode: boolean = false;

    public isSideMode(): boolean {
        return this.sideMode;
    }

    public show(descString: string, node: GerritNode, isSideMode: boolean = false): void {
        this.description = descString;
        this.node = node;
        this.sideMode = isSideMode;
        this.showWebviewInternal();
    }

    protected getWebviewContent(): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src vscode-resource: 'unsafe-inline'; style-src vscode-resource: 'unsafe-inline';"/>
                <style>
                    code { white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <pre>${this.description}</pre>
            </body>
            </html>
        `;
    }

    protected getWebviewOption(): GerritWebviewOption {
        if (!this.sideMode && this.node) {
            return {
                title: `${this.node.subject}`,
                viewColumn: vscode.ViewColumn.One,
            };
        } else {
            return {
                title: '测试一下',
                viewColumn: vscode.ViewColumn.Two,
                preserveFocus: true,
            };
        }
    }
}

export const gerritPreviewProvider: GerritPreviewProvider = new GerritPreviewProvider();
