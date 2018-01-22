import React from 'react'
import {Link} from 'react-router-dom'

export class IndexTodo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.count = 0;
        this.data = this.props.data;
        this.state = {
            data: this.props.data
        }
    }

    render() {
        this.count++;
        return (
            <div>
                <h6 className="title">待办事项</h6>
                <div className="bg-white b-t b-b">
                    <ul className="p-l thumb-list list">
                        {
                            this.props.unorder.total === 0 // ===0
                                ? ''
                                : <li className="clearfix">
                                <Link to="/Bill/UnBillOrder">
                                <span className="p-r-sm p-t p-b pull-left"><i
                                    className="icon_manifesto v-m"></i> </span>
                                    <div className="b-b p-t p-b m-l p-r">有未下单支付的账单<span
                                        className="pull-right">
                                <span className="label error v-m">{this.props.unorder.total}</span>
                                <i
                                    className="icon_right_triangle v-m"></i></span>
                                    </div>
                                </Link>
                            </li>
                        }
                        {
                            this.props.data.gen_bills.length === 0
                                ? ''
                                : this.props.data.gen_bills.map((item, index) => {
                                return (
                                    <li className="clearfix" key={index}>
                                        <Link to={{
                                            pathname: `/Bill/SocialOrder/${item.op_month}`,
                                            state: {op_month: item.int_op_month}
                                        }}>
                                            <span className="p-r-sm p-t p-b pull-left"><i
                                                className="icon_manifesto v-m"> </i></span>
                                            <div className="b-b p-t p-b m-l p-r ">{item.name}<span
                                                className="pull-right"><i
                                                className="icon_right_triangle v-m"> </i></span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                        {
                            JSON.stringify(this.props.data.gen_salary) === '{}' || this.props.data.gen_salary instanceof Array
                                ? ''
                                : <li className="clearfix">
                                <Link to={{
                                    pathname: `/Bill/GzOrder/${this.props.data.gen_salary.op_month}`,
                                    state: {
                                        op_month: this.props.data.gen_salary.int_op_month
                                    }
                                }}>
                                <span className="p-r-sm p-t p-b pull-left"><i
                                    className="icon_manifesto v-m"> </i></span>
                                    <div className="b-b p-t p-b m-l p-r ">{this.props.data.gen_salary.name}<span
                                        className="pull-right"><i
                                        className="icon_right_triangle v-m"> </i></span>
                                    </div>
                                </Link>
                            </li>
                        }

                        {
                            this.props.data.gen_commercial instanceof Array
                                ? ''
                                : <li className="clearfix">
                                <Link to={{
                                    pathname: "/Commercial/",
                                    state: {op_month: this.props.data.gen_commercial.int_op_month}
                                }}>
                        <span className="p-r-sm p-t p-b pull-left"><i
                            className="icon_manifesto v-m"> </i></span>
                                    <div className="b-b p-t p-b m-l p-r ">{this.props.data.gen_commercial.name}<span
                                        className="pull-right">
                        <i className="icon_right_triangle v-m"> </i>
                        </span>
                                    </div>
                                </Link>
                            </li>
                        }
                        {
                            this.props.data.incomplete_staff_total == 0
                                ? ''
                                : <li className="clearfix">
                                <Link to="/CompleteStaffMsg">
                                <span className="p-r-sm p-t p-b pull-left"><i
                                    className="icon_staff_list v-m"></i></span>
                                    <div className="b-b p-t p-b m-l p-r ">补全员工信息<span
                                        className="pull-right"><span
                                        className="label v-m">{this.props.data.incomplete_staff_total}</span><i
                                        className="icon_right_triangle v-m"></i></span>
                                    </div>
                                </Link>
                            </li>
                        }
                        {
                            this.props.data.notice_unread_total == 0
                                ? ''
                                : <li className="">
                                <Link to="/Notice">
                                    <span className="p-r-sm p-t p-b pull-left"><i
                                        className="icon_notification v-m"></i></span>
                                    <div className="p-t p-b m-l p-r"> 请阅读重要通知<span
                                        className="pull-right"><span
                                        className={`label {} v-m`}>{this.props.data.notice_unread_total}</span><i
                                        className="icon_right_triangle v-m"></i></span>
                                    </div>
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        )
    }
}


















