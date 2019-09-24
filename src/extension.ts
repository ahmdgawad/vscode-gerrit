/*
 * @Author: liupei 
 * @Date: 2019-09-24 15:00:07 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-24 15:00:30
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});
	context.subscriptions.push(disposable);
}
