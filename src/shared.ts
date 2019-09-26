/*
 * @Author: liupei 
 * @Date: 2019-09-26 14:36:12 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-26 20:28:23
 */

import * as vscode from 'vscode';

export enum UserStatus {
    SignedIn = 1,
    SignedOut = 2,
}

export interface Account {
    username: string | undefined;
    password: string | undefined;
}
