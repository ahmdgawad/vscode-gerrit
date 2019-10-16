/*
 * @Author: liupei
 * @Date: 2019-10-15 11:18:51
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-15 12:28:55
 */

import * as vscode from 'vscode';

export class GerritCodeLensProvider implements vscode.CodeLensProvider {
    public provideCodeLenses(document: vscode.TextDocument): vscode.ProviderResult<vscode.CodeLens[]> {
        const range: vscode.Range = new vscode.Range(document.lineCount - 1, 0, document.lineCount - 1, 0);
        const codeLens: vscode.CodeLens[] = [];
        codeLens.push(new vscode.CodeLens(range, {
            title: 'Base',
            command: 'gerrit.signout',
            arguments: [document.uri],
        }));
        codeLens.push(new vscode.CodeLens(range, {
            title: '1',
            command: 'gerrit.signout',
            arguments: [document.uri],
        }));
        codeLens.push(new vscode.CodeLens(range, {
            title: '2',
            command: 'gerrit.signout',
            arguments: [document.uri],
        }));
        codeLens.push(new vscode.CodeLens(range, {
            title: '3',
            command: 'gerrit.signout',
            arguments: [document.uri],
        }));
        return codeLens;
    }
}
