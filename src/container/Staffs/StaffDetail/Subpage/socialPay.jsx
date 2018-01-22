import React from 'react';
import {Link} from 'react-router-dom'

export class StaffDetailSocial extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            salary_pay: this.props.location.state
        }
    }

    render() {
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm">
                    <span onClick={() => {this.props.history.goBack()}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <h6 className="title">薪酬</h6>
                <div className="bg-white b-t b-b">
                    <ul className="detail">
                        <li>
                            <span className="grey">基本工资</span>
                            <span className="pull-right">{Number(this.state.salary_pay.yg_sallay).toFixed(2)}</span>
                        </li>
                        {
                            /*在职员工不显示试用期工资*/
                            this.state.salary_pay.status == 1
                                ? ''
                                : <li>
                                <span className="grey">试用期工资</span>
                                <span className="pull-right">{this.state.salary_pay.yg_try_sally}</span>
                            </li>
                        }
                    </ul>
                </div>
                <h6 className="title">社保/公积金</h6>
                <div className="bg-white b-t b-b">
                    <ul className="detail">
                        <li>
                            <span className="grey">缴纳项目</span>
                            <span
                                className="pull-right">{this.state.salary_pay.yg_is_social == 1 ? '社保' : '—'}/{this.state.salary_pay.yg_is_fund == 1 ? '公积金' : '—'}</span>
                        </li>
                        <li>
                            <span className="grey">缴纳城市</span>
                            <span className="pull-right">{this.state.salary_pay.yg_city_name}</span>
                        </li>
                        {
                            this.state.salary_pay.yg_is_social == 1 && this.state.salary_pay.yg_is_fund == 1
                                ? <div className="b-t">
                                <li>
                                    <span className="grey">缴纳方式</span>
                                    <span className="pull-right">{this.state.salary_pay.yg_pay_type_name}</span>
                                </li>
                            </div>
                                : ''
                        }

                        {
                            this.state.salary_pay.yg_is_social == 1
                                ? <div className="b-t">
                                <li>
                                    <span className="grey">社保类型</span>
                                    <span className="pull-right">{this.state.salary_pay.social_rule_name}</span>
                                </li>
                                <li>
                                    <span className="grey">社保起缴月份</span>
                                    <span className="pull-right">{this.state.salary_pay.social_start}</span>
                                </li>
                                <li>
                                    <span className="grey">社保基数</span>
                                    <span className="pull-right">{this.state.salary_pay.yg_social_self}</span>
                                </li>
                            </div>
                                : ''
                        }
                        {
                            this.state.salary_pay.yg_is_fund == 1
                                ? <div className="b-t">
                                <li>
                                    <span className="grey">公积金类型</span>
                                    <span className="pull-right">{this.state.salary_pay.fund_rule_name}</span>
                                </li>
                                <li>
                                    <span className="grey">公积金起缴月份</span>
                                    <span className="pull-right">{this.state.salary_pay.fund_start}</span>
                                </li>
                                <li>
                                    <span className="grey">公积金基数</span>
                                    <span className="pull-right">{this.state.salary_pay.yg_fund_self}</span>
                                </li>
                            </div>
                                : ''
                        }
                    </ul>
                </div>
            </div>
        )
    }
}