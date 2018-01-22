import React from 'react';
import {Route, Switch, Link} from 'react-router-dom'
// import {FapiaoEdit} from './FapiaoEdit/index'
import {getData, postData} from '../../../fetch/httpRequest'
import {SettingsUrls} from '../../../service/settings/settingsUrl'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'


export class FapiaoDetail extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.settingsUrls = new SettingsUrls();
        this.billManageUrls = new BillManageUrls();
        this.state = {
            fapiao: this.props.location.state.invoice_info
        }
    }

    render() {
        return (
            // 发票信息
            <div className="pos-r" style={this.props.location ? {paddingBottom: '2.1rem', minHeight: '100%'} : {}}>
                <div className="bg-white p-a b-b shadow-bottom m-b-sm">
                    <Link to={
                        {
                            pathname: `/Bill/Detail/${this.props.location.state.list.order_id}`,
                            state: this.state.fapiao
                        }
                    }><i className="icon_left_triangle grey v-m"></i>返回</Link>
                    {/*<Link className="pull-right" to={*/}
                        {/*{*/}
                            {/*pathname: `/Bill/Detail/${this.props.location.state.list.order_id}`,*/}
                            {/*state: this.state.fapiao*/}
                        {/*}*/}
                    {/*}><i className="icon_edit_simple grey"></i>编辑发票信息</Link>*/}
                </div>
                <div className="bg-white">
                    <ul className="detail b-t b-b">
                        <li>
                            <span>发票类型</span>
                            <div className="grey t-sm pull-right">
                                {this.state.fapiao.is_invoice === 0 ? '不开票' : '电子发票'}
                            </div>
                        </li>
                        {
                            // 是否为不需要发票，以下信息可不显示
                            /*this.state.fapiao.fp_type == 0*/
                                /*? ''*/
                                /*: */
                            <div className="b-t">
                                <li>
                                    <span>开票抬头</span>
                                    <div className="grey t-sm pull-right">
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
                                        {this.state.fapiao.fapiao_type_name || '暂无'}
                                    </div>
                                </li>
                            </div>
                        }
                    </ul>
                </div>
                {/*{*/}
                    {/*this.props.location*/}
                        {/*? <div className="footer bg-white p-t-lg p-b p-l p-r b-t shadow-top pos-a full-w"*/}
                               {/*style={{height: '1.9rem', bottom: 0, left: 0}}>*/}
                        {/*<p className="grey t-c t-sm m-b">订单金额: {this.props.location.state.list.payable}</p>*/}
                        {/*<p className="t-lg bold t-c">{this.props.location.state.list.all_money}</p>*/}
                        {/*<p className="grey t-c t-sm">可开票金额</p>*/}
                        {/*<button className="m-t full-w btn" onClick={this.applyFapiao.bind(this)}>确认开票</button>*/}
                    {/*</div>*/}
                        {/*: ''*/}
                {/*}*/}

            </div>
        )
    }

    componentDidMount() {

    }

    applyFapiao() {
        postData(this.billManageUrls.applyFapiao(), {order_id: this.props.location.state.list.order_id})
            .then(res => {
                // this.props.history.goback();
                this.props.history.push({
                    pathname: `/Bill/Detail/${this.props.location.state.list.order_id}`,
                    state: this.props.location.state
                })
            })
    }
}

