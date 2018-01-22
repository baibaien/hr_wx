import React from 'react'
import {Link} from 'react-router-dom'

export class IndexRemind extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    // 特殊日期提醒
    render() {
        return (
            <div>
                {
                    this.props.data.lately_birth_staff_total === 0 && this.props.data.lately_entry_a_year_staff_total === 0 && this.props.data.formal_staff_total === 0
                        ? ''
                        : <div>
                        <h6 className="title">特殊日期提醒</h6>
                        <div className="bg-white b-t b-b">
                            <ul className="p-l list">
                                {
                                    this.props.data.lately_birth_staff_total === 0
                                        ? ''
                                        : <li className="">
                                        <Link to="/Staffs/EventRemind/1" className="d-b">
                                        <span className="p-r-sm p-t p-b pull-left"><i
                                            className="icon_birthday v-m"></i></span>
                                            <div className="b-b p-t p-b m-l p-r">近期员工生日<span
                                                className="pull-right"><span
                                                className="label v-m">{this.props.data.lately_birth_staff_total}</span><i
                                                className="icon_right_triangle v-m"></i></span>
                                            </div>
                                        </Link>
                                    </li>
                                }
                                {
                                    this.props.data.lately_entry_a_year_staff_total === 0
                                        ? ''
                                        : <li className="">
                                        <Link to="/Staffs/EventRemind/2">
                                        <span className="p-r-sm p-t p-b pull-left"><i
                                            className="icon_anniversary v-m"></i></span>
                                            <div className="b-b p-t p-b m-l p-r">近期员工入职周年<span
                                                className="pull-right"><span
                                                className="label v-m">{this.props.data.lately_entry_a_year_staff_total}</span><i
                                                className="icon_right_triangle v-m"></i></span>
                                            </div>
                                        </Link>
                                    </li>
                                }
                                {
                                    this.props.data.formal_staff_total === 0
                                        ? ''
                                        : <li className="p-r">
                                        <Link to="/Staffs/EventRemind/3">
                                        <span className=" p-r-sm p-t p-b pull-left"><i
                                            className="icon_user_confirm v-m"></i></span>
                                            <div className="b-b p-t p-b m-l"> 预定本月转正员工<span
                                                className="pull-right"><span
                                                className="label v-m">{this.props.data.formal_staff_total}</span><i
                                                className="icon_right_triangle v-m"></i></span>
                                            </div>
                                        </Link>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
