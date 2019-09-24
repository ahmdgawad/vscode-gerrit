/*
 * @Author: liupei 
 * @Date: 2019-09-24 20:26:38 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-24 22:41:12
 */

import * as vscode from 'vscode';
import { gerritChannel } from '../gerritChannel';

export namespace DialogOptions {
    export const no: vscode.MessageItem = { title: 'No', isCloseAffordance: true };
    export const yes: vscode.MessageItem = { title: 'Yes'};
    export const open: vscode.MessageItem = { title: 'Open'};
    export const never: vscode.MessageItem = { title: 'Never'};
    export const singUp: vscode.MessageItem = { title: 'Sign uo'};
}

export enum DialogType {
    INFO = 'info',
    ERROR = 'error',
    WARNING = 'warning',
}

export const promptForOpenOutputChannel = async (message: string, type: DialogType) => {
    let result: vscode.MessageItem | undefined;

    switch (type) {
        case DialogType.INFO:
            result = await vscode.window.showInformationMessage(message, DialogOptions.open, DialogOptions.no);
            break;
        case DialogType.ERROR:
            result = await vscode.window.showErrorMessage(message, DialogOptions.open, DialogOptions.no);
            break;
        case DialogType.WARNING:
            result = await vscode.window.showWarningMessage(message, DialogOptions.open, DialogOptions.no);
            break;
        default:
            break;
    }

    if (result === DialogOptions.open) {
        gerritChannel.show();
    }
}

export const openUrl = async (url: string): Promise<void> => {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
}
