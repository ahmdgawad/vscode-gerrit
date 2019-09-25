/*
 * @Author: liupei 
 * @Date: 2019-09-24 22:13:05 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-25 10:36:13
 */

export function isWindows(): boolean {
    return process.platform === 'win32';
}

export function usingCmd(): boolean {
    const comSpec: string | undefined = process.env.comSpec;

    if (!comSpec) {
        return true;
    }

    if (comSpec.indexOf('cmd.exe') > -1) {
        return true;
    }

    return false;
}
