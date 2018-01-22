import React from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import {getData} from '../../fetch/httpRequest'
import {cancelModal, showModal} from '../../utils/modal'
import {dateTransformToMonth} from '../../utils/dateTransform'

// 账单模板
export class OrderTemplate extends React.Component {
    constructor(props, context) {
        super(props, context);
        let order_type = -1;

        order_type = this.origin_type.indexOf(this.props.data.type) + 1;

        this.state = {
            modal_in: '',
            modal_name: '',
            show_modal: '',
            order_type: order_type
        }
    }


    render() {
        return (
            <div style={{paddingBottom: '2rem', paddingTop: '.5rem'}}>
                <div className="bg-white b-b">
                    <table className="bg-white full-w">
                        <thead style={{padding: '0 .2rem'}} className="">
                        <tr>
                            {
                                this.state.header.map((item, index) => {
                                    return (
                                        <th style={{fontWeight: 'normal', padding: '5px 5px 5px .15rem'}}
                                            className="grey t-l"
                                            key={index}>{item}</th>
                                    )
                                })
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.data.source.map((item, index) => {
                                return (
                                    <tr className={`b-t ${this.createStateArr.call(this, item)[0] === 0 ? '' : 'bg-grey'}`}
                                        key={index}>
                                        {
                                            this.state.title.map((title_item, title_index) => {
                                                return (
                                                    <td style={{padding: '.12rem 5px .12rem .15rem'}}
                                                        key={title_index}>{item[title_item]}</td>
                                                )
                                            })
                                        }
                                        <td style={{padding: '5px 5px 5px .15rem'}} className="t-c pos-r">
                                            <i className={this.getStatus.call(this, item)['status'] >= -1 ? this.getStatus.call(this, item)['content'] : 'hide'}> </i>
                                            {
                                                this.getStatus.call(this, item)['status'] < -1
                                                    ? this.getStatus.call(this, item)['content']
                                                    : ''
                                            }
                                            <Link className="pos-a p-l p-r"
                                                  style={{right: '.1rem'}}
                                                  to={{
                                                      pathname: `/Bill/${this.props.data.type}Order/${dateTransformToMonth(this.props.data.pay_month).split('/').join('-')}/Detail/${item.salary_id}`,
                                                      state: item
                                                  }}><i
                                                className="`icon_right_triangle"></i>{
                                                console.log(item)
                                            }
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div className="footer shadow-top b-t pos-f full-w bg-white"
                     style={{left: 0, bottom: 0, height: '1.75rem', zIndex: 1}}>
                    <p className="p-a b-b" onClick={this.showOrderStaff.bind(this, this.props.parent_this, {
                        type: this.state.order_type,
                        month: this.props.current_month
                    })}>账单中将包含的员工
                        <span className="pull-right ">
                            <span
                                className={`label m-r-sm ${this.billStaff.call(this).length === 0 ? 'disabled' : 'success'}`}>{this.billStaff.call(this).length}
                            </span>
                            <i
                                className="icon_angle_up"> </i>
                        </span>
                    </p>
                    <div className="p-a">
                        <p className="t-sm grey t-c m-b">注意：列表中只罗列了当月在职的员工</p>
                        <button className={`btn full-w ${this.billStaff.call(this).length === 0 ? 'disabled' : ''}`}
                                onClick={this.props.createOrder.bind(this, this.props.data.parent_this, {
                                    type: this.state.order_type,
                                    month: this.props.data.current_month
                                })}>
                            生成{dateTransformToMonth(this.props.data.pay_month).split('-')[1] || dateTransformToMonth(this.props.data.pay_month).split('/')[1]}月{this.props.data.type === 'Gz' ? '工资' : '社保'}账单
                        </button>
                    </div>
                </div>
                <div className={`pos-f full-w modal bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}
                         style={{marginBottom: '1.75rem'}}>
                        <table className="bg-white full-w">
                            <thead style={{padding: '0 .2rem'}} className="">
                            <tr>
                                {
                                    this.state.header.map((item, index) => {
                                        return (
                                            <th style={{fontWeight: 'normal', padding: '5px 5px 5px .15rem'}}
                                                className="grey t-l"
                                                key={index}>{item}</th>
                                        )
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.data.source.map((item, index) => {
                                    return (
                                        <tr className={`b-t ${this.createStateArr.call(this, item)[0] === 0 ? '' : 'bg-grey'}`}
                                            key={index}>
                                            {
                                                this.state.title.map((title_item, title_index) => {
                                                    return (
                                                        <td style={{padding: '.12rem 5px .12rem .15rem'}}
                                                            key={title_index}>{item[title_item]}</td>
                                                    )
                                                })
                                            }
                                            <td style={{padding: '5px 5px 5px .15rem'}} className="t-c pos-r">
                                                <i className={this.getStatus.call(this, item)['status'] >= -1 ? this.getStatus.call(this, item)['content'] : 'hide'}> </i>
                                                {
                                                    this.getStatus.call(this, item)['status'] < -1
                                                        ? this.getStatus.call(this, item)['content']
                                                        : ''
                                                }
                                                <Link className="pos-a p-l p-r"
                                                      style={{right: '.1rem'}}
                                                      to={{
                                                          pathname: `/Bill/${this.props.data.type}Order/${dateTransformToMonth(this.props.data.pay_month).split('/').join('-')}/Detail/${item.salary_id}`,
                                                          state: item
                                                      }}><i
                                                    className="icon_right_triangle"></i>{
                                                    console.log(item)
                                                }
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        )
    }
    componentDidMount() {
        // console.log('test', this.props.data.op_month, this.props.data);
    }
    createStateArr(obj) {
        const key_word = this.props.data.key_word;
        return [obj[`yg_is_${key_word}_status`],
            obj[`yg_is_${key_word}_stop`],
            obj[`yg_is_${key_word}_edit`],
            obj[`yg_is_${key_word}`]
        ]
    }

    // 账单包含员工
    billStaff() {
        return this.props.data.source.filter((item) => {
            const temp = this.createStateArr(item);
            if (temp[0] === 0 && temp[1] === 0 && temp[2] === 1 && temp[3] === 1) {
                return temp
            }
        })
    }

    showOrderStaff() {
        const staff_length = this.billStaff().length;
        if (staff_length > 0) {
            showModal.call(this, 'orderStaff')
        }
    }
}

class TableTemple extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log(this.props);
        this.state = {
            title: this.props.data.title,
            header: this.props.data.header,
        }
    }

    render() {
        return (
            <table className="bg-white full-w">
                <thead style={{padding: '0 .2rem'}} className="">
                <tr>
                    {
                        this.state.header.map((item, index) => {
                            return (
                                <th style={{fontWeight: 'normal', padding: '5px 5px 5px .15rem'}}
                                    className="grey t-l"
                                    key={index}>{item}</th>
                            )
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {
                    this.props.data.source.map((item, index) => {
                        return (
                            <tr className={`b-t ${this.createStateArr.call(this, item)[0] === 0 ? '' : 'bg-grey'}`}
                                key={index}>
                                {
                                    this.state.title.map((title_item, title_index) => {
                                        return (
                                            <td style={{padding: '.12rem 5px .12rem .15rem'}}
                                                key={title_index}>{item[title_item]}</td>
                                        )
                                    })
                                }
                                <td style={{padding: '5px 5px 5px .15rem'}} className="t-c pos-r">
                                    <i className={this.getStatus.call(this, item)['status'] >= -1 ? this.getStatus.call(this, item)['content'] : 'hide'}> </i>
                                    {
                                        this.getStatus.call(this, item)['status'] < -1
                                            ? this.getStatus.call(this, item)['content']
                                            : ''
                                    }
                                    <Link className="pos-a p-l p-r"
                                          style={{right: '.1rem'}}
                                          to={{
                                              pathname: `/Bill/${this.props.data.type}Order/${dateTransformToMonth(this.props.data.pay_month).split('/').join('-')}/Detail/${item.salary_id}`,
                                              state: item
                                          }}><i
                                        className="icon_right_triangle"></i>{
                                            console.log(item)
                                    }
                                    </Link>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        )
    }

    getStatus(obj) {
        return this.judgeStaus(this.createStateArr(obj));
    }

    // 判断社保状态码
    judgeStaus(item_arr) {
        //index: 0:状态，1：是否允许操作，2：是否可编辑，3：是否使用公司业务
        if (item_arr[0] === 0) {
            if (item_arr[1] === 0) {
                if (item_arr[3] === 0) {
                    // 不使用公司业务 -
                    return {content: 'icon_minus', status: 0}
                } else if (item_arr[2] === 1 && item_arr[3] === 1) {
                    // 使用公司业务并可编辑
                    return {content: 'green icon_check', status: 1}
                } else if (item_arr[2] === 0 && item_arr[3] === 1) {
                    // 使用公司业务当前不可编辑
                    return {content: 'icon_check', status: 2}
                }
            } else {
                // -1禁用
                return {content: 'icon_error', status: -1}
            }
        } else if (item_arr[0] === 1) {
            return {content: '未开始受理', status: -2}

        } else if (item_arr[0] === -1) {
            return {content: '已截止受理', status: -3}
        }
    }

    createStateArr(obj) {
        const key_word = this.props.data.key_word;
        return [obj[`yg_is_${key_word}_status`],
            obj[`yg_is_${key_word}_stop`],
            obj[`yg_is_${key_word}_edit`],
            obj[`yg_is_${key_word}`]
        ]
    }
}