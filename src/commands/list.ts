/*
 * @Author: liupei 
 * @Date: 2019-09-27 18:59:22 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-27 19:39:20
 */

import * as vscode from 'vscode';

import { promptForOpenOutputChannel } from '../utils/uiUtils';
import { UserStatus, DialogType, Change, CATEGORY } from '../shared';
import { gerritManager } from '../gerritManager';
import { gerritExecutor } from '../gerritExecutor';

export async function listChanges(): Promise<Change[][]> {
    const NULL_RESULT = [[], [], []];
    try {
        if (gerritManager.getStatus() === UserStatus.SignedOut) {
            return NULL_RESULT;
        }
        const changes = await gerritExecutor.getChanges(); 
        return changes;
    } catch (error) {
        await promptForOpenOutputChannel("Failed to list problems. Please open the output channel for details.", DialogType.ERROR);
        return NULL_RESULT;
    }
}