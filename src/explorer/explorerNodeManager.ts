/*
 * @Author: liupei 
 * @Date: 2019-09-27 17:28:34 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-29 17:29:40
 */

import * as vscode from 'vscode';

import { GerritNode } from './gerritNode';
import { listChanges } from '../commands/list';
import { DEFAULT_CHANGE, CATEGORY, Change } from '../shared';

class ExplorerNodeManager implements vscode.Disposable {
    private outgoingReviewsExplorerNodeMap: Map<string, GerritNode> = new Map<string, GerritNode>();
    private incomingReviewsExplorerNodeMap: Map<string, GerritNode> = new Map<string, GerritNode>();
    private recentlyClosedExplorerNodeMap: Map<string, GerritNode> = new Map<string, GerritNode>();

    public async refreshCache(): Promise<void> {
        this.dispose();
        const changes = await listChanges();
        for (const index in changes) {
            switch(index) {
                case '0':
                    this.setExplorerNodeMap(this.outgoingReviewsExplorerNodeMap, changes[index]);
                    break;
                case '1':
                    this.setExplorerNodeMap(this.incomingReviewsExplorerNodeMap, changes[index]);
                    break;
                case '2':
                    this.setExplorerNodeMap(this.recentlyClosedExplorerNodeMap, changes[index]);
                    break;
                default:
                    break;
            }
        }
    }

    public getRootNodes(): GerritNode[] {
        return [
            new GerritNode(Object.assign({}, DEFAULT_CHANGE, {
                type: CATEGORY.OUTGOING_REVIEWS,
                subject: CATEGORY.OUTGOING_REVIEWS,
            }), false),
            new GerritNode(Object.assign({}, DEFAULT_CHANGE, {
                type: CATEGORY.INCOMING_REVIEWS,
                subject: CATEGORY.INCOMING_REVIEWS,
            }), false),
            new GerritNode(Object.assign({}, DEFAULT_CHANGE, {
                type: CATEGORY.RECENTLY_CLOSED,
                subject: CATEGORY.RECENTLY_CLOSED,
            }), false),
        ];
    }

    public getOutgoingReviewsNodes(): GerritNode[] {
        return Array.from(this.outgoingReviewsExplorerNodeMap.values());
    }

    public getIncomingReviewsNodes(): GerritNode[] {
        return Array.from(this.incomingReviewsExplorerNodeMap.values());
    }

    public getRecentlyClosedNodes(): GerritNode[] {
        return Array.from(this.recentlyClosedExplorerNodeMap.values());
    }

    private setExplorerNodeMap(map: Map<string, GerritNode>, list: Change[]) {
        for (const change of list) {
            map.set(change.id, new GerritNode(change));
        }
    }

    public dispose(): void {
        this.outgoingReviewsExplorerNodeMap.clear();
        this.incomingReviewsExplorerNodeMap.clear();
        this.recentlyClosedExplorerNodeMap.clear();
    }
}

export const explorerNodeManager: ExplorerNodeManager = new ExplorerNodeManager();
