import 'es6-promise'
import 'whatwg-fetch'
import {RootApi} from '../service/root-api/root-api'
import {getSessionItem, setSessionItem, clearSessionItem} from '../utils/sessionStorage'
import {getAlert, showAlertModal} from '../utils/modal'
import {AccountBindUrls} from '../service/accountBind/accountBindUrl'
import {getHttpData, getUserMsg, getOnceData} from './getData';
import {postHttpData} from './postData'
import {deleteHttpData} from './deletData'

let http_count = 0;
let root_history;

export function getData(url, params) {
    checkToken(url);
    http_count++;
    // if (mayihr_token) {
    let flag = null;
    let count = 0;
    let request_timer = setInterval(() => {
        count++;
        if (!flag && count >= 10) {
            setLoading(request_timer);
        } else if (flag) {
            clearInterval(request_timer);
            request_timer = null
        }
    }, 50);
    let result = getHttpData(url, params);
    return result.then((res) => {
        flag = res;
        return stateJudge(res);
    })
        .then(json => {
            http_count = http_count >= 1 ? http_count - 1 : 0;
            if (http_count === 0) {
                removeLoading();
            }
            return json.data
        })
        .catch((err) => {
            http_count = 0;
            removeLoading();
            errHandler(err);
            throw err
        })
    // }
}

export function postData(url, data_source, content_type) {
    // checkToken();
    let flag = null;
    let count = 0;
    let request_timer = setInterval(() => {
        count++;
        if (!flag && count >= 10) {
            setLoading(request_timer);
        } else if (flag) {
            clearInterval(request_timer);
            request_timer = null
        }
    }, 50);

    let result = postHttpData(url, data_source, content_type);
    return result
        .then(res => {
                flag = res;
                return stateJudge(res);
            }
        )
        .then(json => {
            removeLoading();
            return json.data
        })
        .catch((err) => {
            removeLoading();
            errHandler(err);
            throw err
        });
}

export function deleteData(url, data_source) {
    checkToken();
    let flag = null;
    let count = 0;
    let request_timer = setInterval(() => {
        count++;
        if (!flag && count >= 6) {
            setLoading(request_timer);
        } else if (flag) {
            clearInterval(request_timer);
            request_timer = null
        }
    }, 50);
    let result = deleteHttpData(url, data_source);
    return result
        .then(res => {
            flag = res;
            return stateJudge(res);
        })
        .then(json => {
            removeLoading();
            return json.data
        }).catch((err) => {
            removeLoading();
            errHandler(err);
            throw err
        });
}

// 检测token是否存在，如果不存在，则自动请求微信公众号登录接口获取token
// 根据接口返回的code判断各种在线状态
let check_token = 0;
export function checkToken() {
    // app初始化时首先调此方法检查token是否存在，在另外的get请求中也会继续调用此方法
    // 初始化这里传入了上下文
    check_token++;
    let mayihr_token = getSessionItem('mayihr_token');
    if (!mayihr_token) {
        let rootApi = new RootApi();
        // let login_request = getSessionItem('login_request');
        let login_request = JSON.parse(localStorage.getItem('login_request'));
        let openid = getSessionItem('openid');
        if (login_request) {
            let accountBindUrls = new AccountBindUrls();
            // 可能需要传openid
            wxLogin(accountBindUrls.wxLoginHandle(), login_request)
                .then(res => {
                    setSessionItem('mayihr_token', res.token);
                    // 定时删除login_request
                    localStorage.clear('login_request');
                    root_history.props.history.replace('/Index')
                });
        } else {
            getUserMsg(`${rootApi.getRootUrl()}/wechat/qy/?ufrom=`, openid ? {wx_open_id: openid} : {})
                .then(res => {
                    window.location.href = res;
                })
        }

    }
}
// 登录获取token
// 此方法不需要检测token因此也用于获取验证码
export function wxLogin(url, params) {
    return getOnceData(url, params)
        .then((res) => {
            return loginState(res);
        })
        .then(json => {
            return json.data
        })
        .catch((err) => {
            // 定时删除login_request
            localStorage.clear('login_request');
            errHandler(err);
            throw err
        })
}
// 获得路由上下文
export function setRootHistory(root) {
    root_history = root
}
function setLoading(timer) {
    document.getElementById('loading').setAttribute('class', 'loading');
    clearInterval(timer);
    timer = null
}

function removeLoading() {
    document.getElementById('loading').removeAttribute('class');
}

function loginState(res) {
    switch (res.status) {
        case 417:
            throw res.json();
            break;
        case 422:
            throw res.json();
            break;
        case 404:
            root_history.props.history.replace('/404');
            break;
        case 500:
            root_history.props.history.replace('/500');
            break;
        default:
            return res.json();
    }
}
function stateJudge(res) {
    let rootApi = new RootApi();
    let openid = getSessionItem('openid');
    switch (res.status) {
        case 417:
            throw res.json();
            break;
        case 422:
            throw res.json();
            break;
        case 401:
            clearSessionItem('mayihr_token');
            getUserMsg(`${rootApi.getRootUrl()}/wechat/qy/?ufrom=`, openid ? {wx_open_id: openid} : {})
                .then(res => {
                    window.location.href = res;
                });
            break;
        case 404:
            root_history.props.history.replace.push('/404');
            break;
        case 500:
            root_history.props.history.replace.push('/500');
            break;
        default:
            return res.json();
    }
}

function errHandler(err) {
    let alert_this = getAlert();
    err.then(err_res => {
        switch (err_res.status_code) {
            case 417 :
                if (err_res.code === 250011) {
                    root_history.props.history.replace('/Bind/Person');
                } else if (err_res.code === 250008
                    || err_res.code === 250010
                    || err_res.code === 250005
                    || err_res.code === 250006
                    || err_res.code === 250003
                    || err_res.code === 250002) {
                    // saas未签约的用户、saas未外包、saas自助激活失败等
                    if (!getSessionItem('mayihr_token')) {
                        setSessionItem('mayihr_token', err_res.data.token);
                    }
                    root_history.props.history.replace('/Bind/Unbind');
                } else if (err_res.code === 250009) {
                    //已经关闭外包，再次激活
                    if (!getSessionItem('mayihr_token')) {
                        setSessionItem('mayihr_token', err_res.data.token);
                    }
                    root_history.props.history.replace('/Bind/ReActive');
                } else if (err_res.code === 250012) {
                    //token 过期
                    clearSessionItem('mayihr_token');
                    root_history.props.history.replace('/');
                } else if (err_res.code === 260001) {
                    // 正常绑定
                    setSessionItem('openid', err_res.data.openid);
                    root_history.props.history.replace('/Bind');
                } else if(err_res.code === 250001) {
                    // 未初始化
                    clearSessionItem('mayihr_token');
                    root_history.props.history.replace('/');
                } else {
                    showAlertModal.call(alert_this, err_res.message);
                }
                break;
            case 422:
                let key = Object.keys(err_res.errors)[0];
                showAlertModal.call(alert_this, err_res.errors[key]);
                break;
            default:
                break;
        }
    })
}
