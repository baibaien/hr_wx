import 'es6-promise'
import 'whatwg-fetch'
import {getSessionItem} from '../utils/sessionStorage'

export function deleteHttpData(url, data_source) {
    const RESULT = fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'authorization': `bearer ${getSessionItem('mayihr_token')}`,
        },
        body: JSON.stringify(data_source)
    });
    return RESULT;
}

function obj2params(obj) {
    var result = '';
    var item;
    for (item in obj) {
        result += '&' + item + '=' + encodeURIComponent(obj[item])
    }
    return result;
}
