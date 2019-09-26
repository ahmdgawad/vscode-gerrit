/*
 * @Author: liupei 
 * @Date: 2019-09-26 14:43:13 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-26 18:50:22
 */

import axios from 'axios';

import { Account } from '../shared';

axios.defaults.baseURL = 'http://gerrit.zhenguanyu.com';
axios.defaults.maxRedirects = 0;

export async function getGerritAccount(account: Account) {
    const accountStr = Object.entries(account)
        .map(item => `${item[0]}=${item[1]}`)
        .join('&');

    return axios({
        url: '/login',
        method: 'POST',
        data: accountStr,
    }).catch(resp => resp.response.headers['set-cookie'][0]);
}

export async function getXsrfToken(cookie: string) {
    return axios({
        url: '/',
        method: 'GET',
        headers: { cookie },
    }).then(resp => resp.headers['set-cookie'][0]);
}
