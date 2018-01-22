import React from 'react';
import {Link} from 'react-router-dom'
import {getData, postData, deleteData} from "../../../fetch/httpRequest"
import {showModal, cancelModal} from '../../../utils/modal'
import {selectedList, selectAll} from '../../../utils/selectOptions'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'

export class UnFapiaoBill extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.init = true;
        this.state = {
            bills: [],
            all_money: 0.00,
            invoice_money: 0.00,
            is_invoice: false,
            is_merge: 1,
            // use: true,
            checkbox_list: [],
            // b_money: 0
        }
        document.title = '待开票订单'
    }

    render() {
        const foot_obj = {
            bottom: '0',
            left: '0',
            right: '0',
            height: '2rem',
            zIndex: 3
        };
        return (
            // 未生成订单账单列表
            <div className="pos-r full-h" style={{paddingBottom: '2.2rem', paddingTop: '.5rem'}}>
                <div className="bg-white p-a b-b m-b-sm" style={{marginTop: '-.5rem'}}>
                    <span onClick={() => {
                        this.props.history.replace('/Bill')
                    }} className="cursor"><i className="icon_left_triangle grey v-m"></i>返回</span>
                    {/*this.props.history.goBack()*/}
                    <span className="pull-right">
                        <Link to="/Settings/Fapiao">
                            <label className="">发票信息</label>
                            <i className="icon_right_triangle"></i>
                        </Link>
                    </span>
                </div>
                {
                    this.state.bills.length === 0 && !this.init
                        ? <div className="p-t p-b t-c">
                        <img src="/src/assets/image/none.svg" alt=""/>
                    </div>
                        : <div className="bg-white" style={{height: '100%', overflow: 'auto'}}>
                        <div className="p-a">
                            <label className="ui-check"><input type="checkbox"
                                                               checked={this.state.checkbox_list.length === this.state.bills.length && this.state.checkbox_list.length !== 0}
                                                               onChange={this.getAllBills.bind(this)}/><i
                                className="icon_ui v-m"></i><span className="t v-m">全选</span></label>
                            <span className="pull-right">已选中{this.state.checkbox_list.length}个订单</span>
                        </div>
                        <ul className="b-t b-b">
                            {
                                this.state.bills.map((item, index) => {
                                    return (
                                        <li key={index} className="p-l pos-r p-t-sm p-b-sm clearfix">
                                            <label className="ui-check pos-a" style={{top: '.1rem'}}>
                                                <input type="checkbox" value={item.order_id}
                                                       name={index}
                                                       checked={this.state.checkbox_list.indexOf(item.order_id) >= 0}
                                                       onChange={this.getBills.bind(this, item.order_id)}/>
                                                <i className="icon_ui"></i>
                                            </label>
                                            <div className=" m-l sub-item">
                                                <Link to={{
                                                    pathname: `/Bill/Detail/${item.order_id}`,
                                                    state: item
                                                }}>
                                                    <div className="pull-right p-t">
                                                        <i className="icon_right_triangle"></i>
                                                    </div>
                                                    <div className="m-r">
                                                        <div>
                                                            <p className="grey t-sm">
                                                                <span>订单编号：{item.order_id}</span>
                                                                <span className="pull-right">支付于{item.audit_time}</span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                        <span
                                                            className="w-120 ellipsis">{item.bill.map((sub_item, sub_index) =>
                                                            <span key={sub_index}>{sub_item.type_name}</span>)}</span>
                                                            <span className="pull-right">{item.all_money}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </div>
                }
                {
                    this.state.bills.length === 0 && !this.init
                        ? ''
                        : <div className="footer pos-a bg-white full-w" style={foot_obj}>
                        <div className="p-a">
                            <p className="t-c grey m-b">已选订单金额：{Number(this.state.all_money).toFixed(2)}</p>
                            <h6 className="t-lg bold t-c">{Number(this.state.invoice_money).toFixed(2)}</h6>
                            <p className="grey t-c">可开票金额</p>
                            <button
                                className={`cursor m-t btn full-w ${this.state.checkbox_list.length > 0 ? '' : 'disabled'}`}
                                style={{boxSizing: 'border-box'}}
                                onClick={this.confirmFapiao.bind(this)}>确认开票
                            </button>
                        </div>
                    </div>
                }
                <div className={`pos-f full-w modal bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f cursor"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'fapiao'
                                ? <ul className=" bg-white">
                                <li className="grey t-sm t-c p-a b-b">您选择了多个订单，请选择开票方式</li>
                                <li className="t-c cursor p-a b-b" onClick={this.choseMerged.bind(this, 0)}>分别开票</li>
                                <li className="t-c cursor b-b p-a" onClick={this.choseMerged.bind(this, 1)}>合并开票</li>
                                <li className="m-t-xs cursor p-a t-c" onClick={cancelModal.bind(this)}>取消</li>
                            </ul>
                                : " "
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.unFapiaoBill(), {is_hide: 1})
            .then((res) => {
                this.init = false;
                this.setState({
                    bills: res.data.list
                });
            })
            .catch(err => {
            })
    }

    //选择账单生成金额
    getBills(id) {
        const list = selectedList(this.state.checkbox_list, id);
        const {invoice_money, all_money} = this.totalBill();
        this.setState({
            checkbox_list: list,
            all_money: all_money,
            invoice_money: invoice_money,
        });
    }

    totalBill(check_list = this.state.checkbox_list) {
        const list = check_list;
        const arr = this.state.bills;
        let all_money = 0;
        let invoice_money = 0;
        console.log(list);
        arr.forEach(check_item => {
            let n = list.indexOf(check_item.order_id) >= 0 ? 1 : 0;
            // console.log('str', check_item);
            let item_all_money = this.removeSymbol(check_item.all_money);
            let item_invoice_money = this.removeSymbol(check_item.invoice_money);
            all_money += n * Number(item_all_money);
            invoice_money += n * Number(item_invoice_money);

        });
        return {
            all_money: all_money.toFixed(2),
            invoice_money: invoice_money.toFixed(2)
        }
    }

    removeSymbol(str) {
        console.log(str);
        return str.split('')
            .filter(single_str => {
                return single_str !== ','
            })
            .join('')
    }

    // 申请发票
    applyFapiao() {
        let submit_data = {};
        submit_data.order_id = this.state.checkbox_list.join(',');
        submit_data.is_merge = this.state.is_merge;
        postData(this.billManageUrls.applyFapiao(), submit_data)
            .then(res => {
                getData(this.billManageUrls.unFapiaoBill(), {is_hide: 1})
                    .then((res) => {
                        this.props.history.push(`/Bill/Detail/${this.state.checkbox_list[0]}`)
                    })
                    .catch(err => {
                    })
            })
    }

    confirmFapiao() {
        switch (this.state.checkbox_list.length) {
            case 0 :
                break;
            case 1:
                this.applyFapiao();
                break;
            default:
                showModal.call(this, 'fapiao');
                break;
        }
    }

    choseMerged(type) {
        this.setState({
            is_merge: type
        });
        this.applyFapiao();
        cancelModal.call(this);
    }

    // 删除账单
    deleteOrder(id) {
        const bill_urls = new BillManageUrls();
        deleteData(bill_urls.deleteOrder(id), {}).then(res => console.log(res));
    }

    getAllBills() {
        let checkbox_list = selectAll(this.state.checkbox_list, this.state.bills, 'order_id');
        const {invoice_money, all_money} = this.totalBill(checkbox_list);
        this.setState({
            checkbox_list: checkbox_list,
            invoice_money: invoice_money,
            all_money: all_money
        });
    }
}