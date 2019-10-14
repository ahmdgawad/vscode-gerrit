/*
 * @Author: liupei
 * @Date: 2019-10-14 11:48:01
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-14 17:24:50
 */

import * as vscode from 'vscode';

import { textDocumentContentManager } from './textDocumentContentManager';

class GerritTextDocumentContentProvider implements vscode.TextDocumentContentProvider {

    provideTextDocumentContent(uri: vscode.Uri): string {
        return textDocumentContentManager.get(uri.path).content;
    }
}

export const gerritTextDocumentContentProvider: GerritTextDocumentContentProvider = new GerritTextDocumentContentProvider();
