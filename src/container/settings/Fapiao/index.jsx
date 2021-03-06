import React from 'react';
import {Route, Switch, Link} from 'react-router-dom'
import {FapiaoEdit} from './FapiaoEdit/index'
import {getData, postData} from '../../../fetch/httpRequest'
import {SettingsUrls} from '../../../service/settings/settingsUrl'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {getSessionItem} from '../../../utils/sessionStorage'

class Fapiao extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.settingsUrls = new SettingsUrls();
        this.billManageUrls = new BillManageUrls();
        this.state = {
            fapiao: {}
        };
        this.kaipiao = getSessionItem('kaipiao');
        document.title = '发票信息';
    }

    render() {
        return (
            // 发票信息
            <div className="pos-r" style={this.props.location ? {paddingBottom: '2.1rem', minHeight: '100%',paddingTop:'.6rem'} : {paddingTop:'.6rem'}}>
                <div className="bg-white p-a b-b shadow-bottom m-b-sm pos-f full-w" style={{left:0, top:0, zIndex:2}}>
                    <span className="cursor" onClick={() => this.props.history.goBack()}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <Link className="pull-right" to={
                        {
                            pathname: "/Settings/Fapiao/Edit",
                            state: this.state.fapiao
                        }
                    }><i className="icon_edit_simple grey v-m m-r-xs t-sm"></i>编辑发票信息</Link>
                </div>
                <div className="bg-white">
                    <ul className="detail b-t b-b">
                        <li>
                            <span>发票类型</span>
                            <div className="grey t-sm pull-right">
                                {this.state.fapiao.fp_type_name}
                            </div>
                        </li>
                        {
                            // 是否为不需要发票，以下信息可不显示
                            this.state.fapiao.fp_type == 0
                                ? ''
                                : <div className="b-t">
                                <li className="clearfix">
                                    <span>开票抬头</span>
                                    <div className="grey t-sm pull-right w-200 t-r">
                                        {this.state.fapiao.title}
                                    </div>
                                </li>
                                <li>
                                    <span>纳税人识别号</span>
                                    <div className="grey t-sm pull-right">
                                        {this.state.fapiao.tax_number}
                                    </div>
                                </li>
                                <li>
                                    <span>收票邮箱</span>
                                    <div className="grey t-sm pull-right">
                                        {this.state.fapiao.email}
                                    </div>
                                </li>
                                <li>
                                    <span>通知手机（选填）</span>
                                    <div className="grey t-sm pull-right">
                                        {this.state.fapiao.mobile || '暂无'}
                                    </div>
                                </li>
                                <li>
                                    <span>特殊开票需求（选填）</span>
                                    <div className="grey t-sm pull-right">
                                        {this.state.fapiao.fapiao_type_name || '正常开票'}
                                    </div>
                                </li>
                            </div>
                        }
                    </ul>
                </div>
                {
                    this.kaipiao
                        ? <div className="footer bg-white p-t-lg p-b p-l p-r b-t shadow-top pos-a full-w"
                               style={{height: '1.9rem', bottom: 0, left: 0}}>
                        <p className="grey t-c t-sm m-b">订单金额: {this.kaipiao.list.payable}</p>
                        <p className="t-lg bold t-c">{this.kaipiao.list.all_money}</p>
                        <p className="grey t-c t-sm">可开票金额</p>
                        <button className="m-t full-w btn cursor" onClick={this.applyFapiao.bind(this)}>确认开票</button>
                    </div>
                        : ''
                }

            </div>
        )
    }

    componentDidMount() {
        getData(this.settingsUrls.getFapiao())
            .then((res) => {
                this.setState({
                    fapiao: res.data
                })
            })
    }

    applyFapiao() {
        postData(this.billManageUrls.applyFapiao(), {order_id: this.kaipiao.list.order_id})
            .then(res => {
                // this.props.history.goback();
                this.props.history.push({
                    pathname: `/Bill/Detail/${this.kaipiao.list.order_id}`
                })
            })
            .catch(err => {
            })
    }
}
export class FapiaoIndex extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/Settings/Fapiao' exact component={Fapiao}/>
                <Route path='/Settings/Fapiao/Edit' exact component={FapiaoEdit}/>
            </Switch>
        )
    }
}
