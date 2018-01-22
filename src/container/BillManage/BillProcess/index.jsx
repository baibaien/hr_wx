//
import React from 'react';
import {getData, postData} from "../../../fetch/httpRequest"
import {BillManageUrls} from "../../../service/billManageApi/billManageUrl"
import {Link} from 'react-router-dom'

export class BillProcess extends React.Component {
    constructor(props, context) {
        super(props, context);
        const order_id = this.props.match.params.order_id;
        const bill_urls = new BillManageUrls();
        this.init = true;
        this.city_list = [];
        this.process = [];
        this.state = {
            order_id: order_id,
            bill_urls: bill_urls,
            list: []
        };
        document.title = '办理进度'
    }

    render() {
        return (
            <div>
                <div className="p-a bg-white b-b shadow-bottom">
                    <span className="cursor" onClick={() => this.props.history.goBack()}><i
                        className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                {
                    this.state.list.length === 0 && !this.init
                        ? <div className="p-a t-c">
                        <img src="/src/assets/image/none.svg" alt=""/>
                    </div>
                        : <div>
                        <h6 className="title">订单包含员工服务进度</h6>
                        <div className="bg-white b-t b-b">
                            <ul className="detail">
                                {
                                    this.state.list.map((item, index) => {
                                        return (
                                            <li className="p-b-sm clearfix" key={index}>
                                                <span>{item.yg_name}</span>
                                                <div className="d-ib w-200 pull-right t-r">
                                                    {
                                                        item.detail.length > 0
                                                            ? <div>
                                                            {
                                                                item.detail.map((sub_item, sub_index) => {
                                                                    return (
                                                                        <p key={sub_index}
                                                                           className="grey t-sm t-r">{sub_item.guize_name }
                                                                            {
                                                                                sub_item.pay_month === ''
                                                                                    ? ''
                                                                                    : `(${sub_item.pay_month})`
                                                                            }
                                                                            {sub_item.op_name || '未办理'}</p>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                            : '未办理'
                                                    }
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                }

            </div>
        )
    }

    componentDidMount() {
        this.getlist();
        // getData(this.state.bill_urls.getBillProcess(this.state.order_id))
        //     .then(res => {
        //         if (!(res instanceof Array)) {
        //             this.setState({
        //                 list: res.data.list
        //             })
        //         }
        //         this.init = false;
        //     })
    }

    getlist(city_id) {
        let data = city_id
            ? {order_id: this.state.order_id, city_id: city_id}
            : {order_id: this.state.order_id,};
        getData(this.state.bill_urls.getBillProcess(), data)
            .then(res => {
                if (!(res instanceof Array)) {
                    this.city_list = !city_id ?  res.meta.city_list : this.city_list;
                    this.city_list.shift();
                    this.process = this.process.concat(res.data.list);
                    if (this.city_list.length >= 1) {
                        let city = this.city_list.shift();
                        this.getlist(city.id)
                    } else {
                        this.setState({
                            list: this.process
                        })
                    }
                }
                this.init = false;
            })
    }
}