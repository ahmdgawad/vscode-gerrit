/*
 * @Author: liupei 
 * @Date: 2019-09-26 14:36:12 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-27 19:04:37
 */

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
}

// 默认选项
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
    owner: {
        email: 'Unknown',
        username: 'Unknown',
    },
};

// 列表类别
export const CATEGORY = {
    OUTGOING_REVIEWS: 'OUTGOING_REVIEWS',
    INCOMING_REVIEWS: 'INCOMING_REVIEWS',
    RECENTLY_CLOSED: 'RECENTLY_CLOSED',
};

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
