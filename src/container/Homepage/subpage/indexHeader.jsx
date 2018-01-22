import React from 'react'
import {Link} from 'react-router-dom'

export class IndexHeader extends React.Component {
    constructor(props, context) {
        super(props, context)

    }

    render() {
        const headerStyle = {
            padding: '.15rem 0',
            borderBottom: '1px solid #eaeaea'
        };
        return (
            <div>
                <div className="bg-white">
                    <div className="header t-c " style={headerStyle}>{this.props.data.company}</div>
                    {
                        this.props.data.unpay_order_count === 0
                            ? <div>
                            {/*没有待支付订单，显示当月支出*/}
                            <div className="t-c p-t-xl p-b-xl b-b">
                                <h1 className="t-24 bold t-c">{this.props.data.current_month_total}</h1>
                                <p className="grey t-c">{this.props.data.current_month}月总支出</p>
                            </div>
                            {/*<div className="p-a">*/}
                            {/*查看统计*/}
                            {/*<span className="grey pull-right">上月支出{this.props.data.last_month_total}</span>*/}
                            {/*</div>*/}
                        </div>
                            : <div>
                            {/*有待支付订单，显示订单金额*/}
                            <div className="t-c p-t-xl p-b-xl b-b">
                                <h1 className="t-24 bold t-c">{this.props.data.unpay_order_total}</h1>
                                <p className="grey t-c">订单支付尚未完成</p>
                            </div>
                            <div className="p-a t-c b-b shadow-bottom"
                                 style={{height:'.5rem'}}
                                 ref={this.props.scrollPage.bind(this, this.props.parent_this)}>
                                <div className={this.props.fixedHeader === 'fixed' ? 'hide' : ''}>
                                    <Link to={{
                                        pathname: this.props.data.unpay_order_count === 1 ? `/Bill/Pay` : '/Bill/UnpaidBill',
                                        state: {order_id: this.props.data.order_id}
                                    }}><i className="icon_arrow_right green v-m"></i>去支付</Link>
                                </div>
                                <div className={this.props.fixedHeader === 'fixed' ? 'pos-f full-w p-a t-l bg-white b-b shadow-bottom' : 'hide'}
                                style={{top:0,left:0, height:'.5rem'}}>
                                    <Link to={{
                                        pathname: this.props.data.unpay_order_count === 1 ? `/Bill/Pay` : '/Bill/UnpaidBill',
                                        state: {order_id: this.props.data.order_id}
                                    }}><span>{this.props.data.unpay_order_total}<span
                                        className="grey v-m m-r-xs">尚未支付</span></span><span className="pull-right"><i
                                        className="icon_arrow_right green v-m"></i>继续支付</span></Link>
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        )
    }

    componentDidMount() {

    }
}
