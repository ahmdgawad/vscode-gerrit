/*
 * @Author: liupei 
 * @Date: 2019-09-26 20:04:49 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-26 20:32:16
 */

import * as vscode from 'vscode';

import { UserStatus } from '../shared';

export class GerritStatusBarItem implements vscode.Disposable {
    private readonly statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem();
    }

    public updateStatesBar(status: UserStatus, name?: string): void {
        switch (status) {
            case UserStatus.SignedIn:
                this.statusBarItem.text = `Gerrit: ${name}`;
                break;
            case UserStatus.SignedOut:
            default:
                this.statusBarItem.text = '';
                break;
        }
    }

    public show(): void {
        this.statusBarItem.show();
    }

    public hide(): void {
        this.statusBarItem.hide();
    }

    public dispose(): void {
        this.statusBarItem.dispose();
    }
}
