import React from 'react';
import {Switch, Route} from 'react-router-dom'
import {StaffDetailBasic} from './Subpage/basic'
import {StaffDetailContract} from './Subpage/contract'
import {StaffDetailFamily} from './Subpage/family'
import {StaffDetailHoliday} from './Subpage/holiday'
import {StaffDetailPhotos} from './Subpage/photos'
import {StaffDetailSocial} from './Subpage/socialPay'
import {StaffDetailWork} from './Subpage/Work'
import {StaffDetailIndex} from './Subpage/index'
import {PhotoDetail} from './Subpage/photoDetail'
export class StaffDetail extends React.Component {
    constructor(props, context) {
        super(props, context);

    }
    render() {
        return (
            // 员工详情
            <Switch>
                    <Route path="/Staffs/Detail/:yg_id" exact component={StaffDetailIndex}/>
                    <Route path="/Staffs/Detail/:yg_id/Basic" exact component={StaffDetailBasic}/>
                    <Route path="/Staffs/Detail/:yg_id/Contract" exact component={StaffDetailContract}/>
                    <Route path="/Staffs/Detail/:yg_id/Family" exact component={StaffDetailFamily}/>
                    <Route path="/Staffs/Detail/:yg_id/Photos" exact component={StaffDetailPhotos}/>
                    <Route path="/Staffs/Detail/:yg_id/Social" exact component={StaffDetailSocial}/>
                    <Route path="/Staffs/Detail/:yg_id/Work" exact component={StaffDetailWork}/>
                    <Route path="/Staffs/Detail/:yg_id/Holiday" exact component={StaffDetailHoliday}/>
                    <Route path="/Staffs/Detail/:yg_id/Photos/type/:type" exact component={PhotoDetail}/>
            </Switch>
        )
    }
}