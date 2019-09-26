/*
 * @Author: liupei 
 * @Date: 2019-09-26 14:33:24 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-26 20:28:31
 */

import * as vscode from 'vscode';
import * as cp from 'child_process';
import { EventEmitter } from 'events';

import { UserStatus, Account } from './shared';
import { gerritExecutor } from './gerritExecutor';

class GerritManager extends EventEmitter {
    private currentUser: Account;
    private userStatus: UserStatus;

    constructor() {
        super();
        this.currentUser = this.setNullUser();
        this.userStatus = UserStatus.SignedOut;
    }

    public async getLoginStatus(): Promise<void> {
        try {
            const result: Account = await gerritExecutor.getUserInfo();
        } catch (error) {
            this.currentUser = this.setNullUser();
            this.userStatus = UserStatus.SignedOut;
        } finally {
            this.emit('statusChanged');
        }
    }

    public setNullUser(): Account {
        return {
            username: undefined,
            password: undefined,
        };
    }

    public getStatus(): UserStatus {
        return this.userStatus;
    }

    public getUsername(): string | undefined {
        return this.currentUser.username;
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
                // const 
            });
        } catch (error) {

        }
    }

}

export const gerritManager: GerritManager = new GerritManager();
