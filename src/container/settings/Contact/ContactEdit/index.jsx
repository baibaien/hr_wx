import React from 'react';
import {Link} from 'react-router-dom'
import {SettingsUrls} from '../../../../service/settings/settingsUrl'
import {CommonUrls} from '../../../../service/commonUrl'
import {getData, postData} from '../../../../fetch/httpRequest'
import {changeValue, submitValidate, changeUnNecValue} from '../../../../utils/form'


export class ContactEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        const contact = this.props.location.state
        this.settingsUrls = new SettingsUrls();
        this.commonUrls = new CommonUrls();
        // 初始化校验
        this.validates = {
            contact: [
                {
                    func_name: 'required',
                    arg: '联系人必填'
                }
            ],
            mobile: [
                {
                    func_name: 'mobileValid'
                },
                {
                    func_name: 'required',
                    arg: '联系电话必填'
                }
            ],
            email: [
                {
                    func_name: 'emailValid',
                }
            ],
            phone: [
                {
                    func_name: 'phoneValid'
                }
            ]

        };
        this.send_data = ['contact', 'mobile', 'position', 'gender', 'email', 'phone'];
        this.state = {
            contact: contact,
            contact_err: {},
            position: []
        }
    }

    render() {
        return (
            // 主联系人
            <div style={{paddingTop: '.6rem'}}>
                <form >
                    <div className="bg-white p-l p-r  b-b full-w pos-f" style={{left:0, top:0, zIndex:2, lineHeight: '.5rem'}}>
                        <span onClick={()=>{this.props.history.goBack()}}
                              className="p-r b-r d-ib cursor"><i className="icon_close"></i></span>
                        <button onClick={this.updateData.bind(this)}
                                type="button"
                                className={`btn btn-sm pull-right cursor m-t-sm`}>保存
                        </button>
                    </div>

                    {/*<h6 className="title p-l p-r">aaa</h6>*/}
                    <div className="bg-white m-b-sm b-t b-b">
                        <ul className="detail">
                            <li>
                                <span>姓名</span>
                                <div className="pull-right">
                                    <input type="text" className={`t-r`} name="contact" placeholder="填写收件人姓名"
                                           value={this.state.contact.contact}
                                           onChange={changeValue.bind(this,
                                               ['contact', 'contact'],
                                               this.validates.contact)}/>
                                    <p className="t-sm error t-r">{this.state.contact_err.contact}</p>
                                </div>
                            </li>
                            <li>
                                <span>岗位</span>
                                <div className="pull-right">
                                    <input type="text"
                                           className={`t-r pull-right`}
                                           value={this.state.contact.position}
                                           placeholder="请填写岗位"
                                           onChange={changeUnNecValue.bind(this, ['contact', 'position'])}/>
                                </div>
                            </li>
                            <li>
                                <span>称谓</span>
                                <div className="pull-right">
                                    <select className={`t-r`} name="mobile"
                                            value={this.state.contact.gender}
                                            onChange={changeUnNecValue.bind(this, ['contact', 'gender'])}>
                                        <option value="0">未知</option>
                                        <option value="1">先生</option>
                                        <option value="2">女士</option>
                                    </select>
                                    {console.log(this.state.contact.gender)}
                                </div>
                            </li>
                            <li>
                                <span>电子邮箱</span>
                                <div className="pull-right">
                                    <input type="text" className={`t-r`} name="mobile" placeholder="填写邮箱"
                                           value={this.state.contact.email}
                                           onChange={changeValue.bind(this, ['contact', 'email'], this.validates.email)}/>
                                    <p className="t-sm error t-r">{this.state.contact_err.email}</p>
                                </div>
                            </li>
                            <li>
                                <span>手机</span>
                                <div className="pull-right">
                                    <input type="number" className={`t-r`} name="mobile" placeholder="填写手机"
                                           value={this.state.contact.mobile}
                                           onChange={changeValue.bind(this, ['contact', 'mobile'], this.validates.mobile)}/>
                                    <p className="t-sm error t-r">{this.state.contact_err.mobile}</p>
                                </div>
                            </li>
                            <li>
                                <span>固定电话</span>
                                <div className="pull-right">
                                    <input type="text" className={`t-r`} name="mobile" placeholder="填写固定电话"
                                           value={this.state.contact.phone}
                                           onChange={changeValue.bind(this, ['contact', 'phone'], this.validates.phone)}/>
                                    <p className="t-sm error t-r">{this.state.contact_err.phone}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </form>
            </div >
        )
    }

    componentDidMount() {
        getData(this.settingsUrls.getPosition())
            .then(res => {
                this.setState({
                    position: res.data
                })
            })

    }


    updateData() {
        let submit_data = {};
        this.send_data.map((item, index) => {
            submit_data[item] = this.state.contact[item];
            if (item !== 'gender' && item !== 'position') {
                submitValidate.call(this, 'contact', [item], this.validates[item], submit_data[item]);
            }
        });
        if (JSON.stringify(this.state.contact_err) === '{}') {
            //编辑
            postData(this.settingsUrls.updateContact(), submit_data)
                .then((res) => {
                    this.props.history.replace('/Settings/Contact')
                })
        }
    }
}

