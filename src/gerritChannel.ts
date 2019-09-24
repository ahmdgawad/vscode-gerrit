/*
 * @Author: liupei 
 * @Date: 2019-09-24 20:50:56 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-24 20:58:21
 */

import * as vscode from 'vscode';

class GerritChannel implements vscode.Disposable {
    private readonly channel: vscode.OutputChannel = vscode.window.createOutputChannel('Gerrit');

    public appendLine(message: string): void {
        this.channel.appendLine(message);
    }

    public append(message: string): void {
        this.channel.append(message);
    }

    public show(): void {
        this.channel.show();
    }

    public dispose(): void {
        this.channel.dispose();
    }
}

export const gerritChannel: GerritChannel = new GerritChannel();
