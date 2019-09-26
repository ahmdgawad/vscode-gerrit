/*
 * @Author: liupei 
 * @Date: 2019-09-24 20:21:45 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-26 20:40:26
 */

import * as vscode from 'vscode';

import { UserStatus } from '../shared';
import { GerritStatusBarItem } from './GerritStatusBarItem';

class GerritStatusBarController implements vscode.Disposable {
    private statusBar: GerritStatusBarItem;
    private configurationChangeListener: vscode.Disposable;

    constructor() {
        this.statusBar = new GerritStatusBarItem();
        this.setStatusBarVisibility();
        this.configurationChangeListener = vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
            if (event.affectsConfiguration('gerrit.enableStatusBar')) {
                this.setStatusBarVisibility();
            }
        }, this);
    }

    private setStatusBarVisibility(): void {
        if (this.isStatusBarEnabled()) {
            this.statusBar.show();
        } else {
            this.statusBar.hide();
        }
    }

    private isStatusBarEnabled(): boolean {
        const configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();
        return configuration.get<boolean>('leetcode.enableStatusBar', true);
    }

    public updateStatusBar(status: UserStatus, name?: string): void {
        this.statusBar.updateStatesBar(status, name);
    }

    public dispose(): void {
        this.statusBar.dispose();
        this.configurationChangeListener.dispose();
    }
}

export const gerritStatusBarController: GerritStatusBarController = new GerritStatusBarController();
