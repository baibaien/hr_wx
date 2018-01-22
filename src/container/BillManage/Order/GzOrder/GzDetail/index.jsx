import React from 'react'
import {Link} from 'react-router-dom'
import {getData} from '../../../../../fetch/httpRequest'
import {BillManageUrls} from '../../../../../service/billManageApi/billManageUrl'

export class GzDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.id = this.props.match.params.id;
        this.yg_id = this.props.location.state.item.yg_id;
        // this.op_month = this.props.location.state.item.op_month;
        this.state = {
            title: [],
            data: {},
            pay_salary: 0
        };
        document.title = '工资详情';
    }

    render() {
        return (
            <div>
                <div className="bg-white shadow-bottom p-a b-b">
                    <span className="cursor" onClick={() => this.props.history.goBack()}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className="bg-white p-t-lg b-b p-b-lg">
                    <p className="t-c m-b">{this.props.location.state.item.yg_name}</p>
                    <p className="t-lg t-c bold">{this.state.pay_salary}</p>
                    <p className="t-sm grey t-c">实发合计</p>
                </div>
                <div className="bg-white">
                    <ul>
                        <li className="p-a "><Link to={{
                            pathname: '/Bill/Attendance',
                            state: {
                                yg_id: this.yg_id,
                                pay_month: this.props.match.params.pay_month
                            }
                        }}><i className="icon_calendar v-m m-r-xs t-sm" style={{color:'#00b8ff'}}></i>出勤调整 <i className="icon_right_triangle pull-right"></i></Link></li>
                        <li className="p-a b-t"><Link to={{
                            pathname: '/Bill/SalaryDown',
                            state: {
                                yg_id: this.yg_id,
                                pay_month: this.props.location.state.pay_month,
                                type: 2
                            }
                        }}><i className="icon_minus error v-m m-r-xs t-sm"> </i>通用扣减 <i className="icon_right_triangle pull-right"></i></Link></li>
                        <li className="p-a b-t b-b"><Link to={{
                            pathname: '/Bill/SalaryUp',
                            state: {
                                yg_id: this.yg_id,
                                pay_month: this.props.location.state.pay_month,
                                type: 1
                            }
                        }}><i className="icon_add green v-m m-r-xs t-sm"> </i>浮动工资 <i className="icon_right_triangle pull-right"></i></Link></li>
                    </ul>
                </div>
                <h6 className="title">明细</h6>
                {
                    this.state.title.map((item, index) => {
                        return (
                            <div className="bg-white b-t b-b m-b-sm" key={index}>
                                <ul className="detail">
                                    {
                                        this.state.data[item].map((sub_item, sub_index) => {
                                            return (
                                                <li key={sub_index}>
                                                    <span>{sub_item.name}</span>
                                                    <span className="pull-right grey">{sub_item.money}</span>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.gzDetail(this.id))
            .then(res => {
                this.setState({
                    data: res.data,
                    title: Object.keys(res.data),
                    pay_salary: res.meta.pay_salary
                })
            });
        // postData(this.billManageUrls.clacGz(), {})
        //     .then(res => {
        //         this.setState({
        //             op_month: res.op_month
        //         });
        //
        //     })
    }
}