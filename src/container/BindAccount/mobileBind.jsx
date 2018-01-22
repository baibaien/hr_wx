import React from 'react'
import {Link} from 'react-router-dom'
import {postData, getData, setRootHistory, wxLogin} from '../../fetch/httpRequest'
import {CommonUrls} from '../../service/commonUrl'
import {AccountBindUrls} from '../../service/accountBind/accountBindUrl'
import {changeValue} from "../../utils/form"
import {setSessionItem, getSessionItem} from '../../utils/sessionStorage'

export class MobileBind extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (getSessionItem('mayihr_token')) {
            this.props.history.replace('/Index');
        }
        setRootHistory(this);
        this.accountBindUrls = new AccountBindUrls();
        this.commonUrls = new CommonUrls();
        this.validates = {
            mobile: [
                {
                    func_name: 'required',
                    arg: '手机号码必填'
                },
                {
                    func_name: 'mobileValid',
                }
            ],
            code: [
                {
                    func_name: 'required',
                    arg: '手机验证码必填'
                },
                {
                    func_name: 'captchaValid'
                }
            ]
        };
        this.state = {
            account_bind: {
                mobile: '',
                code: ''
            },
            account_bind_err: {},
            count: 60
        }

    }

    render() {
        return (
            <div className="full-h ">
                <div className="full-h pos-a left bg-grey full-w t-c p-a" >
                    <img src="/src/assets/image/reactive.png" alt="" className="m-t" style={{width: '50%'}}/>
                    <p className="t-c m-t">1000万中小企业的云端人力资源部
                    </p>
                    <p className="grey t-sm t-c p-b-sm">
                        <span className="m-r-sm">五险一金代缴 /托管 · 薪酬代发 · 商保购买 · 手续代办理等</span>
                    </p>
                </div>
                <div className="bg-white p-a-lg pos-a full-w" style={{bottom:0}}>
                    <div className="m-b">
                        <p className="grey m-b-xs">输入账号手机号码</p>
                        <div className="b-a p-a-sm b-radius" style={{marginBottom: '.05rem'}}>
                            <input type="number"
                                   placeholder="手机"
                                   name="mobile"
                                   className="v-m full-w"
                                   value={this.state.account_bind.mobile}
                                   onChange={changeValue.bind(this, ['account_bind', 'mobile'], this.validates.mobile)}
                                   style={{paddingRight: '1rem', height: '.29rem'}}/>
                            <button
                                className={(this.state.count >= 60 && !this.state.account_bind_err.mobile && this.state.account_bind.mobile) ? "btn btn-sm v-m cursor" : "btn btn-sm v-m disabled"}
                                style={{marginLeft: '-1rem', width: '1rem'}}
                                onClick={this.getCaptcha.bind(this)}
                            >{
                                this.state.count >= 60
                                    ? '获取验证码'
                                    : `重新发送(${this.state.count})`
                            }
                            </button>
                        </div>
                        <p className="t-sm error ">{this.state.account_bind_err.mobile}</p>
                    </div>
                    <div className="m-b">
                        <p className="grey m-b-xs">输入验证码</p>
                        <div className="b-a p-a-sm b-raius" style={{marginBottom: '.05rem'}}>
                            <input type="number"
                                   placeholder="输入验证码"
                                   name="code"
                                   maxLength='4'
                                   className="full-w v-m"
                                   value={this.state.account_bind.code}
                                   style={{height: '.29rem'}}
                                   onChange={changeValue.bind(this, ['account_bind', 'code'], this.validates.code)}/>
                        </div>
                        <p className="t-sm error ">{this.state.account_bind_err.code}</p>
                    </div>
                    <div className="m-b-sm">
                        <button
                            className={(this.state.account_bind.mobile && !this.state.account_bind_err.mobile && this.state.account_bind.code && !this.state.account_bind_err.code) ? "btn full-w cursor" : "btn full-w disabled"}
                            onClick={this.accountBind.bind(this)}>绑定新账户
                        </button>
                    </div>
                    <p className="grey t-sm t-c">
                        <Link className="t-u m-r-sm" to="/Bind/Sign">注册新账户</Link>
                        <span className="t-r t-u"><Link to='/Bind/YgSelf'>了解如何在微信中使用员工自助</Link></span>
                    </p>
                </div>
            </div>
        )
    }

    getCaptcha() {
        if (this.state.count >= 60 && !this.state.account_bind_err.mobile && this.state.account_bind.mobile) {
            wxLogin(this.accountBindUrls.sendCaptcha(), {mobile: this.state.account_bind.mobile})
                .then(res => {
                    this.resendCaptcha()
                })
        }
    }

    resendCaptcha() {
        let timer = null;
        timer = setInterval(() => {
            let count = this.state.count;
            count = count > 0 ? count - 1 : count;
            this.setState({
                count: count
            });
            if (count === 0) {
                clearInterval(timer);
                timer = null;
                this.setState({
                    count: 60
                })
            }
        }, 1000)
    }

    accountBind() {
        if (this.state.account_bind.code && !this.state.account_bind_err.code && this.state.account_bind.mobile && !this.state.account_bind_err.mobile) {
            let submit_data = {};
            submit_data.login_type = 1;
            submit_data.state = 1;
            submit_data.openid = getSessionItem('openid');
            Object.assign(submit_data, this.state.account_bind);
            postData(this.accountBindUrls.wxBind(), submit_data)
                .then(res => {
                    setSessionItem('mayihr_token', res.token);
                    localStorage.clear('login_request');
                    // this.props.history.push('/Index');
                    window.location.href = this.commonUrls.getHome();
                })
                .catch(err => {
                })
        }
    }
}