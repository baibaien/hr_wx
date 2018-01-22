import React from 'react';
import {Switch, Link, Route} from 'react-router-dom'
import {SettingsUrls} from '../../../service/settings/settingsUrl'
import {getData} from '../../../fetch/httpRequest'


import {ContractFront} from "./Subpage/contract"
import {ContractBack} from "./Subpage/contractBack"
import {ConSn} from "./Subpage/conSn"
import {SignInfoEdit} from './SignInfoEdit/index'

class SignIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.settingsUrls = new SettingsUrls();

        // this.validate = new ValidateRule();
        this.state = {
            sign_info: {
                hr_office_addr: {},
                province: []
            },
            com_sn_url: '',
            outsource_contract: {
                start_date: ''
            },
            saas_contract: {
                start_date: ''
            },
            cities: [],
            districts: [],
            edit_state: false
        }
        document.title = '签约信息'
    }

    render() {
        return (
            // 签约信息
            <div style={{paddingTop:'.5rem'}}>
                <form >
                    <div className="bg-white p-a b-b pos-f full-w shadow-bottom" style={{left:0, top:0, zIndex:2}}>
                        <Link to=""><i className="icon_left_triangle grey v-m"></i>返回</Link>
                        <Link className={`pull-right`}
                              to={
                                  {
                                      pathname: `/Settings/SignInfo/Edit`,
                                      state: this.state.sign_info
                                  }
                              }>
                            <i className="icon_edit_simple grey v-m m-r-xs t-sm"></i>
                            变更账户主体</Link>
                    </div>
                    <h6 className="title p-l p-r">账户主体</h6>
                    <div className="bg-white">
                        <ul className="detail b-t b-b">
                            <li className="clearfix">
                                <span>公司名称</span>
                                <div
                                    className={`grey t-sm pull-right ${this.state.edit_state === true ? 'hide' : ''}` }>
                                    {this.state.sign_info.company}
                                </div>
                            </li>
                            <li className={`clearfix`}>
                                <span>注册地址</span>
                                <div
                                    className={`grey t-sm pull-right w-200 ellipsis t-r `}>
                                    {this.state.sign_info.hr_office_addr.province_name}
                                    {this.state.sign_info.hr_office_addr.city_name}
                                    {this.state.sign_info.hr_office_addr.district_name}
                                    {this.state.sign_info.hr_office_addr.addr}
                                </div>
                            </li>
                            <li className="clearfix">
                                <span>营业执照号</span>
                                <div className={`grey t-sm pull-right ${this.state.edit_state === true ? 'hide' : ''}`}>
                                    {this.state.sign_info.com_sn}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <h6 className="title p-l p-r">协议与签约凭证 <span
                        className="pull-right">代缴 {this.state.outsource_contract.start_date || '尚未'}签约</span></h6>
                    <div className="bg-white">
                        <ul className="detail b-t b-b">
                            <li>
                                <Link to={
                                    {
                                        pathname: '/Settings/SignInfo/ContractFront',
                                        state: this.state.outsource_contract
                                    }
                                }>
                                    <span>协议签约页</span>
                                    <div className={`grey t-sm pull-right`}>
                                        <i className="icon_right_triangle"></i>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to={
                                    {
                                        pathname: "/Settings/SignInfo/ContractBack",
                                        state: this.state.outsource_contract
                                    }
                                }>
                                    <span>协议细则页</span>
                                    <div className="grey t-sm pull-right ">
                                        <i className="icon_right_triangle"></i>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to={
                                    {
                                        pathname: "/Settings/SignInfo/Consn",
                                        state: this.state.com_sn_url
                                    }
                                }>
                                    <span>营业执照</span>
                                    <div className={`grey t-sm pull-right`}>
                                        <i className="icon_right_triangle"></i>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </form>

            </div>
        )
    }

    componentDidMount() {
        getData(this.settingsUrls.getSignInfo())
            .then(res => {
                this.setState({
                    sign_info: res.sign_info,
                    outsource_contract: res.outsource_contract,
                    com_sn_url: res.com_sn_url
                })
            })
    }
}

export class SignInfo extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/Settings/SignInfo" exact component={SignIndex}/>
                <Route path="/Settings/SignInfo/Edit" exact component={SignInfoEdit}/>
                <Route path="/Settings/SignInfo/ContractFront" exact component={ContractFront}/>
                <Route path="/Settings/SignInfo/ContractBack" exact component={ContractBack}/>
                <Route path="/Settings/SignInfo/Consn" exact component={ConSn}/>
            </Switch>
        )
    }
}