import React from 'react';
import {Link} from 'react-router-dom'

export class StaffDetailFamily extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            family: this.props.location.state
        }

    }
    render() {
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm cursor">
                    <span className="cursor"
                        onClick={() => {this.props.history.goBack()}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                {
                    this.state.family.length === 0
                        ? <div className="p-a t-c">
                            <img src="/src/assets/image/none.svg" alt=""/>
                        </div>
                    : this.state.family.map((item, index) => {
                        return (
                            <div className="bg-white" key={index}>
                                <ul className="detail">
                                    <li>
                                        <span className="grey">姓名</span>
                                        <span className="pull-right">{item.name}</span>
                                    </li>
                                    <li>
                                        <span className="grey">关系</span>
                                        <span className="pull-right">{item.rel_name}</span>
                                    </li>
                                    <li>
                                        <span className="grey">所属公司</span>
                                        <span className="pull-right">{item.company_name}</span>
                                    </li>
                                    <li>
                                        <span className="grey">岗位</span>
                                        <span className="pull-right">{item.title}</span>
                                    </li>
                                    <li>
                                        <span className="grey">联系电话</span>
                                        <span className="pull-right">{item.phone}</span>
                                    </li>

                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    componentDidMount() {
    }
}