/*
 * @Author: liupei 
 * @Date: 2019-09-26 20:04:49 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-26 20:32:16
 */

import * as vscode from 'vscode';

import { UserStatus, StatusInfoType, StatusBarInfo } from '../shared';

export class GerritStatusBarItem implements vscode.Disposable {
    private readonly statusBarItem: vscode.StatusBarItem;
    private readonly type: StatusInfoType;

    constructor(type: StatusInfoType) {
        this.statusBarItem = vscode.window.createStatusBarItem();
        this.type = type;
    }

    public updateStatusBar(status: UserStatus, data?: string): void {
        switch (status) {
            case UserStatus.SignedIn:
                this.statusBarItem.text = (this.type === StatusInfoType.Status)
                    ? `Gerrit: ${data}`
                    : (this.type === StatusInfoType.ChangeInfo)
                    ? `${data}`
                    : ``;
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
