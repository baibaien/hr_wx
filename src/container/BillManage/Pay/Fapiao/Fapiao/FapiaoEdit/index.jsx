import React from 'react';
import {getData, postData} from '../../../../../../fetch/httpRequest'
import {BillManageUrls} from '../../../../../../service/billManageApi/billManageUrl'
import {changeValue, changeUnNecValue, submitValidate } from '../../../../utils/form'

export class FapiaoEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.validates = {
            title: [
                {
                    func_name: 'required',
                    arg: '发票抬头必填'
                }
            ],
            mobile: [
                {
                    func_name: 'mobileValid'
                },
            ],
            tax_number: [
                {
                    func_name: 'taxValid',
                },
                {
                    func_name: 'required',
                    arg: '纳税人识别号必填'
                }

            ],
            email: [
                {
                    func_name: 'emailValid'
                },
                {
                    func_name: 'required',
                    arg: '邮箱必填'
                }
            ]
        };
        this.send_data = ['fapiao_type', 'fp_type', 'title', 'tax_number', 'email', 'bank_account', 'address_mobile'];
        this.state = {
            fapiao: {
                fp_type: 1
            },
            fapiao_type: [],
            fp_type: [],
            form_fapiao: {
                fapiao_type: '0',
                fp_type: '1'
            },
            form_fapiao_err: {},
            show_special: false,
            show_other: false
        }
    }

    render() {
        return (
            // 发票编辑简单
            <div>
                <div className="bg-white p-a b-b">
                    <span className="cursor" onClick={() => this.props.history.goBack()}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right btn btn-sm cursor" onClick={this.saveData.bind(this)}><i
                        className="icon_save"></i>保存</span>
                </div>
                <h6 className="title p-l p-r">发票类型</h6>
                <form action="">
                    <div className="bg-white">
                        <ul className="detail b-t b-b">
                            <li>
                                <span>不需要发票</span>
                                <div className="grey t-sm pull-right">
                                    <label className="ui-check">
                                        <input type="radio" name="fp_type" value="0"
                                               checked={this.state.form_fapiao.fp_type === '0'}
                                               onChange={changeUnNecValue.bind(this, ['form_fapiao', 'fp_type'])}/>
                                        <i className="icon_ui"></i>
                                    </label>
                                </div>
                            </li>
                            <li>
                                <span>普通电子发票</span>
                                <div className="grey t-sm pull-right">
                                    <label className="ui-check">
                                        <input type="radio" name="fp_type" value="1"
                                               checked={this.state.form_fapiao.fp_type === '1'}
                                               onChange={changeUnNecValue.bind(this, ['form_fapiao', 'fp_type'])}/>
                                        <i className="icon_ui"></i>
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {
                        this.state.form_fapiao.fp_type == '0'
                            ? ''
                            : <div>
                            <div className="bg-white m-t-sm">
                                <ul className="detail b-t b-b">
                                    <li>
                                        <span>发票类型</span>
                                        <div className="grey t-sm pull-right">
                                            {
                                                this.state.fp_type.map((item) => {
                                                    if (item.id.toString() === this.state.form_fapiao.fp_type) {
                                                        return (
                                                            <span key='1'>{item.name}</span>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </li>
                                    <li>
                                        <span>开票抬头</span>
                                        <div className="grey t-sm pull-right">
                                            <input type="text" className="t-r" value={this.state.form_fapiao.title}
                                                   name="title"
                                                   onChange={changeValue.bind(this,
                                                       ['form_fapiao', 'title'],
                                                       this.validates.title
                                                   )}/>
                                            <p className="t-r error t-sm">{this.state.form_fapiao_err.title}</p>

                                        </div>
                                    </li>
                                    <li>
                                        <span>纳税人识别号</span>
                                        <div className="grey t-sm pull-right">
                                            <input type="text" className="t-r" value={this.state.form_fapiao.tax_number}
                                                   name="tax_number"
                                                   onChange={changeValue.bind(this,
                                                       ['form_fapiao', 'tax_number'],
                                                       this.validates.tax_number
                                                   )}/>
                                            <p className="t-r error t-sm">{this.state.form_fapiao_err.tax_number}</p>

                                        </div>
                                    </li>
                                    <li>
                                        <span>收票邮箱</span>
                                        <div className="grey t-sm pull-right">
                                            <input type="text" className="t-r" value={this.state.form_fapiao.email}
                                                   name="email"
                                                   onChange={changeValue.bind(this,
                                                       ['form_fapiao', 'email'],
                                                       this.validates.email
                                                   )}/>
                                            <p className="t-r error t-sm">{this.state.form_fapiao_err.email}</p>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white m-t-sm b-t b-b">
                                <div className={`bg-white cursor p-a ${this.state.show_special ? 'hide' : ''}`}
                                     onClick={this.toggleSpecial.bind(this)}>
                                    <span><i className="icon_plus"></i>添加特殊开票需求</span>
                                </div>
                                <div className={`cursor bg-grey p-a ${this.state.show_special ? '' : 'hide'}`}
                                     onClick={this.toggleSpecial.bind(this)}>
                            <span className="">
                                <i className="icon_minus"></i>收起并重置选项
                            </span>
                                </div>
                                <ul className={`detail ${this.state.show_special ? '' : 'hide'}`}>
                                    {
                                        this.state.fapiao_type.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <span>{item.name}</span>
                                                    <div className="grey t-sm pull-right">
                                                        <label className="ui-check">
                                                            <input type="radio" name="fapiao_type" value={item.id}
                                                                   onChange={changeUnNecValue.bind(this, ['form_fapiao', 'fapiao_type'])}
                                                                   checked={this.state.form_fapiao.fapiao_type.toString() === item.id.toString()}/>
                                                            <i className="icon_ui"></i>
                                                        </label>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="bg-white m-t-sm m-b b-t b-b">
                                <div className={`p-a cursor ${this.state.show_other ? 'hide' : ''}`}
                                     onClick={this.toggleOther.bind(this)}>
                                    <span><i className="icon_plus"></i>添加更多选填信息</span>
                                </div>
                                <div className={`bg-grey p-a cursor ${this.state.show_other ? '' : 'hide'}`}
                                     onClick={this.toggleOther.bind(this)}>
                            <span className="">
                                清空并收起下列选项信息
                            </span>
                                </div>
                                <ul className={`detail ${this.state.show_other ? '' : 'hide'}`}>
                                    <li>
                                        <span>通知手机（选填）</span>
                                        <div className="grey t-sm pull-right">
                                            <input type="text" className="t-r" value={this.state.form_fapiao.mobile}
                                                   name="mobile"
                                                   onChange={changeValue.bind(this,
                                                       ['form_fapiao', 'mobile'],
                                                       this.validates.mobile
                                                   )}
                                                   placeholder="请输入手机"/>
                                            <p className="t-r error t-sm">{this.state.form_fapiao_err.mobile}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span>公司注册地址及电话</span>
                                        <div className="grey t-sm pull-right">
                                            <input type="text" name="address_mobile"
                                                   className="t-r"
                                                   value={this.state.form_fapiao.address_mobile}
                                                   onChange={changeUnNecValue.bind(this,
                                                       ['form_fapiao', 'address_mobile'])}
                                                   placeholder="请输入"/>
                                        </div>
                                    </li>
                                    <li>
                                        <span>开户行及账号</span>
                                        <div className="grey t-sm pull-right">
                                            <input type="text" name="bank_account"
                                                   className="t-r"
                                                   value={this.state.form_fapiao.bank_account}
                                                   onChange={changeUnNecValue.bind(this,
                                                       ['form_fapiao', 'bank_account'])}
                                                   placeholder="请输入"/>
                                        </div>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    }
                </form>
            </div>
        )
    }

    componentDidMount() {
        getData(this.settings_urls.getSignInfo())
            .then((res) => {
                    this.setState({
                        form_fapiao: res.fapiao_info.data,
                        fapiao_type: res.fapiao_info.fapiao_type,
                        fp_type: res.fapiao_info.fp_type
                    })
                }
            )
    }

    toggleSpecial() {
        let flag = this.state.show_special;
        let form_fapiao = Object.assign(this.state.form_fapiao, {fapiao_type: '0'});
        this.setState({
            show_special: !flag,
            form_fapiao: form_fapiao
        })
    }

    toggleOther() {
        let flag = this.state.show_other;
        let form_fapiao = Object.assign(this.state.form_fapiao,
            {
                address_mobile: '',
                mobile: '',
                bank_account: ''
            }
        );
        this.setState({
            show_other: !flag,
            form_fapiao: form_fapiao
        })
    }

    saveData() {
        let submit_data = {};
        this.send_data.map((item, index) => {
            submit_data[item] = this.state.form_fapiao[item];
            if( item !== 'fp_type' && item !== 'fapiao_type' && item !== 'bank_account' && item !== 'address_mobile') {
                submitValidate.call(this, 'form_fapiao', item, this.validates[item], submit_data[item]);
            }
        });
        if (JSON.stringify(this.state.form_fapiao_err) === '{}') {
            postData(this.billManageUrls.editPartFapiao(this.order_id), submit_data)
                .then((res) => {
                    this.props.history.goBack(-2)
                })
        }
    }
}