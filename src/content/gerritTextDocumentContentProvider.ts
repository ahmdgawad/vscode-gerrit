/*
 * @Author: liupei
 * @Date: 2019-10-14 11:48:01
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-15 12:18:22
 */

import * as vscode from 'vscode';

import { textDocumentContentManager } from './textDocumentContentManager';

class GerritTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    public provideTextDocumentContent(uri: vscode.Uri): string {
        return textDocumentContentManager.get(uri.path).content;
    }
}

export const gerritTextDocumentContentProvider: GerritTextDocumentContentProvider = new GerritTextDocumentContentProvider();
