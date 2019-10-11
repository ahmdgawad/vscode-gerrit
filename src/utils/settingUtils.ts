/*
 * @Author: liupei
 * @Date: 2019-10-11 18:23:01
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-11 18:24:32
 */

import * as vscode from 'vscode';

export function getWorkspaceConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration('gerrit');
}
