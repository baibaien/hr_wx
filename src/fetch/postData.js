import 'es6-promise'
import 'whatwg-fetch'
import {getSessionItem} from '../utils/sessionStorage'

function obj2params(obj) {
    var result = '';
    var item;
    for (item in obj) {
        result += '&' + item + '=' + encodeURIComponent(obj[item])
    }
    return result;
}

export function postHttpData(url, data_source, data_type = 'json') {
    let headers = data_type === 'json'
        ? {
            'authorization': `bearer ${getSessionItem('mayihr_token')}`,
            'Content-type': 'application/json'
        }
        : {
            'authorization': `bearer ${getSessionItem('mayihr_token')}`
        };
    let result = fetch(url, {
        method: 'POST',
        headers: headers,
        // body: obj2params(data_source)
        body: data_type === 'json' ? JSON.stringify(data_source) : data_source
    });
    return result;
}
export function patchHttpData(url, data_source) {
    let headers = {
        'authorization': `bearer ${getSessionItem('mayihr_token')}`,
        'Content-type': 'application/json'
    };
    let result = fetch(url, {
        method: 'PATCH',
        headers: headers,
        // body: obj2params(data_source)
        body: data_type === 'json' ? JSON.stringify(data_source) : data_source
    });
    return result;
}