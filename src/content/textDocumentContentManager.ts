/*
 * @Author: liupei
 * @Date: 2019-10-14 12:07:04
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-14 17:27:45
 */

import * as vscode from 'vscode';

import { gerritExecutor } from '../gerritExecutor';
import { GerritNode } from '../explorer/gerritNode';
import { TEXT_KEY, TextDocumentContent } from '../shared';

class TextDocumentContentManager implements vscode.Disposable {
    private readonly data: Map<string, TextDocumentContent>;

    constructor() {
        this.data = new Map();
    }

    public set(textKey: string, content: string): void {
        const expires = new Date().getTime() + 3 * 60 * 1000;
        this.data.set(textKey, {
            content,
            expires,
        });
    }

    public get(textKey: string): TextDocumentContent {
        return this.data.get(textKey) || {
            content: '',
            expires: 0,
        };
    }

    public async cacheFileDiff(node: GerritNode, timestamp: number): Promise<void> {
        const { subject } = node;
        const textKeyA = TEXT_KEY.DIFF_A + subject;
        const textKeyB = TEXT_KEY.DIFF_B + subject;
        const diffAExpires = this.get(textKeyA).expires;
        const diffBExpires = this.get(textKeyB).expires;
        if (diffAExpires > timestamp && diffBExpires > timestamp) {
            return;
        }

        const content = await gerritExecutor.getFileDiffContent(node);
        this.set(TEXT_KEY.DIFF_A + subject, content.diffA);
        this.set(TEXT_KEY.DIFF_B + subject, content.diffB);
    }

    public dispose(): void {
        this.data.clear();
    }
}

export const textDocumentContentManager: TextDocumentContentManager = new TextDocumentContentManager();
