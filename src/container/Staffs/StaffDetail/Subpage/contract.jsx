import React from 'react';
import {Link} from 'react-router-dom'

export class StaffDetailContract extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            contract: this.props.location.state
        }
    }

    render() {
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm">
                    <span className="cursor"
                          onClick={() => {this.props.history.goBack()}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                {
                     this.state.contract instanceof Array
                        ? <div className="p-a t-c">
                        <img src="/src/assets/image/none.svg" alt=""/>
                    </div>
                        : <div className="bg-white">
                        <ul className="detail">
                            {/*{*/}
                                {/*this.state.contract.map((item, index) => {*/}
                                    {/*return (*/}
                                        {/*<li key={index}>*/}
                                            {/*<span className="grey">{item.code}</span>*/}
                                            {/*<span className="pull-right">{item.in_at}~{item.out_at}</span>*/}
                                        {/*</li>*/}
                                    {/*)*/}
                                {/*})*/}
                            {/*}*/}
                            <li className="clearfix">
                                <span className="grey v-t">{this.props.location.state.code}</span>
                                <span className="pull-right ">{this.props.location.state.in_at || '生效日期暂无'}~{this.props.location.state.out_at || '结束日期暂无'}</span>
                            </li>
                        </ul>
                    </div>
                }
            </div>
        )
    }

    componentDidMount() {
    }
}