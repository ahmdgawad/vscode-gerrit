/*
 * @Author: liupei
 * @Date: 2019-09-26 14:36:12
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-11 18:02:04
 */

import * as vscode from 'vscode';


// 登录信息
export interface Account {
    username: string | undefined;
    password: string | undefined;
}

// 用户状态
export enum UserStatus {
    SignedIn = 1,
    SignedOut = 2,
}

// 状态栏信息分类
export enum StatusInfoType {
    Status = 1,
    ChangeInfo = 2,
}

// 弹窗选项配置
export namespace DialogOptions {
    export const no: vscode.MessageItem = { title: 'No', isCloseAffordance: true };
    export const yes: vscode.MessageItem = { title: 'Yes' };
    export const open: vscode.MessageItem = { title: 'Open' };
    export const never: vscode.MessageItem = { title: 'Never' };
    export const singUp: vscode.MessageItem = { title: 'Sign uo' };
}

// 提示类型
export enum DialogType {
    INFO = 'info',
    ERROR = 'error',
    WARNING = 'warning',
}

// 用户详情
export interface UserDetail {
    name?: string;
    email: string;
    username: string;
    _account_id?: number;
    registered_on?: string;
    avatars?: [
        {
            url: string;
            height: number;
        }
    ];
}

// 得分标记
export interface ChangeLabels {
    ['Code-Review']: {
        ['value']?: number;
        ['rejected']?: any;
        ['approved']?: any;
        ['recommended']?: any;
    };
}

// 一次提交的描述
export interface Change {
    id: string;
    type: string;
    _number: number;
    project: string;
    branch: string;
    status: string;
    subject: string;
    change_id: string;
    updated: string;
    created: string;
    mergeable: boolean;
    submittable: boolean;
    insertions: number;
    deletions: number;
    hashtags: string[];
    owner: UserDetail;
    labels: ChangeLabels;
}

// 提交的修订版本
export interface Revision {
    ref: string;
    _number: number;
    created: string;
    uploader: UserDetail;
}

// change 默认选项
export const DEFAULT_CHANGE = {
    id: '',
    type: '',
    _number: 0,
    project: '',
    branch: '',
    status: '',
    change_id: '',
    updated: '',
    created: '',
    mergeable: false,
    submittable: false,
    insertions: 0,
    deletions: 0,
    hashtags: [],
    labels: {
        'Code-Review': {}
    },
    owner: {
        email: 'Unknown',
        username: 'Unknown',
    },
};

// 列表类别
export const CATEGORY = {
    OUTGOING_REVIEWS: 'OUTGOING REVIEWS',
    INCOMING_REVIEWS: 'INCOMING REVIEWS',
    RECENTLY_CLOSED: 'RECENTLY CLOSED',
};

// change 状态
export const CHANGE_STATUS = {
    '0': 0,
    '+1': 1,
    '+2': 2,
    '-1': -1,
    '-2': -2,
    NEW: 'NEW',
    MERGED: 'MERGED',
    ABANDONED: 'ABANDONED',
};

// webview 配置
export interface GerritWebviewOption {
    title: string;
    preserveFocus?: boolean;
    viewColumn: vscode.ViewColumn;
}

// 状态栏信息
export interface StatusBarInfo {
    type: number;
    name?: string;
    info?: string;
}

// 请求参数配置
export interface RequestConfig {
    data: any;
    headers?: {
        cookie?: string;
        ['X-Gerrit-Auth']?: string
    };
}

// http 响应
export interface HttpResponse {
    data: any;
    status: number;
    statusText: string;
    config: {
        url: string;
        method: string;
        headers: any;
        baseUrl: string;
    };
}
