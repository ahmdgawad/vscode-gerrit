/*
 * @Author: liupei
 * @Date: 2019-10-14 11:52:18
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-14 17:08:10
 */

import * as vscode from 'vscode';

import { EXTENSION_SCHEME } from '../shared';

export function uriParse(uriStr: string): vscode.Uri {
    return vscode.Uri.parse(uriStr);
}

export function createUriString(textKey: string, timestamp: number): string {
    return `${EXTENSION_SCHEME}:${textKey}?_ts=${timestamp}`;
}
