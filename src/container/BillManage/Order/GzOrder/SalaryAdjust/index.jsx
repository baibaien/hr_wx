import React from 'react'
import {getData, postData} from '../../../../../fetch/httpRequest'
import {changeValue} from '../../../../../utils/form'
import {BillManageUrls} from '../../../../../service/billManageApi/billManageUrl'

//出勤调整
export class SalaryAdjust extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.yg_id = this.props.location.state.yg_id;
        this.pay_month = this.props.location.state.pay_month;
        this.type = this.props.location.state.type;
        console.log(this.type);
        this.validates = {
            bonus_money: [
                {
                    func_name: 'numberValid'
                }
            ]
        };
        this.state = {
            column: [],
            column_err: {},
            annualed: '',
            meta: [],
            adjust_err: {},
            adjust_data: {},
            // title_year: []
        };
        document.title = this.type === 2 ? '通用扣减' : '浮动工资'
    }

    render() {
        return (
            <div>
                <div className="bg-white clearfix b-b shadow-bottom">
                    <span className="" onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_close p-a"></i></span>
                    <span className="pull-right p-a p-t-sm p-b-sm">
                        <span className="btn btn-sm" onClick={this.saveData.bind(this)}>保存</span>
                    </span>
                </div>
                <div className="m-b-sm">
                    <div className="bg-white m-b-sm b-b">
                        <ul className="detail">
                            {
                                this.state.column.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <span>{this.state.meta.tableHeader[index + 1]['column_name']}</span>
                                            <span className="pull-right">
                                <input type="text"
                                       placeholder="输入金额"
                                       className="t-r"
                                       onChange={changeValue.bind(this,
                                           ['column', index, 'bonus_money'],
                                           this.validates['bonus_money'])}
                                       value={this.state.column[index]['bonus_money']}/>
                                                                <p className="t-sm error t-r">{this.state.column_err[index]['bonus_money']}</p>
                            </span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.getBonus(this.pay_month, this.type), {yg_id: this.yg_id})
            .then(res => {
                let column_err = {};
                res.data[0].column.forEach((item, index) => {
                    column_err[index] = {}
                });
                this.setState({
                    annualed: res.data[0].annualed,
                    column: res.data[0].column,
                    meta: res.meta,
                    pay_month: this.pay_month,
                    column_err: column_err
                })
            })
    }


    saveData() {
        let submit_data = {
            pay_month: this.state.pay_month,
            annualed: this.state.annualed,
            info: this.state.column
        };

        postData(this.billManageUrls.editBonus(), submit_data)
            .then(res => {
                this.props.history.goBack()
            })
            .catch(err => {
            });
    }
}