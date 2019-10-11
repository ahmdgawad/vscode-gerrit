/*
 * @Author: liupei
 * @Date: 2019-09-24 22:11:57
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-11 18:27:12
 */

import * as vscode from 'vscode';

import { isWindows } from './osUtils';
import { executeCommand } from './cpUtils';
import { getWorkspaceConfiguration } from './settingUtils';

export function useWsl(): boolean {
    const gerritCodeConfig: vscode.WorkspaceConfiguration = getWorkspaceConfiguration();
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
