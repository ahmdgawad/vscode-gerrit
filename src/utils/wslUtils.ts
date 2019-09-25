/*
 * @Author: liupei 
 * @Date: 2019-09-24 22:11:57 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-25 10:35:35
 */

import * as vscode from 'vscode';

import { isWindows } from './osUtils';
import { executeCommand } from './cpUtils';

export function useWsl(): boolean {
    const gerritCodeConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('gerrit');
    return isWindows() && gerritCodeConfig.get<boolean>('useWsl') === true;
}

export async function toWslPath(path: string): Promise<string> {
    const wslPath = await executeCommand('wsl', ['wslpath', '-u', `"${path.replace(/\\/g, '/')}"`]);
    return wslPath.trim();
}

export async function toWinPath(path: string): Promise<string> {
    const winPath = await executeCommand('wsl', ['wslpath', '-v', `"${path}"`]);
    return winPath.trim();
}
