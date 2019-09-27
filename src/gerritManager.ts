/*
 * @Author: liupei 
 * @Date: 2019-09-26 14:33:24 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-27 20:26:51
 */

import * as vscode from 'vscode';
import * as cp from 'child_process';
import { EventEmitter } from 'events';

import { UserStatus, UserDetail } from './shared';
import { gerritExecutor } from './gerritExecutor';

class GerritManager extends EventEmitter {
    private user: UserDetail;
    private userStatus: UserStatus;

    constructor() {
        super();
        this.user = this.setNullUser();
        this.userStatus = UserStatus.SignedOut;
    }

    public async getLoginStatus(): Promise<void> {
        try {
            this.user = await gerritExecutor.getUserInfo();
            this.userStatus = UserStatus.SignedIn;
        } catch (error) {
            this.user = this.setNullUser();
            this.userStatus = UserStatus.SignedOut;
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
            const userName: string | undefined = await new Promise(async (resolve: (res: string | undefined) => void, reject: (e: Error) => void): Promise<void> => {
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
            });
        } catch (error) {

        }
    }

}

export const gerritManager: GerritManager = new GerritManager();
