import React from 'react';
import {Link} from 'react-router-dom'
import {getData, postData} from "../../../fetch/httpRequest"
import {setSessionItem, getSessionItem} from '../../../utils/sessionStorage'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {BillList} from '../BillList/index'

// session bill_type 1：未支付 2：已支付
export class PaidBill extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        // 判断是否还有多余可加载数据
        this.no_more = false;
        this.init = true;
        this.search_data = getSessionItem('paid_search_data');
        this.search_option = getSessionItem('paid_search_option');
        this.state = {
            bills: [],
            meta: {},
            // search_option: '本月-全部订单状态'
        };
        setSessionItem('bill_type', '2');
        document.title = '订单管理'
    }

    render() {
        const footer_obj = {
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
        };
        return (
            // 订单
            <div className="p-b-xxl full-h" style={{paddingTop: '.85rem'}}>
                <div style={{height: '.85rem', marginTop: '-.85rem', paddingTop: '.5rem'}} className="">
                    <div className="bg-white b-b p-a pos-f full-w" style={{top: 0}}>
                        <span className="cursor"
                              onClick={() => {this.props.history.replace('/Index')}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                        <Link to="/Bill/UnFapiaoBill">
                    <span className="pull-right">未开票订单
                        <span className={this.state.meta.uninvoice_amount === 0 ? 'label m-r-sm disabled' : "label"}>{this.state.meta.uninvoice_amount}</span>
                        <i className="icon_right_triangle"></i>
                    </span>
                        </Link>
                    </div>
                    {console.log(this.state.meta.data_type)}
                    <h6 className="title p-l p-r">历史核单列表 <Link to={
                        {
                            pathname: '/Bill/Search',
                            // state: this.props.location.state ? this.props.location.state : null
                            state: this.state.meta.date_type
                        }
                    } className="pull-right">{this.search_option || '本月-全部订单状态'}</Link>
                    </h6>
                </div>
                <div className=" full-h">
                    <BillList loadMore={this.loadMore}
                              data={{
                                  bills: this.state.bills,
                                  parent_this: this,
                                  no_more: this.no_more,
                                  init: this.init
                              }}/>
                </div>
                <div className="bg-white p-a shadow-top" style={footer_obj}
                >
                    <Link to='/Bill/UnpaidBill'>
                        <span>待支付订单</span>
                        <span className='pull-right'><span className={this.state.meta.unpaied_amount === 0 ? `label disabled` : 'label error'}>{this.state.meta.unpaied_amount}</span><i
                            className="icon_right_triangle"></i></span>
                    </Link>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.getBills(this);
    }

    getBills(parent_this, page = 1) {
        const op_status = (parent_this.search_data && parent_this.search_data.op_status !== '-1') ? parent_this.search_data.op_status : undefined;
        const date_type = parent_this.search_data ? parent_this.search_data.date_type : 1;
        getData(parent_this.billManageUrls.orderPaid(op_status, date_type), {page: page})
            .then(res => {
                let bills = parent_this.state.bills;
                bills = bills.concat(res.data.list);
                parent_this.init = false;
                parent_this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                parent_this.setState({
                    bills: bills,
                    meta: res.meta
                });
            })
    }

    loadMore(parent_this, page) {
       !parent_this.no_more && parent_this.getBills(parent_this, page);
    }
}