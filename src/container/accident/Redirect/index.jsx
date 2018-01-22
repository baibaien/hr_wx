import React from 'react'
import {setSessionItem, getSessionItem} from '../../../utils/sessionStorage'
import {wxLogin, setRootHistory} from '../../../fetch/httpRequest'
import {AccountBindUrls} from '../../../service/accountBind/accountBindUrl'
import '../../../assets/styles/loading.css'
import {CommonUrls} from '../../../service/commonUrl'

export class Relogin extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.accountBindUrls = new AccountBindUrls();
        this.commonUrls = new CommonUrls();
        this.params = this.getParams();

    }

    render() {
        return (
            <div className="full-h bg-white">
                <div className="wait hide">
                    <div className="load-container load">
                        <div className="loader">Loading...</div>
                    </div>
                    <div className="wait-drop"></div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        if (getSessionItem('mayihr_token')) {
            //首页按系统返回键时自动跳转至首页
            this.props.history.replace('/Index');
        } else {

            setRootHistory(this);
            wxLogin(this.accountBindUrls.wxLoginHandle(), this.params)
                .then(res => {
                    setSessionItem('mayihr_token', res.token);
                    window.location.href = this.commonUrls.getHome();
                })
        }
    }


    getParams() {
        let url = window.location.href;
        let qs = url.substring(url.lastIndexOf("?") + 1);
        let args = {};
        let items = qs.length > 0 ? qs.split('&') : [];
        let item = null;
        let name = null;
        let value = null;
        for (let i = 0; i < items.length; i++) {
            item = items[i].split("=");
            name = item[0];
            value = item[1];
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    }
}