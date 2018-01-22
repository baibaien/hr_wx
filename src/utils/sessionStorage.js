export function getSessionItem(session_obj, type = '') {
    let obj = JSON.parse(sessionStorage.getItem(session_obj)) ;
    if(type === 'array') {
        obj = obj || [];
        obj = obj.map(item => JSON.parse(item));
    }
    return obj;
}
export function setSessionItem(name, session_obj = '') {
    let json_str;
    if(typeof session_obj === 'Array') {
        json_str = JSON.stringify(session_obj.map(item => JSON.stringify(item)));
    }else {
        json_str = JSON.stringify(session_obj)
    }

    sessionStorage.setItem(name, json_str);
}
export function clearSessionItem(name) {
    sessionStorage.removeItem(name)
}