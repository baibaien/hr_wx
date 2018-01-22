import React from 'react';
import {Link} from 'react-router-dom'
import {getData, postData, deleteData} from "../../../fetch/httpRequest"
import {dateTransform} from '../../../utils/dateTransform'
import {selectedList, selectAll} from '../../../utils/selectOptions'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {showModal, cancelModal} from "../../../utils/modal";

export class UnBillOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.edit = false;
        this.current_id = -1;
        this.state = {
            bills: {
                list: [],
            },
            b_money: 0,
            all_money: 0,
            money: 0,
            is_invoice: false,
            use: true,
            checkbox_list: [],
            submit_data: {},
            edit: false,
            modal_name: '',
            show_modal: '',
            modal_in: ''
        };
        document.title = '账单列表';
    }

    render() {
        const foot_obj = {
            bottom: '0',
            left: '0',
            right: '0',
            height: '2.6rem'
        };
        return (
            // 未生成订单账单列表
            <div className="pos-r" style={{paddingBottom: '3rem'}}>
                <div className="bg-white p-a b-b m-b-sm">
                    <span onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle  v-m grey"></i>返回</span>

                    <span onClick={this.toggleEdit.bind(this)} className="pull-right">
                        {
                            !this.state.edit
                                ? <span><i className="icon_edit_simple grey v-m m-r-xs t-sm"></i>编辑</span>
                                : <span className="btn btn-sm">完成</span>
                        }
                    </span>
                </div>
                <div className="bg-white">
                    <div className="p-a">
                        <label className="ui-check" style={{marginLeft: '-.05rem', marginRight: '.15rem'}}><input
                            type="checkbox"
                            checked={this.state.checkbox_list.length === this.state.bills.list.length && this.state.checkbox_list.length !== 0}
                            onChange={this.getAllBills.bind(this)}/><i
                            className="icon_ui v-m"></i><span className="t v-m" style={{marginLeft: '.05rem'}}>全选</span></label>
                        <span className="pull-right">已选中{this.state.checkbox_list.length}个账单</span>
                    </div>
                    <ul className="b-t b-b list">
                        {
                            this.state.bills['list'].map((item, index) => {
                                return (
                                    <li key={item.id} className="p-l pos-r p-t-sm ">
                                        <label className="ui-check pos-a" style={{top: '.1rem', left: '.1rem'}}>
                                            <input type="checkbox" value={item.id}
                                                   name={index}
                                                   checked={this.state.checkbox_list.indexOf(item.id) >= 0}
                                                   onChange={this.getBills.bind(this, item.id)}/>
                                            <i className="icon_ui"></i>
                                        </label>
                                        {/*<label onClick={this.deleteOrder.bind(this, item.id)}></label>*/}
                                        <div className=" m-l sub-item  b-b p-r clearfix">
                                            <span style={{width: '.15rem'}} className="v-t pull-right p-t-lg m-l-xs">
                                                {
                                                    item.type <= 4 || item.type == 42
                                                        ? <Link to={{
                                                        pathname: `/Bill/OrderDetail/${item.id}`,
                                                        state: {
                                                            type: item.type,
                                                            city_name: item.city_name
                                                        }
                                                    }}>
                                                        <div className={!this.state.edit ? `` : 'hide'}>
                                                            <i className="icon_right_triangle"></i>
                                                        </div>
                                                    </Link>
                                                        : ''
                                                }
                                                {
                                                    <div className={!this.state.edit ? `hide` : ''}
                                                         onClick={this.showDeleteModal.bind(this, item.id)}>
                                                        <i className="icon_error error"></i>
                                                    </div>
                                                }
                                                </span>
                                            <div className="m-r">
                                                <div>
                                                    <span className=" ellipsis" style={{width: '1.8rem'}}>{item.city_name}{item.type_name}</span>
                                                    <span className="pull-right">{item.money}</span>
                                                </div>
                                                <div className="m-b-sm">
                                                    <div className="d-ib">
                                                        {
                                                            item.num === ''
                                                                ? ''
                                                                : <span className="d-b t-sm grey">{item.num}人</span>
                                                        }
                                                        <span
                                                            className="d-b t-sm grey">生成于{dateTransform(item.create_time)}</span>
                                                    </div>
                                                    <div className="pull-right">
                                                        {
                                                            item.child.map((sub_item, index) => {
                                                                return (
                                                                    <span className="d-b t-sm grey"
                                                                          key={index}>+{sub_item.type_name} {sub_item.money}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="footer pos-f bg-white full-w b-t shadow-top" style={foot_obj}>
                    <div className="p-a b-b">
                        <label className={`ui-check ${this.state.b_money <= 0 ? `disabled` : ''}`}
                               style={{marginLeft: '-.05rem'}}>
                            <input type="checkbox"
                                   value={this.state.use}
                                   checked={this.state.use}
                                   onChange={this.isUse.bind(this)}
                                   disabled={this.state.b_money <= 0}/>
                            <i className="icon_ui v-m"></i>
                            <span className="t v-m"
                                  style={{marginLeft: '.05rem'}}>用账户余额抵扣：{Number(this.state.b_money) >= Number(this.state.all_money) ? this.state.all_money : this.state.b_money}</span>
                        </label>
                        <span className="pull-right">
                        <Link to="/Settings/Fapiao">
                            <label className="">发票信息</label>
                            <i className="icon_right_triangle"></i>
                        </Link>
                    </span>
                    </div>
                    <div className="p-a">
                        <p className="t-c grey m-b">订单金额：{this.state.all_money}</p>
                        <h6 className="t-lg bold t-c">{this.state.money}</h6>
                        <p className="grey t-c">应付金额</p>
                        <button className={`m-t btn full-w ${this.state.checkbox_list.length > 0 ? '' : 'disabled'}`}
                                style={{boxSizing: 'border-box'}}
                                onClick={this.createBill.bind(this)}>下单支付
                        </button>
                    </div>
                </div>
                <div id="alert" className={`pos-f full-w modal alert ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    {
                        this.state.modal_name === 'delete'
                            ? <div>
                            <div className={`wrapper setting pos-a p-a bg-white b-radius  ${this.state.modal_in}`}>
                                <p className="m-b-sm">提示：</p>
                                <p className="m-b">确定要删除当前账单吗</p>
                                <div className="t-c">
                                    <button className="btn btn-sm"
                                            onClick={this.deleteOrder.bind(this, this.current_id)}>
                                        确定
                                    </button>
                                    <button className="btn btn-sm disabled m-l" onClick={cancelModal.bind(this)}>取消
                                    </button>
                                </div>
                            </div>

                        </div>
                            : ''
                    }

                </div>
            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.orderIndex())
            .then((res) => {
                let use = res.meta.b_money != 0;
                this.setState({
                    bills: res.data,
                    b_money: res.meta.b_money,
                    use: use
                });
            })
    }

    //选择账单生成金额
    getBills(id) {
        const list = selectedList(this.state.checkbox_list, id);
        const {money, all_money} = this.totalBill(this.state.checkbox_list);
        this.setState({
            checkbox_list: list,
            all_money: all_money.toFixed(2),
            money: money.toFixed(2),
        });
    }

    totalBill(check_list) {
        const list = check_list;
        const arr = this.state.bills.list;
        const m = this.state.use === true ? 1 : 0;
        let b_money = Number(this.state.b_money);
        let all_money = 0;
        let money = 0;
        arr.forEach(check_item => {
            let n = list.indexOf(check_item.id) >= 0 ? 1 : 0;
            all_money += n * Number(check_item.money);
            check_item['child'].forEach(item => {
                all_money += n * Number(item.money);
            })
        });
        // 判断账户余额是否会出总金额
        b_money = b_money >= all_money ? all_money : b_money;
        money = all_money.toFixed(2) - m * b_money.toFixed(2);
        return {
            money: money,
            all_money: all_money
        }
    }

    isUse() {
        let value = !this.state.use;
        let m = value === true ? 1 : 0;
        console.log(m, this.state.all_money, this.state.b_money)
        let b_money = Number(this.state.b_money) > Number(this.state.all_money) ? this.state.all_money : this.state.b_money;
        let money = 0;
        if (Number(this.state.all_money) !== 0) {
            money = Number(this.state.all_money).toFixed(2) - m * Number(b_money).toFixed(2);
        }
        this.setState({
            use: value,
            money: money.toFixed(2)
        })
    }

    getAllBills() {
        const checkbox_list = selectAll(this.state.checkbox_list, this.state.bills.list);
        const {money, all_money} = this.totalBill(checkbox_list);
        this.setState({
            checkbox_list: checkbox_list,
            money: money.toFixed(2),
            all_money: all_money.toFixed(2)
        });
    }

    // 删除账单
    deleteOrder(id) {
        cancelModal.call(this);
        deleteData(this.billManageUrls.deleteOrder(id), {})
            .then(res => {
                getData(this.billManageUrls.orderIndex())
                    .then((res) => {
                        let use = res.meta.b_money != 0;
                        console.log(this.state.checkbox_list);
                        let list = []
                        res.data.list.forEach(item => {
                                if (this.state.checkbox_list.indexOf(item.id) >= 0) {
                                    list.push(item.id);
                                }
                            }
                        );
                        this.setState({
                            bills: res.data,
                            b_money: res.meta.b_money,
                            use: use,
                            checkbox_list: list
                        });
                        return res;
                    })
                    .then(res => {
                        const {money, all_money} = this.totalBill(this.state.checkbox_list);
                        this.setState({
                            all_money: all_money.toFixed(2),
                            money: money.toFixed(2),
                        });
                    })
            })
            .catch(err => console.log(err));
    }

    showDeleteModal(id) {
        this.current_id = id;
        showModal.call(this, 'delete')
    }

    // 生成订单
    createBill() {
        if (this.state.checkbox_list.length > 0) {
            let bill_id = this.state.checkbox_list.join(',');
            let submit_data = {};
            submit_data.bill_id = bill_id;
            submit_data.use = this.state.use === true ? 1 : 0;
            postData(this.billManageUrls.createOrder(), submit_data)
                .then(res => {
                    if (res.length === 1) {
                        this.props.history.push({
                            pathname: '/Bill/Pay',
                            state: {order_id: res[0]}
                        })
                    } else if (res.length === 2) {
                        // 待支付列表
                        this.props.history.push({
                            pathname: '/Bill/UnpaidBill'
                        })
                    } else if (res.length === 0) {
                        // 历史订单列表
                        this.props.history.push({
                            pathname: '/Bill'
                        })
                    }
                });
        }
    }

    toggleEdit() {
        let edit = this.state.edit;
        this.setState({
            edit: !edit
        })
    }
}