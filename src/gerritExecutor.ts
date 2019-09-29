/*
 * @Author: liupei 
 * @Date: 2019-09-24 20:59:24 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-29 17:01:45
 */

import * as cp from 'child_process';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as vscode from 'vscode';

import { executeCommand } from './utils/cpUtils';
import { useWsl, toWslPath } from './utils/wslUtils';
import { DialogOptions, openUrl } from './utils/uiUtils';
import { Account, UserDetail, HttpResponse, Change } from './shared';
import { getGerritAccount, getXsrfToken, getUserDetail, getChanges } from './utils/httpUtils';

const NORMAL_NODE_EXECUTABLE = 'node';

class GerritExecutor implements vscode.Disposable {
    private configurationChangeListener: vscode.Disposable;
    private nodeExecutable: string;

    public gerritAccount: string | null = null;
    public XGerritAuth: string | null = null;
    public account: Account = {
        username: '',
        password: '',
    };

    constructor() {
        this.nodeExecutable = this.getNodePath();
        this.configurationChangeListener = vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
            if (event.affectsConfiguration('gerrit.nodePath')) {
                this.nodeExecutable = this.getNodePath();
            }
        });
        this.onInit();
    }

    async onInit() {
        this.gerritAccount = await getGerritAccount({
            username: 'liupei01',
            password: 'Lp19970127',
        } || this.account);
		if (this.gerritAccount) {
			this.XGerritAuth = await getXsrfToken(this.gerritAccount);
        }
    }

    private getNodePath(): string {
        const extensionConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('gerrit', null);
        return extensionConfig.get<string>('nodePath', 'node');
    }

    private async executeCommandEx(command: string, args: string[], options: cp.SpawnOptions = { shell: true }): Promise<string> {
        if (useWsl()) {
            return await executeCommand('wsl', [command].concat(args), options);
        }
        return await executeCommand(command, args, options);
    }

    public async meetRequirements(): Promise<boolean> {
        if (this.nodeExecutable !== NORMAL_NODE_EXECUTABLE) {
            if (!await fse.pathExists(this.nodeExecutable)) {
                throw new Error(`The Node.js executable does not exist on path ${this.nodeExecutable}`);
            }
            this.nodeExecutable = `"${this.nodeExecutable}"`;
            if (useWsl()) {
                this.nodeExecutable = await toWslPath(this.nodeExecutable);
            }
        }

        try {
            await this.executeCommandEx(this.nodeExecutable, ['-v']);
        } catch (error) {
            const choice: vscode.MessageItem | undefined = await vscode.window.showErrorMessage(
                'Gerrit extension needs Node.js installed in environment path',
                DialogOptions.open,
            );
            if (choice === DialogOptions.open) {
                openUrl('https://nodejs.org');
            }
            return false;
        }

        return true;
    }

    public async getUserInfo(): Promise<UserDetail> {
        return this.fetch(getUserDetail);
    }

    public async getChanges(): Promise<Change[][]> {
        return this.fetch(getChanges);
    }

    public async fetch(api: Function, data?: any) {
        if (!this.gerritAccount || !this.XGerritAuth) {
            await this.onInit();
        }

        return api({
            headers: {
                cookie: this.gerritAccount,
                'X-Gerrit-Auth': this.XGerritAuth,
            },
            data,
        }).then((resp: HttpResponse) => JSON.parse(resp.data.slice(4)));
    }

    public dispose(): void {
        this.configurationChangeListener.dispose();
    }
}

export const gerritExecutor: GerritExecutor = new GerritExecutor();
