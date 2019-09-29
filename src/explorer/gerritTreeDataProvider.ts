/*
 * @Author: liupei 
 * @Date: 2019-09-27 16:43:48 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-29 17:34:11
 */

import * as path from 'path';
import * as vscode from 'vscode';

import { GerritNode } from './gerritNode';
import { gerritManager } from '../gerritManager';
import { explorerNodeManager } from './explorerNodeManager';
import { DEFAULT_CHANGE, CATEGORY, CHANGE_STATUS } from '../shared';

export class GerritTreeDataprovider implements vscode.TreeDataProvider<GerritNode> {
    private context: vscode.ExtensionContext = {} as vscode.ExtensionContext;
    private onDidChangeTreeDataEvent: vscode.EventEmitter<GerritNode | undefined | null> = new vscode.EventEmitter<GerritNode | undefined | null>();
    
    public readonly onDidChangeTreeData: vscode.Event<any> = this.onDidChangeTreeDataEvent.event;

    public initialize(context: vscode.ExtensionContext): void {
        this.context = context;
    }

    public async refresh(): Promise<void> {
        await explorerNodeManager.refreshCache();
        this.onDidChangeTreeDataEvent.fire();
    }
    
    public getTreeItem(element: GerritNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        if (element.type === 'notSignIn') {
            return {
                label: element.subject,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                command: {
                    command: 'gerrit.signin',
                    title: 'Sign in to Gerrit',
                },
            };
        }

        const title = this.getSubCategoryTitle(element);
        return {
            label: title,
            tooltip: title,
            iconPath: this.getSubCategoryIcon(element),
            command: element.isFile ? element.previewCommand : undefined,
            collapsibleState: element.isFile
                ? vscode.TreeItemCollapsibleState.None
                : element.isChange
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.Expanded,
        };
    }

    public getChildren(element?: GerritNode | undefined): vscode.ProviderResult<GerritNode[]> {
        if (gerritManager.getUserName() === 'Unknown') {
            return [
                new GerritNode(Object.assign({}, DEFAULT_CHANGE, {
                    type: 'notSignIn',
                    subject: 'Sign in to Gerrit',
                }), false),
            ];
        }

        if (!element) {
            return explorerNodeManager.getRootNodes();
        } else {
            switch(element.type) {
                case CATEGORY.OUTGOING_REVIEWS:
                    return explorerNodeManager.getOutgoingReviewsNodes();
                case CATEGORY.INCOMING_REVIEWS:
                    return explorerNodeManager.getIncomingReviewsNodes();
                case CATEGORY.RECENTLY_CLOSED:
                    return explorerNodeManager.getRecentlyClosedNodes();
                default:
                    return [];
            }
        }
    }

    private getSubCategoryTitle(element: GerritNode) {
        if (!element.isChange && !element.isFile) {
            return element.subject;
        } else if(element.isChange) {
            return `(${element.owner.name}) [${element.subject}] (${element.project}/${element.branch}) (Updated: ${element.updateTime})`
        }
        
        return element.subject;
    }

    private getSubCategoryIcon(element: GerritNode) {
        const codeReviewLabels = element.labels["Code-Review"]
        if (element.type) {
            switch(element.type) {
                case CATEGORY.OUTGOING_REVIEWS:
                    return this.getIconAbsolutePath('outgoing.svg');
                case CATEGORY.INCOMING_REVIEWS:
                    return this.getIconAbsolutePath('incoming.svg');
                case CATEGORY.RECENTLY_CLOSED:
                    return this.getIconAbsolutePath('recently.svg');
                default:
                    break;
            }
        } else if (element.status === CHANGE_STATUS.MERGED) {
            return this.getIconAbsolutePath('merged.svg');
        } else if (element.status === CHANGE_STATUS.ABANDONED) {
            return this.getIconAbsolutePath('abandoned.svg');
        } else if (element.status === CHANGE_STATUS.NEW && codeReviewLabels.approved) {
            return this.getIconAbsolutePath('+2.svg');
        } else if (codeReviewLabels.value) {
            switch(codeReviewLabels.value) {
                case CHANGE_STATUS["+1"]:
                    return this.getIconAbsolutePath('+1.svg');
                case CHANGE_STATUS["-1"]:
                    return this.getIconAbsolutePath('-1.svg');
                case CHANGE_STATUS["-2"]:
                    return this.getIconAbsolutePath('-2.svg');
                default:
                    break;
            }
        } else if (element.status === CHANGE_STATUS.NEW) {
            return this.getIconAbsolutePath('new.svg'); 
        }
    }

    private getIconAbsolutePath(fileName: string) {
        return this.context.asAbsolutePath(path.join('resources', fileName));
    }
}

export const gerritTreeDataprovider: GerritTreeDataprovider = new GerritTreeDataprovider();
