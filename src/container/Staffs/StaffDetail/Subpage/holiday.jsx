import React from 'react';
import {dateTransformToDay} from '../../../../utils/dateTransform'

export class StaffDetailHoliday extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            holiday: this.props.location.state
        }
    }

    render() {
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm shadow-bottom">
                    <span className="cursor" onClick={() => {this.props.history.goBack()}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className="bg-white b-t b-b">
                    <ul className="detail">
                        <li>
                            <span className="grey">带薪年假</span>
                            <span className="pull-right">{dateTransformToDay(this.state.holiday.annual_leavel_length)}</span>
                        </li>
                        <li>
                            <span className="grey">调休</span>
                            <span className="pull-right">{dateTransformToDay(this.state.holiday.tune_off_leave_length)}</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}