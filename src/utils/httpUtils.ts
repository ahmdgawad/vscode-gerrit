/*
 * @Author: liupei
 * @Date: 2019-09-26 14:43:13
 * @Last Modified by: liupei
 * @Last Modified time: 2019-10-14 16:49:21
 */

import axios from 'axios';
import { Account, RequestConfig } from '../shared';

axios.defaults.baseURL = 'https://gerrit.ericsson.se';
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
            &q=is:closed+(owner:self+OR+reviewer:self)+-age:4w+limit:10
            &O=881`,
        method: 'GET',
        headers,
        data
    });
}

export async function getRevisions(requestConfig: RequestConfig) {
    const { headers, data } = requestConfig;

    return axios({
        url: `/changes/${data.id}/detail?O=10004`,
        method: 'GET',
        headers,
        data
    });
}

export async function getRevisionFiles(requestConfig: RequestConfig) {
    const { headers, data } = requestConfig;

    return axios({
        url: `/changes/${data.id}/revisions/${data.revision}/files`,
        method: 'GET',
        headers,
        data
    });
}

export async function getFileDiffContent(requestConfig: RequestConfig) {
    const { headers, data } = requestConfig;

    return axios({
        url: `/changes/${data.id}/revisions/${data.revision}/files/${encodeURIComponent(data.file)}/diff?${data.base ? `base=${data.base}&` : ``}context=ALL&intraline`,
        method: 'GET',
        headers,
    });
}
