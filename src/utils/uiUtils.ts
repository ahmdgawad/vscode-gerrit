/*
 * @Author: liupei
 * @Date: 2019-09-24 20:26:38
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-11 18:40:59
 */

import * as vscode from 'vscode';

import { gerritChannel } from '../gerritChannel';
import { DialogType, DialogOptions } from '../shared';
import { getWorkspaceConfiguration } from './settingUtils';

export async function promptForOpenOutputChannel(message: string, type: DialogType, info?: any) {
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

    if (info) {
        gerritChannel.appendLine(info.toString());
    }

    if (result === DialogOptions.open) {
        gerritChannel.show();
    }
}

export async function promptHintMessage(config: string, message: string, choiceConfirm: string, onConfirm: () => Promise<any>): Promise<void> {
    if (getWorkspaceConfiguration().get<boolean>(config)) {
        const choiceNoShowAgain: string = `Don't show again`;
        const choice: string | undefined = await vscode.window.showInformationMessage(
            message,
            choiceConfirm,
            choiceNoShowAgain,
        );
        switch (choice) {
            case choiceConfirm:
                await onConfirm();
                break;
            case choiceNoShowAgain:
                await getWorkspaceConfiguration().update(config, false, true);
                break;
            default:
                break;
        }
    }
}

export async function openSettingsEditor(query?: string): Promise<void> {
    await vscode.commands.executeCommand('workbench.action.openSettings', query);
}

export async function openUrl(url: string): Promise<void> {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
}
