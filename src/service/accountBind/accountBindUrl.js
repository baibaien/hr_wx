import {RootApi} from '../root-api/root-api'


export class AccountBindUrls {
    constructor() {
        this.rootApi = new RootApi()
    }
    //微信登录
    wxLogin() {
        return `${this.rootApi.getRootUrl()}/wechat/qy/?from`;
    }
    //微信登录处理
    wxLoginHandle() {
        //params:　code,state
        return `${this.rootApi.getRootUrl()}/wechat/qy/wechat-login`;
    }
    //微信账号绑定用户账号 post
    wxBind() {
        return `${this.rootApi.getRootUrl()}/wechat/qy/bind/`;
    }
    //验证码
    sendCaptcha() {
        return `${this.rootApi.getRootUrl()}/wechat/qy/send-captcha`
    }
    // 注册账户
    createAccount() {
        return `${this.rootApi.getRootUrl()}/wechat/users/store`
    }
    loginFb() {
        return `${this.rootApi.getRootUrl()}/`
    }
    reActive() {
        return `${this.rootApi.getRootUrl()}/wechat/pay/active`
    }

}