import 'es6-promise'
import 'whatwg-fetch'
import {getSessionItem} from '../utils/sessionStorage'

export function getOnceData(url, params=null) {
    url = addParams(url, params);
    const RESULT = fetch(url);
    return RESULT;
}
export function getHttpData(url, params = null) {
    // let temp_token = getSessionItem('mayihr_token')
    url = addParams(url, params);
    const RESULT = fetch(url, {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'authorization': `bearer ${getSessionItem('mayihr_token')}`,
        }
    });
    return RESULT;
}
export function getUserMsg(url) {
    return fetch(url, {
        headers: {
            'Accept': 'application/json, text/plain, */*',
        }
    })
        .then(res => {
            return res.json()
        })
        .then(json => {
            return json.data
        });
}


function addParams(url, params) {
    if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return url;
}