import React from 'react';
import {getData, deleteData} from "../../../fetch/httpRequest"
import {setSessionItem} from '../../../utils/sessionStorage'
import {showModal, cancelModal} from '../../../utils/modal'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {BillList} from '../BillList/index'

export class UnpaidBill extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        //未支付订单没有分页！默认设置为不分页
        this.no_more = true;
        this.current_id = 0;
        this.init = true;
        this.state = {
            bills: [],
            edit: false
        };
        setSessionItem('bill_type', '1');
        document.title = '待支付订单'
    }

    render() {
        return (
            // 未支付订单
            <div className="full-h" style={{paddingTop: '.7rem'}}>
                <div className="bg-white p-a b-b m-b shadow-bottom pos-f full-w" style={{top: 0}}>
                    <span onClick={() => {
                        this.props.history.replace('/Bill')
                    }} className="cursor"><i className="icon_left_triangle grey v-m"></i>返回</span>
                    {
                        this.state.bills.length > 0
                            ? <span className="pull-right cursor"
                                    onClick={this.toggleEdit.bind(this)}>
                        {
                            this.state.edit
                                ? <span className="btn btn-sm">完成</span>
                                : '编辑'
                        }
                    </span>
                            : ''
                    }

                </div>
                <BillList data={{
                    bills: this.state.bills,
                    parent_this: this,
                    no_more: this.no_more,
                    edit: this.state.edit,
                    init: this.init
                }}
                          deleteItem={this.deleteItem}/>
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
                                        <button className="btn btn-sm disabled m-l" onClick={cancelModal.bind(this)}>
                                            取消
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
        this.getBills(this);
    }

    getBills(parent_this, page = 1) {
        getData(parent_this.billManageUrls.orderUnpaid(), {page: page})
            .then(res => {
                let bills = parent_this.state.bills;
                bills = bills.concat(res.data.list);
                this.init = false;
                parent_this.setState({
                    bills: res.data.list
                });
            })
    }

    toggleEdit() {
        let edit = !this.state.edit;
        this.setState({
            edit: edit
        })
    }

    deleteItem(id) {
        this.current_id = id;
        showModal.call(this, 'delete')
    }

    // 删除账单
    deleteOrder(id) {
        cancelModal.call(this);
        deleteData(this.billManageUrls.deleteUnpaiedBill(id), {})
            .then(res => {
                this.getBills(this, 1, true)
            })
            .catch(err => console.log(err));
    }
}