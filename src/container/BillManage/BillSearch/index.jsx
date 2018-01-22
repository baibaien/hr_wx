import React from 'react'
import {getSessionItem, setSessionItem} from '../../../utils/sessionStorage'
import {changeUnNecValue} from '../../../utils/form'

export class BillSearch extends React.Component {
    constructor(props, context) {
        super(props, context);
        const op_status = getSessionItem('paid_search_data') ? getSessionItem('paid_search_data').op_status : '-1';
        const date_type = getSessionItem('paid_search_data') ? getSessionItem('paid_search_data').date_type : '1';
        this.op_status = [
            {
                id: '-1',
                name: '全部订单状态'
            },
            {
                id: '0',
                name: '未办理'
            },
            {
                id: '2',
                name: '办理中'
            },
            {
                id: '1',
                name: '已完成'
            },
        ];
        this.date_type = this.props.location.state;
        this.state = {
            search_data: {
                op_status: op_status,
                date_type: date_type
            },
            // date_type: [
            //     {
            //         id: 1,
            //         name: '本月'
            //     },
            //     {
            //         id: 3,
            //         name: '过去3个月'
            //     },
            //     {
            //         id: 2017,
            //         name: "2017"
            //     },
            // ]
        };
        document.title = '筛选订单'
    }

    render() {
        return (
            <div style={{paddingBottom: '.7rem'}}>
                <div className="p-a b-b shadow-bottom m-b-sm bg-white">
                    <span className="cursor" onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <h6 className="title">按订单状态筛选</h6>
                <div className="bg-white m-b-sm b-t b-b">
                    <ul className="detail p-l-xxl">
                        {
                            this.op_status.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <label className="ui-check d-b full-w">
                                            <input type="radio" value={item.id}
                                                   name="op_status"
                                                   checked={this.state.search_data.op_status === item.id}
                                                   onChange={changeUnNecValue.bind(this, ['search_data', 'op_status'])}
                                            />
                                            <i className="icon_ui pull-left m-r-sm"
                                               style={{marginLeft: '-.3rem', marginTop: '.03rem'}}></i>
                                            <div className="t">
                                                {item.name}
                                            </div>
                                        </label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <h6 className="title">按下单时间筛选</h6>
                <div className="bg-white b-t b-b p-l-xl">
                    <ul className="detail">
                        {
                            this.date_type.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <label className="ui-check d-b full-w">
                                            <input type="radio" value={item}
                                                   name="date_type"
                                                   checked={this.state.search_data.date_type.toString() === item.toString()}
                                                   onChange={changeUnNecValue.bind(this, ['search_data', 'date_type'])}/>
                                            <i className="icon_ui pull-left m-r-sm" style={{marginLeft: '-.3rem'}}></i>
                                            <div className="t">
                                                {item}{index > 1 ? '年' : '个月'}
                                            </div>
                                        </label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="footer p-a bg-white pos-f full-w b-t shadow-top"
                     style={{left: 0, right: 0, bottom: 0}}>
                    <span className="grey t-sm">
                        {
                            Number(this.state.search_data.date_type) > 3
                                ? `${this.state.search_data.date_type}年`
                                : `${this.state.search_data.date_type}个月`
                        }
                        -
                        {       this.op_status.filter((item) => {
                            return item.id === this.state.search_data.op_status
                        })[0].name
                        }
                    </span>

                    <span className="pull-right btn-sm btn"
                          onClick={this.jumpBack.bind(this)}>应用</span>
                </div>
            </div>

        )
    }

    componentDidMound() {

    }

    jumpBack() {
        let state_name = this.op_status.filter((item) => {
            return item.id === this.state.search_data.op_status
        })[0].name;
        let date_name = Number(this.state.search_data.date_type) > 3
                ? `${this.state.search_data.date_type}年`
                : `${this.state.search_data.date_type}个月`
        ;
        setSessionItem('paid_search_data', this.state.search_data);
        setSessionItem('paid_search_option', `${date_name}-${state_name}`);
        this.props.history.replace({
            pathname: '/Bill',
            // state: {
            //     // search_data: this.state.search_data,
            //     search_option: `${date_name}-${state_name}`
            // }
        })
    }
}