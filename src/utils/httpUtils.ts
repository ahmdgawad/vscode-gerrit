/*
 * @Author: liupei 
 * @Date: 2019-09-26 14:43:13 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-29 12:21:21
 */

import axios from 'axios';

import { Account, RequestConfig, UserDetail } from '../shared';

axios.defaults.baseURL = 'http://gerrit.zhenguanyu.com';
axios.defaults.maxRedirects = 0;

export async function getGerritAccount(account: Account): Promise<null> {
    const accountStr = Object.entries(account)
        .map(item => `${item[0]}=${item[1]}`)
        .join('&');

    return axios({
        url: '/login',
        method: 'POST',
        data: accountStr,
    }).catch(resp => resp.response.headers['set-cookie'][0])
    .catch(error => null);
}

export async function getXsrfToken(cookie: string): Promise<null> {
    return axios({
        url: '/',
        method: 'GET',
        headers: { cookie },
    }).then(resp => resp.headers['set-cookie'][0])
    .catch(error => null);
}

export async function getUserDetail(requestConfig: RequestConfig) {
    const { headers, data } = requestConfig;

    return axios({
        url: '/accounts/self/detail',
        method: 'GET',
        headers,
        data
    });
}

export async function getChanges(requestConfig: RequestConfig) {
    const { headers, data } = requestConfig;

    return axios({
        url: `/changes/?q=is:open+owner:self
            &q=is:open+reviewer:self+-owner:self
            &q=is:closed+(owner:self+OR+reviewer:self)+-age:4w+limit:10`,
        method: 'GET',
        headers,
        data
    });
}
