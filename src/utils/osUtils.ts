/*
 * @Author: liupei 
 * @Date: 2019-09-24 22:13:05 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-24 22:19:21
 */

export const isWindows = (): boolean => process.platform === 'win32';

export const usingCmd = (): boolean => {
    const comSpec: string | undefined = process.env.comSpec;

    if (!comSpec) {
        return true;
    }

    if (comSpec.indexOf('cmd.exe') > -1) {
        return true;
    }

    return false;
}
