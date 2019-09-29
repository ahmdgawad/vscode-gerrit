/*
 * @Author: liupei 
 * @Date: 2019-09-27 16:43:48 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-29 14:49:23
 */

import * as vscode from 'vscode';

import { GerritNode } from './gerritNode';
import { gerritManager } from '../gerritManager';
import { explorerNodeManager } from './explorerNodeManager';
import { DEFAULT_CHANGE, CATEGORY } from '../shared';

export class GerritTreeDataprovider implements vscode.TreeDataProvider<GerritNode> {
    private context: vscode.ExtensionContext | null = null;
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

        return {
            label: element.subject,
            tooltip: this.getSubCategoryTooltip(element),
            collapsibleState: element.isFile ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed,
            command: element.isFile ? element.previewCommand : undefined,
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
                    return explorerNodeManager.getAllNodes();
                case CATEGORY.INCOMING_REVIEWS:
                    return explorerNodeManager.getAllNodes();
                case CATEGORY.RECENTLY_CLOSED:
                    return explorerNodeManager.getAllNodes();
                default:
                    return [];
            }
        }
    }

    private getSubCategoryTooltip(element: GerritNode) {
        if (!element.isChange || !element.isFile) {
            return ''
        }
        
        return element.subject;
    }
}

export const gerritTreeDataprovider: GerritTreeDataprovider = new GerritTreeDataprovider();
