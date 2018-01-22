import React from 'react'
import {Link} from 'react-router-dom'
import {postData} from '../../fetch/httpRequest'
import {setSessionItem} from '../../utils/sessionStorage'
import {changeValue, submitValidate} from "../../utils/form"
import {AccountBindUrls} from "../../service/accountBind/accountBindUrl"

export class Sign extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.accountBindUrls = new AccountBindUrls();
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
            password: [
                {
                    func_name: 'required',
                    arg: '手机密码必填'
                },
                {
                    func_name: 'passWordValid'
                },
                // {
                //     func_name: 'minLength',
                //     arg: 8
                // }

            ],
            email: [
                {
                    func_name: 'required',
                    arg: '邮箱必填'
                },
                {
                    func_name: 'emailValid'
                }
            ],
            company: [
                {
                    func_name: 'required',
                    arg: '请填写营业执照上的企业名称'
                }
            ],
            contact: [
                {
                    func_name: 'required',
                    arg: '联系人必填'
                }
            ],

        };


        this
            .state = {
            account_bind: {
                mobile: '',
                company: '',
                password: '',
                email: '',
                contact: ''
            },
            account_bind_err: {},
            count: 60
        }

    }

    render() {
        return (
            <div className="full-h bg-white">
                <div className="bg-white p-a-lg full-h">
                    <div className="m-b">
                        <p className="grey m-b-xs">输入注册手机</p>
                        <div className="b-a p-a-sm b-radius" style={{marginBottom: '10px'}}>
                            <input type="text"
                                   placeholder="手机"
                                   name="mobile"
                                   className="v-m full-w"
                                   value={this.state.account_bind.mobile}
                                   onChange={changeValue.bind(this, ['account_bind', 'mobile'], this.validates.mobile)}
                                   style={{paddingRight: '1rem'}}/>
                        </div>
                        <p className="t-sm error ">{this.state.account_bind_err.mobile}</p>
                    </div>
                    <div className="m-b">
                        <p className="grey m-b-xs">创建密码</p>
                        <div className="b-a p-a-sm " style={{marginBottom: '10px'}}>
                            <input type="password"
                                   placeholder="8-16位，包含字母和数字"
                                   name="password"
                                   minLength='8'
                                   maxLength='16'
                                   className="full-w v-m"
                                   value={this.state.account_bind.password}
                                   onChange={changeValue.bind(this, ['account_bind', 'password'], this.validates.password)}/>
                        </div>
                        <p className="t-sm error ">{this.state.account_bind_err.password}</p>
                    </div>
                    <div className="m-b">
                        <p className="grey m-b-xs">企业名称</p>
                        <div className="b-a p-a-sm " style={{marginBottom: '10px'}}>
                            <input type="text"
                                   placeholder="请填写营业执照上的企业名称"
                                   name="company"
                                   className="full-w v-m"
                                   value={this.state.account_bind.company}
                                   onChange={changeValue.bind(this, ['account_bind', 'company'], this.validates.company)}/>
                        </div>
                        <p className="t-sm error ">{this.state.account_bind_err.company}</p>
                    </div>
                    <div className="m-b">
                        <p className="grey m-b-xs">联系人姓名</p>
                        <div className="b-a p-a-sm " style={{marginBottom: '10px'}}>
                            <input type="text"
                                   placeholder="用于在账户变动、异常等情况下联系之用"
                                   name="contact"
                                   className="full-w v-m"
                                   value={this.state.account_bind.contact}
                                   onChange={changeValue.bind(this, ['account_bind', 'contact'], this.validates.contact)}/>
                        </div>
                        <p className="t-sm error ">{this.state.account_bind_err.contact}</p>
                    </div>
                    <div className="m-b">
                        <p className="grey m-b-xs">联系邮箱</p>
                        <div className="b-a p-a-sm " style={{marginBottom: '10px'}}>
                            <input type="text"
                                   placeholder="用于在账户变动、异常等情况下联系之用"
                                   name="email"
                                   className="full-w v-m"
                                   value={this.state.account_bind.email}
                                   onChange={changeValue.bind(this, ['account_bind', 'email'], this.validates.email)}/>
                        </div>
                        <p className="t-sm error ">{this.state.account_bind_err.email}</p>
                    </div>
                    <div className="m-b-sm">
                        <button className={`btn full-w cursor`}
                                onClick={this.createAccount.bind(this)}>注册账户
                        </button>
                    </div>
                    <p className="grey t-sm t-c">
                        <span className="t-r t-u cursor" onClick={() => this.props.history.goBack()}>返回登录</span>
                    </p>
                </div>
            </div>
        )
    }


    createAccount() {
        let submit_data = {
            login_client: 'wechat'
        };
        Object.keys(this.state.account_bind).map((item, index) => {
            submit_data[item] = this.state.account_bind[item];
            submitValidate.call(this, 'account_bind', [item], this.validates[item], submit_data[item]);
        });
        if (JSON.stringify(this.state.account_bind_err) === '{}') {
            //编辑
            postData(this.accountBindUrls.createAccount(), submit_data)
                .then((res) => {
                    setSessionItem('mayihr_token', res.token);
                    this.props.history.replace('/Bind/Unbind')
                })
                .catch((err) => {
                })

        }
    }
}