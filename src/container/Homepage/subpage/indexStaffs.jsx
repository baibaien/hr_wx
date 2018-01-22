import React from 'react'
import {Link} from 'react-router-dom'

export class IndexStaffs extends React.Component {
    constructor(props, context) {
        super(props, context)
    }

    render() {
        return (
            <div>
                <h6 className="title">员工管理</h6>
                <div className="bg-white b-t b-b">
                    <ul className="p-l list">
                        <li className="">
                            <Link to="/Staffs">
                    <span className="p-r-sm p-t p-b pull-left"><i
                        className="icon_people v-m"></i></span>
                                <div className="b-b p-t p-b m-l p-r">
                                    员工名录
                                    <span className="pull-right">
                    {/*<span className="label v-m">2</span>*/}
                                        <i className="icon_right_triangle v-m"></i>
                    </span>
                                </div>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={{
                                pathname: "/Bill/Bujiao",
                                state: this.props.back_month
                            }}>
                    <span className="p-r-sm p-t p-b pull-left"><i
                        className="icon_captcha v-m"></i></span>
                                <div className="b-b p-t p-b m-l p-r">为员工生成补缴账单<span
                                    className="pull-right"><i className="icon_right_triangle v-m"></i></span>
                                </div>
                            </Link>
                        </li>
                        <li className="">
                            <Link to="/Bill/SocialState">
                    <span className="p-r-sm p-t p-b pull-left"><i
                        className="icon_list v-m"></i></span>
                                <div className="b-b p-t p-b m-l p-r">缴纳进度
                                    <span className="pull-right"><i className="icon_right_triangle v-m"></i></span>
                                </div>
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        )
    }
}
