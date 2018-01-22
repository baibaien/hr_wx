import React from 'react';
import {Link} from 'react-router-dom'
import {getData} from '../../../fetch/httpRequest'
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {dateTransform, dateTransformToMonth} from "../../../utils/dateTransform"

export class BillOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="bg-white b-t b-b">
                <ul className="detail">
                    {
                        this.props.data.map((item, index) => {
                            return (
                                <li key={index}>
                                    <div className='clearfix'>
                                        <div className='d-ib'>
                                                <span className=" ellipsis" style={{width: '1.6rem'}}>
                                                {/*{dateTransformToMonth(item.op_month)}月*/}
                                                    {item.type_name}</span>
                                            {
                                                item.num > 0
                                                    ? <p className='grey t-sm'>{item.num}人</p>
                                                    : ''
                                            }
                                            <p className='grey t-sm'>生成于{dateTransform(item.create_time)}</p>
                                        </div>
                                        <div className='pull-right t-r p-r'>
                                                <span className="m-l-xs v-m pull-right"
                                                      style={{width: '.15rem', marginRight: '-.2rem'}}>
                                                    {
                                                        item.type <= 4 || item.type == 42
                                                            ? <Link to={{
                                                            pathname: `/Bill/OrderDetail/${item.id}`,
                                                            state: {
                                                                type: item.type,
                                                                city_name: item.city_name
                                                            }
                                                        }}>
                                                            <i className="icon_right_triangle v-m"></i>
                                                        </Link>
                                                            : ''
                                                    }
                                                </span>
                                            <span>{item.money}</span>
                                            {
                                                item.child.map((sub_item, sub_index) => {
                                                    return (
                                                        <p className='grey t-sm t-r' key={sub_index}>
                                                            +{sub_item.type_name} {sub_item.money}</p>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

    componentDidMount() {
    }

    showOrderDetail(id, type) {
        consol.eo
        if (type <= 4 || type === 42) {
            this.props.history.push({pathname: `/Bill/OrderDetail/${item.id}`, state: {type: type}})
        }
    }
}