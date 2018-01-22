import React from 'react';
import {Link} from 'react-router-dom'

export class StaffDetailWork extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            work: [],
            edu: []
        }
    }

    render() {
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm">
                    <span className="cursor" onClick={() => {this.props.history.goBack()}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                {
                    this.state.work.length === 0 && this.state.edu.length === 0
                        ? <div className="p-a t-c">
                        <img src="/src/assets/image/none.svg" alt=""/>
                    </div>
                        : <div>
                        {
                            this.state.work.length === 0
                                ? ''
                                : <div>
                                <h6 className="title">工作经历</h6>
                                {
                                    this.state.work.map((item, index) => {
                                        return (
                                            <div className="bg-white b-t b-b" key={index}>
                                                <ul className="detail">
                                                    <li className="clearfix">
                                                        <span className="grey">公司名称</span>
                                                        <span className="pull-right w-200 d-ib t-r">{item.company_name}</span>
                                                    </li>
                                                    <li>
                                                        <span className="grey">起讫时间</span>
                                                        <span className="pull-right">{item.in_at}~{item.out_at}</span>
                                                    </li>
                                                    <li className="clearfix">
                                                        <span className="grey">职务</span>
                                                        <span className="pull-right w-200 d-ib t-r">{item.title}</span>
                                                    </li>
                                                    <li className="clearfix">
                                                        <span className="grey">证明人</span>
                                                        <div className="pull-right">
                                                            <span className="d-b t-r w-200">{item.prove_name}</span>
                                                            <span className="d-b t-r w-200">{item.prove_phone}</span>
                                                            <span className="d-b t-r w-200">{item.prove_email}</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        {
                            this.state.edu.length === 0
                                ? ''
                                : <div>
                                <h6 className="title">教育经历</h6>
                                {
                                    this.state.edu.map((item, index) => {
                                        return (
                                            <div className="bg-white m-b-sm b-t b-b" key={index}>
                                                <ul className="detail">
                                                    <li>
                                                        <span className="grey">学校名称</span>
                                                        <span className="pull-right">{item.school_name}</span>
                                                    </li>
                                                    <li>
                                                        <span className="grey">起讫时间</span>
                                                        <span className="pull-right">{item.in_at || '-'}~{item.out_at || '-'}</span>
                                                    </li>
                                                    <li>
                                                        <span className="grey">专业</span>
                                                        <span className="pull-right">{item.major || '暂无'}</span>
                                                    </li>
                                                    <li>
                                                        <span className="grey">学历 </span>
                                                        <span className="pull-right">{item.record_name || '暂无'}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }

    componentDidMount() {
        this.setState({
            work: this.props.location.state.works,
            edu: this.props.location.state.edus
        })
    }
}