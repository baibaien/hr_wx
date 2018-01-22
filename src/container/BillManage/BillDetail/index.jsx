import React from 'react';
import {getData, postData} from '../../../fetch/httpRequest'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {Link} from 'react-router-dom'
import {BillOrder} from '../BillOrder/index'
import {dateTransform} from "../../../utils/dateTransform"
import {setSessionItem} from '../../../utils/sessionStorage'

export class BillDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        const order_id = this.props.match.params.order_id;
        this.bill_urls = new BillManageUrls();
        this.state = {
            order_id: order_id,
            // bill_urls: bill_urls,
            invoice_info: {},
            bill: [],
            is_href: '',
            invoice: {
                list: {}
            },
        }
        document.title = '订单详情'
    }

    render() {
        return (
            // 订单明细
            <div>
                <div className='bg-white p-a b-b'>
                    <Link to={{
                        pathname: '/Bill'
                    }}><i className="icon_left_triangle grey v-m "></i>返回</Link>
                    {
                        this.state.is_href == 1
                            ? <span className='pull-right'><Link to={`/Bill/Process/${this.state.order_id}`}><i
                            className='icon_search v-m'></i>查看办理进度</Link></span>
                            : ''
                    }
                </div>
                <div className='bg-white b-t b-b m-t-sm'>
                    <div className='bg-grey p-a'>
                        <span className='grey t-sm'>订单编号：{this.state.order_id}</span>
                        <span
                            className='pull-right grey t-sm'>{
                            this.state.invoice.list.audit_time == 0
                                ? ''
                                : <span>
                                成交于
                                {dateTransform(this.state.invoice.list.audit_time)}
                            </span>
                        }
                    </span>
                    </div>
                    <div className='p-l p-r p-t-lg p-b-lg b-b'>
                        <div className='d-ib half'>
                            <h6 className='t-20 bold'>{this.state.invoice.list.all_money}</h6>
                            <p className='grey'>实付</p>
                        </div>
                        <div className='d-ib half pull-right'>
                            <p className='grey t-r'>应付金额: {this.state.invoice.list.payable}</p>
                            <p className='grey t-r'>余额抵扣：{this.state.invoice.list.offset_money}</p>
                        </div>
                    </div>
                    <div className='p-a'>
                        <Link to={{pathname: `/Bill/Detail/${this.props.match.params.order_id}/Voucher`}}>
                            <span className='grey'><i className='icon_camera t-lg m-r-sm v-m'></i>查看付款凭证</span>
                            {/*<span*/}
                                {/*className='pull-right grey'>支付于{dateTransform(this.state.invoice.list.audit_time)}</span>*/}
                        </Link>
                    </div>
                </div>
                {
                    // 审核中
                    this.state.invoice.invoice_status === 0
                        ? <div className="p-a bg-white m-t-sm b-t b-b">订单审核中...</div>
                        : (this.state.invoice.invoice_status === 1 // 不可开票
                        ? ''
                        : <div>
                            <h6 className='title p-l p-r'>发票信息</h6>
                            <div className='bg-white b-t b-b'>
                                <div
                                    className={this.state.invoice.invoice_status === 2 || this.state.invoice.invoice_status === 3 ? 'b-b p-l p-r p-t-lg p-b-lg' : 'hide'}>
                                    <div className={`d-ib half`}>
                                        <h6 className='t-20 bold'>{this.state.invoice.list.invoice_money}</h6>
                                        <p className='grey'>可开票金额</p>
                                    </div>
                                    <div className='pull-right p-t-sm'>
                                        <span
                                            className={ this.state.invoice.invoice_status === 2 ? `btn btn-sm` : 'hide' }
                                            onClick={this.jumpFapiao.bind(this)}>开票 <i
                                            className="icon_right_triangle"></i></span>
                                        <span
                                            className={ this.state.invoice.invoice_status === 3 ? `btn disabled btn-sm` : 'hide' }>开票中</span>
                                    </div>
                                </div>
                                {
                                    this.state.invoice.invoice_status === 4 || this.state.invoice.invoice_status === 3
                                        ? <div className='p-a'>
                                        <p className='grey m-b-xs'>发票抬头：&emsp;{this.state.invoice_info.title}</p>
                                        <p className='grey m-b-xs'>
                                            发票类型：&emsp;{this.state.invoice_info.is_invoice === 0 ? '不开票' : '电子发票'}</p>
                                        <p className='grey m-b-xs'>收票邮箱：&emsp;{this.state.invoice_info.email}</p>
                                        <p className='grey m-b-xs'>
                                            开票要求：&emsp;{this.state.invoice_info.fapiao_type_name}</p>
                                    </div>
                                        : ''
                                }
                                {
                                    this.state.invoice.invoice_status === 4
                                        ? <div className="b-t p-a">
                                        <p className="grey">发票已开具 {dateTransform(this.state.invoice_info.kaipiao_time)}
                                            <span className="pull-right">请登录电脑端查看发票信息</span>
                                        </p>
                                    </div>
                                        : ''
                                }
                            </div>
                        </div>)
                }
                <h6 className='title p-l p-r'>订单包含账单列表</h6>
                < BillOrder
                    data={this.state.bill
                    }/>
            </
                div >
        )
    }

    jumpFapiao() {
        setSessionItem('kaipiao', this.state.invoice);
        this.props.history.push({pathname: '/Settings/Fapiao'})
    }

    componentDidMount() {
        getData(this.bill_urls.getBillDetail(this.state.order_id))
            .then(res => {
                this.setState({
                    bill: res.bill,
                    invoice: res.data,
                    invoice_info: res.data.invoice_info,
                    is_href: res.data.list.is_href
                });
            })
    }
}