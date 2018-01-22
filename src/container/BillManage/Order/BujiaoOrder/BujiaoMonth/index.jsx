import React from 'react'
import {BillManageUrls} from '../../../../../service/billManageApi/billManageUrl'
import {getData, postData} from '../../../../../fetch/httpRequest'
import {CalendarMonth} from '../../../../../components/calendar/index'



export class BujiaoMonth extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.state = {
            tlist: this.props.location.state.tlist,
            back_month: this.props.location.state.back_month,
            op_month: this.props.location.state.op_month,
            yg_id: this.props.location.state.yg_id,
            type: this.props.location.state.type,
        };
    }

    render() {
        return (
            <CalendarMonth data={{
                tlist: this.state.tlist,
                back_month: this.state.back_month,
                parent_this: this,
                type: this.state.type,
                yg_id: this.state.yg_id,
                op_month: this.state.op_month
            }}
            onCancel={this.cancelSend}/>
        )
    }

    cancelSend() {
        this.props.history.goBack();
    }
}