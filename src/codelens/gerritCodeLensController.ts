/*
 * @Author: liupei
 * @Date: 2019-10-15 12:07:42
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-15 12:33:30
 */

import * as vscode from 'vscode';

import { EXTENSION_SCHEME } from '../shared';
import { GerritCodeLensProvider } from './gerritCodeLensProvider';

class GerritCodeLensController implements vscode.Disposable {
    private registeredProvider: vscode.Disposable;
    private gerritCodelensProvider: GerritCodeLensProvider;

    constructor() {
        this.gerritCodelensProvider = new GerritCodeLensProvider();
        this.registeredProvider = vscode.languages.registerCodeLensProvider({
            scheme: EXTENSION_SCHEME,
        }, this.gerritCodelensProvider);
        // vscode.languages.registerHoverProvider('javascript', {
        //     provideHover(document, position, token) {
        //         return {
        //             contents: ['Hover Content']
        //         };
        //     }
        // });
        // vscode.languages.registerHoverProvider('typescript', {
        //     provideHover(document, position, token) {
        //         return {
        //             contents: ['Hover Content']
        //         };
        //     }
        // });
        // vscode.languages.registerCodeLensProvider('typescript', {
        //     provideCodeLenses(document) {
        //         const range: vscode.Range = new vscode.Range(document.lineCount - 1, 0, document.lineCount - 1, 0);
        //         return [
        //             new vscode.CodeLens(range, {
        //                 title: '3',
        //                 command: 'gerrit.signout',
        //                 arguments: [document.uri],
        //             })
        //         ];
        //     }
        // });
    }

    public dispose(): void {
        this.registeredProvider.dispose();
    }
}

export const gerritCodeLensController: GerritCodeLensController = new GerritCodeLensController();
