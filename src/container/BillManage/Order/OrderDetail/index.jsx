import React from 'react'
import {getData} from '../../../../fetch/httpRequest'
import {BillManageUrls} from '../../../../service/billManageApi/billManageUrl'
import {dateTransform, dateTransformToMonth} from '../../../../utils/dateTransform'

export class OrderDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        const bill_urls = new BillManageUrls();
        this.state = {
            order_id: this.props.match.params.order_id,
            bill_urls: bill_urls,
            bill_detail: {
                all_money: 0,
                bill: {},
                bill_list: [],
                title: '',
            },
            show: false,
            current_index: -1
        };
        document.title = '账单明细'
    }

    render() {
        // 账单明细
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm">
                    <span className="cursor" onClick={() => {
                        this.props.history.goBack()
                    }}>
                        <i className="icon_left_triangle grey v-m grey"></i>返回</span>
                </div>
                <div className="bg-white p-a b-t b-b m-b-sm">
                    <p>
                        <span>{this.state.bill_detail.title}</span>
                        {
                            this.props.location.state.type == 2
                                ? ''
                                : <span className="grey">({this.state.bill_detail.bill_list.length}人)</span>

                        }
                        <span
                            className="pull-right t-sm grey">{dateTransform(this.state.bill_detail.bill.create_time)}</span>
                    </p>
                    <h6 className="t-lg bold t-c m-t">{this.state.bill_detail.all_money}</h6>
                    <p className="grey t-sm t-c">账单金额</p>
                    <p className="m-t-xl grey t-c m-t t-sm">
                        {
                            this.props.location.state.type == 3
                                ? <span>发放月份：{dateTransformToMonth(this.state.bill_detail.bill.pay_month)}</span>
                                : ''
                        }
                        {
                            this.props.location.state.type == 1 || this.props.location.state.type == 2
                                ? <span>缴纳城市：{this.props.location.state.city_name}</span>
                                : ''
                        }
                    </p>
                </div>
                <h6 className="title">账单明细</h6>
                <div className="bg-white b-t b-b">
                    <ul className="detail">
                        {
                            this.state.bill_detail.bill_list.map((item, index) => {
                                return (
                                    <li key={index} className="clearfix">
                                        <p className="m-b-xs">
                                            <span>{item.yg_name || '公司'}</span>
                                            {
                                                this.props.location.state.type == 1 || this.props.location.state.type == 2
                                                    ? <span className="pull-right m-l-xs"
                                                            onClick={this.showDetail.bind(this, index)}>
                                                    <i className={this.state.current_index === index && this.state.show ? `icon_triangle_up` : `icon_triangle_down`}></i>
                                                </span>
                                                    : ''
                                            }
                                            {
                                                // 工资金额字段与其它不同
                                                this.props.location.state.type != 3
                                                    ? <span
                                                    className="grey pull-right">{Number(item.money).toFixed(2)}</span>
                                                    : <span
                                                    className="grey pull-right">{Number(item.salary).toFixed(2)}</span>
                                            }

                                        </p>
                                        {
                                            this.props.location.state.type == 1 || this.props.location.state.type == 2
                                                ? <div
                                                className={this.state.current_index === index && this.state.show ? '' : 'hide'}>
                                                <p className="t-r grey t-sm">社保月份：
                                                    <span className="d-ib"
                                                          style={{width: '.5rem'}}>
                                                        {
                                                            // 补缴和正常汇缴字段不同
                                                            this.props.location.state.type == 1
                                                                ?
                                                                <span>{item.social_month != '-' ? dateTransformToMonth(item.social_month) : '-'}</span>
                                                                :
                                                                <span>{item.pay_month != '-' ? dateTransformToMonth(item.pay_month) : '-'}</span>

                                                        }
                                                    </span>
                                                </p>
                                                <p className="t-r grey t-sm">社保金额：
                                                    <span className="d-ib"
                                                          style={{width: '.5rem'}}>
                                                        {
                                                            item.social_money == '-'
                                                                ? '-'
                                                                : Number(item.social_money).toFixed(2)}
                                                        </span>
                                                </p>
                                                <p className="t-r grey t-sm">公积金月份：
                                                    <span className="d-ib"
                                                          style={{width: '.5rem'}}>
                                                        {
                                                            // 补缴和正常汇缴字段不同
                                                            this.props.location.state.type == 1
                                                                ?
                                                                <span>{item.fund_month != '-' ? dateTransformToMonth(item.fund_month) : '-'}</span>
                                                                :
                                                                <span>{item.pay_month != '-' ? dateTransformToMonth(item.pay_month) : '-'}</span>
                                                        }
                                                        </span>
                                                </p>
                                                <p className="t-r grey t-sm">公积金金额：
                                                    <span className="d-ib"
                                                          style={{width: '.5rem'}}>
                                                        {
                                                            item.fund_money == '-'
                                                                ? '-'
                                                                : Number(item.fund_money).toFixed(2)}
                                                        </span>
                                                </p>
                                            </div>
                                                : ''
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }

    componentDidMount() {
        getData(this.state.bill_urls.getOrderDetail(this.state.order_id))
            .then(res => {
                this.setState({
                    bill_detail: res
                })
            });
    }

    showDetail(index) {
        let current_index = this.state.current_index;
        let show = this.state.show;
        if (current_index === index) {
            this.setState({
                show: !show
            })
        } else {
            this.setState({
                current_index: index,
                show: true
            })
        }
    }
}