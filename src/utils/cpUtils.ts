/*
 * @Author: liupei 
 * @Date: 2019-09-24 21:41:43 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-25 10:37:03
 */

import * as vscode from 'vscode';
import * as cp from 'child_process';

import { gerritChannel } from '../gerritChannel';

interface IExecError extends Error {
    result?: string;
}

export async function executeCommand(command: string, args: string[], options: cp.SpawnOptions = { shell: true }): Promise<string> {
    return new Promise((resolve: (res: string) => void, reject: (e: Error) => void): void => {
        let result: string = '';

        const childProc: cp.ChildProcess = cp.spawn(command, args, {
            ...options,
            env: createEnvOption(),
        });

        childProc.stdout.on('data', (data: string | Buffer) => {
            data = data.toString();
            result = result.concat(data);
            gerritChannel.append(data);
        });

        childProc.stderr.on('data', (data: string | Buffer) => gerritChannel.append(data.toString()));

        childProc.on('error', reject);

        childProc.on('close', (code: number) => {
            if (code !== 0 || result.indexOf('ERROR') > -1) {
                const error: IExecError = new Error(`Command "${command} ${args.toString()}" failed with exit code "${code}".`);
                if (result) {
                    error.result = result;
                }
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

export function createEnvOption(): {} {
    const proxy: string | undefined = getHttpAgent();
    if (proxy) {
        const env = Object.create(process.env);
        env.http_proxy = proxy;
        return env;
    }
    return process.env;
}

export function getHttpAgent(): string | undefined {
    return vscode.workspace.getConfiguration('http').get<string>('proxy');
}
