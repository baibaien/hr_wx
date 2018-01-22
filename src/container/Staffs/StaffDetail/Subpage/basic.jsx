import React from 'react';
import {Link} from 'react-router-dom'

export class StaffDetailBasic extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            base: this.props.location.state
        }
    }

    render() {
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm">
                    <span onClick={() => {this.props.history.goBack()}} className="cursor"><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className="bg-white b-t b-b">
                    <ul className="detail clearfix">
                        <li className="clearfix">
                            <span className="grey">姓名</span>
                            <span className="pull-right d-ib w-200 t-r" >{this.state.base.yg_name}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">工号</span>
                            <span className="pull-right">{this.state.base.yg_no}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">证件</span>
                            <span className="pull-right ellipsis w-200 t-r" >{this.state.base.id_type_name}/{this.state.base.yg_identity}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">民族</span>
                            <span className="pull-right">{this.state.base.yg_nation_name || "暂无"}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">户籍地址</span>
                            <span className="pull-right w-200 t-r">{this.state.base.yg_hk_addr || "暂无"}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">性别</span>
                            <span className="pull-right">{this.state.base.yg_gender_name || "不明"}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">出生日期</span>
                            <span className="pull-right">{this.state.base.yg_birth || "暂无"}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">最高学历</span>
                            <span className="pull-right">{this.state.base.yg_xueli_name || "暂无"}</span>
                        </li>
                        <li className="clearfix">
                            <span className="grey">婚育</span>
                            <span className="pull-right">{this.state.base.yg_marry_name || "未知"}/{this.state.base.yg_children_name || "未知"}</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    componentDidMount() {
    }
 }