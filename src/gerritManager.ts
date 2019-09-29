/*
 * @Author: liupei 
 * @Date: 2019-09-26 14:33:24 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-29 14:48:06
 */

import * as vscode from 'vscode';
import { EventEmitter } from 'events';

import { gerritChannel } from './gerritChannel';
import { gerritExecutor } from './gerritExecutor';
import { UserStatus, UserDetail, DialogType, Account } from './shared';
import { promptForOpenOutputChannel, DialogOptions } from './utils/uiUtils';

class GerritManager extends EventEmitter {
    private user: UserDetail;
    private userStatus: UserStatus;

    constructor() {
        super();
        this.user = this.setNullUser();
        this.userStatus = UserStatus.SignedOut;
    }

    public async getLoginStatus(): Promise<boolean> {
        try {
            this.user = await gerritExecutor.getUserInfo();
            this.userStatus = UserStatus.SignedIn;
            return true;
        } catch (error) {
            this.user = this.setNullUser();
            this.userStatus = UserStatus.SignedOut;
            gerritChannel.appendLine(error.toString());
            return false;
        } finally {
            this.emit('statusChanged');
        }
    }

    public setNullUser(): UserDetail {
        return {
            email: 'Unknown',
            username: 'Unknown',
        };
    }

    public getStatus(): UserStatus {
        return this.userStatus;
    }

    public getUserName(): string | undefined {
        return this.user.username;
    }

    public async signIn(): Promise<void> {
        try {
            const account: Account | undefined = await new Promise(async (resolve: (res: Account | undefined) => void): Promise<void> => {
                const name: string | undefined = await vscode.window.showInputBox({
                    prompt: "Enter username.",
                    validateInput: (s: string): string | undefined => s && s.trim() ? undefined : "The input must not be empty",
                });
                if (!name) {
                    return resolve(undefined);
                }

                const pwd: string | undefined = await vscode.window.showInputBox({
                    prompt: "Enter password.",
                    password: true,
                    validateInput: (s: string): string | undefined => s ? undefined : "Password must not be empty",
                });
                if (!pwd) {
                    return resolve(undefined);
                }
                
                gerritExecutor.account = {
                    username: name,
                    password: pwd,
                };

                return resolve(gerritExecutor.account);
            });

            if (account) {
                const result = await this.getLoginStatus();
                if (result) {
                    vscode.window.showInformationMessage('Successfully signed in.');
                } else {
                    throw new Error('Failed to sign in.');
                }
            }
        } catch (error) {
            promptForOpenOutputChannel('Failed to sign in. Please open the output  channel for details', DialogType.ERROR);
        }
    }

    public async  signOut() {
        if (this.user.username === 'Unknown') {
            return vscode.window.showWarningMessage('Please sign in first.');
        }

        const result = await vscode.window.showWarningMessage('Are you sure to exit?', DialogOptions.yes, DialogOptions.no);
        if (result === DialogOptions.yes) {
            gerritExecutor.gerritAccount = null;
            gerritExecutor.XGerritAuth = null;
    
            this.user = this.setNullUser();
            this.userStatus = UserStatus.SignedOut;

            setTimeout(() => {
                this.emit('statusChanged');
                vscode.window.showInformationMessage('Successfully signed out.');
            }, 1 * 1000);
        }
    }
}

export const gerritManager: GerritManager = new GerritManager();
