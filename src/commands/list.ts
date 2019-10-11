/*
 * @Author: liupei
 * @Date: 2019-09-27 18:59:22
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-29 15:14:10
 */

import { gerritManager } from '../gerritManager';
import { gerritExecutor } from '../gerritExecutor';
import { GerritNode } from '../explorer/gerritNode';
import { promptForOpenOutputChannel } from '../utils/uiUtils';
import { UserStatus, DialogType, Change, Revision } from '../shared';

export async function listChanges(): Promise<Change[][]> {
    const NULL_RESULT = [[], [], []];
    try {
        if (gerritManager.getStatus() === UserStatus.SignedOut) {
            return NULL_RESULT;
        }
        return (await gerritExecutor.getChanges());
    } catch (error) {
        await promptForOpenOutputChannel('Failed to list changes. Please open the output channel for details.', DialogType.ERROR, error);
        return NULL_RESULT;
    }
}

export async function listFiles(element: GerritNode): Promise<string[]> {
    try {
        if (gerritManager.getStatus() === UserStatus.SignedOut) {
            return [];
        }
        const currentRevision = await gerritExecutor.getCurrentRevision(element);
        return (await gerritExecutor.getCurrentRevisionFiles(element, currentRevision));
    } catch (error) {
        await promptForOpenOutputChannel('Failed to list files. Please open the output channel for details.', DialogType.ERROR, error);
        return [];
    }
}
