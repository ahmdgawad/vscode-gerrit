/*
 * @Author: liupei
 * @Date: 2019-10-12 10:59:22
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-12 11:04:14
 */

import * as path from 'path';
import * as fse from 'fs-extra';
import * as vscode from 'vscode';

import { GerritNode } from '../explorer/gerritNode';
import { gerritExecutor } from '../gerritExecutor';
import { explorerNodeManager } from '../explorer/explorerNodeManager';
import { gerritPreviewProvider } from '../webview/gerritPreviewProvider';

export async function previewChange(input: GerritNode | vscode.Uri, isSideMode: boolean = false) {
    let node: GerritNode;
    if (input instanceof vscode.Uri) {
        const activeFilePath: string = input.fsPath;
        const id: string = await getNodeIdFormFile(activeFilePath);
        if (!id) {
            vscode.window.showErrorMessage(`Failed to resolve the change id from file: ${activeFilePath}.`);
            return;
        }
        const cacheNode: GerritNode | undefined = explorerNodeManager.getNodeById(id);
        if (!cacheNode) {
            vscode.window.showErrorMessage(`Failed to resolve the change with id: ${id}.`);
            return;
        }
        node = cacheNode;
        isSideMode = true;
    } else {
        node = input;
    }
    const content: string = await gerritExecutor.getChangeContentDiff(node);
    gerritPreviewProvider.show(content, node, isSideMode);

}


async function getNodeIdFormFile(fsPath: string): Promise<string> {
    const fileContent: string = await fse.readFile(fsPath, 'utf-8');
    let id: string = '';
    const matchResults: RegExpMatchArray | null = fileContent.match(/@lc.+id=(.+?) /);
    if (matchResults && matchResults.length === 2) {
        id = matchResults[1];
    }
    if (!id) {
        id = path.basename(fsPath).split('.')[0];
    }
    return id;
}
