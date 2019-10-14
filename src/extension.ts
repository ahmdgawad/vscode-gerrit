/*
 * @Author: liupei
 * @Date: 2019-09-24 15:00:07
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-14 16:50:30
 */

import * as vscode from 'vscode';

import * as show from './commands/show';
import { gerritChannel } from './gerritChannel';
import { gerritManager } from './gerritManager';
import { gerritExecutor } from './gerritExecutor';
import { GerritNode } from './explorer/gerritNode';
import { EXTENSION_SCHEME, DialogType } from './shared';
import { gerritTextDocumentContentProvider } from './content/gerritTextDocumentContentProvider';
import { promptForOpenOutputChannel } from './utils/uiUtils';
import { explorerNodeManager } from './explorer/explorerNodeManager';
import { gerritTreeDataprovider } from './explorer/GerritTreeDataProvider';
import { gerritStatusBarController } from './statusbar/gerritStatusBarController';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	try {
		if (!await gerritExecutor.meetRequirements()) {
			throw new Error('The environment dosen');
		}

		gerritManager.on('statusChanged', () => {
			gerritStatusBarController.updateStatusBar(gerritManager.getStatus(), gerritManager.getUserName());
			gerritTreeDataprovider.refresh();
		});

		gerritTreeDataprovider.initialize(context);

		context.subscriptions.push(
			gerritChannel,
			gerritExecutor,
			explorerNodeManager,
			gerritStatusBarController,
			vscode.window.createTreeView('gerritCodeReview', { treeDataProvider: gerritTreeDataprovider, showCollapseAll: true }),
			vscode.commands.registerCommand('gerrit.signin', () => gerritManager.signIn()),
			vscode.commands.registerCommand('gerrit.signout', () => gerritManager.signOut()),
			vscode.commands.registerCommand('gerrit.previewFileDiff', (node: GerritNode) => show.previewFileDiff(node)),
			vscode.workspace.registerTextDocumentContentProvider(EXTENSION_SCHEME, gerritTextDocumentContentProvider),
		);

		await gerritManager.getLoginStatus();
	} catch (error) {
		promptForOpenOutputChannel('Extension initialization failed. Please open output channel for details.', DialogType.ERROR, error);
	}
}
