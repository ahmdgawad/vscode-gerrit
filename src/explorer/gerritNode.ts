/*
 * @Author: liupei
 * @Date: 2019-09-27 16:46:34
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-14 16:50:12
 */

import * as vscode from 'vscode';

import { Change, ChangeLabels, UserDetail } from '../shared';

export class GerritNode {
    constructor(private data: Change, private isChangeNode: boolean = true, private isFileNode: boolean = false) { }

    public get id(): number {
        return this.data._number;
    }

    public get type(): string {
        return this.data.type;
    }

    public get changeId(): string {
        return this.data.change_id;
    }

    public get project(): string {
        return this.data.project;
    }

    public get branch(): string {
        return this.data.branch;
    }

    public get status(): string {
        return this.data.status;
    }

    public get subject(): string {
        return this.data.subject;
    }

    public get labels(): ChangeLabels {
        return this.data.labels;
    }

    public get mergeable(): boolean {
        return this.data.mergeable;
    }

    public get submittable(): boolean {
        return this.data.submittable;
    }

    public get insertions(): number {
        return this.data.insertions;
    }

    public get deletions(): number {
        return this.data.deletions;
    }

    public get revisions(): string[] {
        return this.data.revisions;
    }

    public get currentRevision(): string {
        return this.data.currentRevision;
    }

    public get owner(): UserDetail {
        return this.data.owner;
    }

    public get isChange(): boolean {
        return this.isChangeNode;
    }

    public get isFile(): boolean {
        return this.isFileNode;
    }

    public get previewCommand(): vscode.Command {
        return {
            title: 'Preview File Diff',
            command: 'gerrit.previewFileDiff',
            arguments: [this],
        };
    }

    public get createTime(): string {
        const date = new Date(new Date(this.data.created).getTime() + 8 * 60 * 60 * 1000);
        return this.getTime(date);
    }

    public get updateTime(): string {
        const date = new Date(new Date(this.data.updated).getTime() + 8 * 60 * 60 * 1000);
        return this.getTime(date);
    }

    private getTime(date: Date): string {
        const month = this.supportZero(date.getMonth());
        const day = this.supportZero(date.getDate());
        const hour = this.supportZero(date.getHours());
        const min = this.supportZero(date.getMinutes());
        return `${month}-${day} ${hour}:${min}`;
    }

    private supportZero(str: string | number, n: number = 2): string {
        return (Array(n).join('0') + str).slice(-n);
    }
}
