import React from 'react'
import {Link} from 'react-router-dom'
import {getData} from '../../../../fetch/httpRequest'
import {BillManageUrls} from '../../../../service/billManageApi/billManageUrl'

//出勤调整
export class SocialStateDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.yg_id = this.props.location.state;
        this.state = {
            social: [],
        }
    }

    render() {
        return (
            <div>
                <div className="bg-white clearfix b-b shadow-bottom p-a">
                    <span className="" onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                {
                    this.state.social.map((item, index) => {
                        return (
                            <div key={index}>
                                <h6 className="title">{item.pay_month}</h6>
                                <div className="m-b-sm bg-white" key={index}>
                                    <ul className="detail b-t b-b">
                                        <li className="">
                                            社保缴纳基数
                                            <div className="pull-right">
                                                {item.social_base_money || '-'}
                                            </div>
                                        </li>
                                        <li className="">
                                            社保缴纳金额
                                            <div className="pull-right">
                                                {item.social_money || '-'}
                                            </div>
                                        </li>
                                        <li className="">
                                            社保办理状态
                                            <div className="pull-right">
                                                {item.social_op || '未缴纳'}
                                            </div>
                                        </li>
                                        <li className="">
                                            公积金缴纳基数
                                            <div className="pull-right">
                                                {item.fund_base_money || '-'}
                                            </div>
                                        </li>
                                        <li className="">
                                            公积金缴纳金额
                                            <div className="pull-right">
                                                {item.fund_money || '-'}
                                            </div>
                                        </li>
                                        <li className="">
                                            公积金办理状态
                                            <div className="pull-right">
                                                {item.fund_op || '未缴纳'}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.getSocialStateDetail(this.yg_id))
            .then(res => {
                console.log(res);
                this.setState({
                    social: res.data.list

                })
            })
    }

}