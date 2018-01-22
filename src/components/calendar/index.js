import React from 'react'
import {Link} from 'react-router-dom'
import '../../assets/styles/css-component/calendar.css'
import {getData, postData} from '../../fetch/httpRequest'
import {BillManageUrls} from '../../service/billManageApi/billManageUrl'

export class CalendarMonth extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.state = {
            tlist: this.props.data.tlist,
            back_month: this.props.data.back_month,
            temp_selected: this.props.data.back_month.map(item => item)
        }
    }

    render() {
        return (
            <div className="bg-white full-h pos-r">
                <div className="b-b shadow-bottom clearfix">
                    <span className="b-r p-a v-m cursor" style={{lineHeight: '.4rem'}}
                          onClick={() => {
                              this.props.data.parent_this.props.history.goBack()
                          }}><i className="icon_close"></i></span>
                    <span className="pull-right p-l p-r p-t-sm p-b-sm cursor"
                          onClick={this.sendMonth.bind(this, this.props.data.parent_this)}>
                        <span className="btn btn-sm">确定</span>
                    </span>
                </div>
                {
                    this.getYear(this.state.tlist).map((item, index) => {
                        return (
                            <div key={index} className="m-b">
                                <h6 className="title">{item}</h6>
                                <div className="clearfix calendar-wrapper">
                                    {
                                        this.state.tlist.map((sub_item, sub_index) => {
                                            return (
                                                sub_item.indexOf(item) >= 0
                                                    ? <span key={sub_index}
                                                            className={`cursor calendar ${this.isBackSelected.call(this, sub_item)}`}
                                                            onClick={this.selectBack.bind(this, sub_item)}
                                                >
                                                       {sub_item.substring(5)}
                                                   </span>
                                                    : ''
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )

                    })
                }
                <div className="footer pos-a full-w p-a b-t shadow-top" style={{bottom: 0, left: 0}}>
                    <span>已选{this.state.temp_selected.length}个月</span>
                    <span className="pull-right cursor" onClick={this.clearAll.bind(this)}>
                        <i className="icon_transh v-m dark m-r-xs"></i>
                        清空
                    </span>
                </div>
            </div>
        )
    }

    sendMonth(parent_this) {
        if (this.state.temp_selected.length > 0) {
            postData(this.billManageUrls.saveBujiao(),{
                op_month: parent_this.state.op_month,
                yg_id: parent_this.state.yg_id,
                type: parent_this.state.type,
                start: this.state.temp_selected[0],
                end: this.state.temp_selected[this.state.temp_selected.length - 1]
            })
                .then(res => {
                    parent_this.props.history.push('/Bill/Bujiao');
                })
        }else {
            this.clearAll()
                .then(res => {
                    parent_this.props.history.push('/Bill/Bujiao');
                });
        }
    }

    // 得到可补缴年份
    getYear(arr) {
        let temp = [];
        arr.forEach((item) => {
            if (temp.indexOf(item.substring(0, 4)) < 0) {
                temp.push(item.substring(0, 4));
            }
        });
        return temp;
    }

    //是否已选补缴月
    isBackSelected(item) {
        let index = this.state.temp_selected.indexOf(item);
        if (index >= 0) {
            let str = 'active'
            if (index === 0) {
                str += ' first'
            }
            if (index === this.state.temp_selected.length - 1) {
                str += ' last'
            }
            return str
        } else {
            return ''
        }
    }

    selectBack(item) {
        const index = this.state.temp_selected.indexOf(item);
        if (this.state.temp_selected.length >= 2 || this.state.temp_selected.length === 0) {
            //如临时选择区间已存在连续区间或无选区，则清空选择区间，重新选择起始点
            this.setState({
                temp_selected: [item]
            });
        } else {
            //选择区间有一个值，判断为起点或终点，存入汇缴区间
            if (index >= 0) {
                // 已是选中状态
                this.setState({
                    temp_selected: []
                });
            } else {
                const select_index = this.state.tlist.indexOf(this.state.temp_selected[0]);
                const select_index_2 = this.state.tlist.indexOf(item);
                const arr = this.state.tlist.filter((item, index) => {
                    return select_index > select_index_2 ? (index <= select_index && index >= select_index_2) : (index >= select_index && index <= select_index_2)
                });
                this.setState({
                    temp_selected: arr
                });
            }
        }

    }

    clearAll() {
        return getData(this.billManageUrls.deleteBujiao(), {
            yg_id: this.props.data.yg_id,
            op_month: this.props.data.op_month,
            type: this.props.data.type
        })
            .then(res => {
                this.setState({
                    temp_selected: []
                })
            })
    }
}