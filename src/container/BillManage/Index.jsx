import React from 'react';
import {Route, Switch} from 'react-router-dom'
import {PaidBill} from './PaidBill/index'
import {UnpaidBill} from './UnpaidBill/index'
import {BillVoucher} from './BillDetail/Voucher/index'
import {OrderDetail} from './Order/OrderDetail/index'
import {BillDetail} from './BillDetail/index'
import {UnBillOrder} from './UnBillOrder/index'
import {UnFapiaoBill} from './UnFapiaoBill/index'
import {BillProcess} from "./BillProcess/index"
import {Pay} from "./Pay/index"
import {PayPics} from "./Pay/Pics/index"
import {BillSearch} from './BillSearch/index'
import {GzOrder} from './Order/GzOrder/index'
import {SocialOrder} from './Order/SocialOrder/index'
import {SalaryAdjust} from './Order/GzOrder/SalaryAdjust/index'
import {Attendance} from './Order/GzOrder/Attendance/index'
import {GzDetail} from './Order/GzOrder/GzDetail/index'
import {BujiaoOrder} from './Order/BujiaoOrder/index'
import {BujiaoMonth} from './Order/BujiaoOrder/BujiaoMonth/index'
import {FapiaoDetail} from './BillFapiao/index'
import {SocialState} from './SocialState/index'
import {SocialStateDetail} from './SocialState/Detail/index'
import {SocialDetail} from './Order/SocialOrder/SocialDetail/index'

export class BillIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            // 订单
            <Switch>
                <Route path='/Bill' exact component={PaidBill}/>
                <Route path='/Bill/UnpaidBill' exact component={UnpaidBill}/>
                <Route path='/Bill/UnBillOrder' exact component={UnBillOrder}/>
                <Route path='/Bill/Detail/:order_id' exact component={BillDetail}/>
                <Route path='/Bill/OrderDetail/:order_id' exact component={OrderDetail}/>
                <Route path='/Bill/Detail/:order_id/Voucher' exact component={BillVoucher}/>
                <Route path='/Bill/Process/:order_id' exact component={BillProcess}/>
                <Route path='/Bill/UnFapiaoBill' exact component={UnFapiaoBill}/>
                <Route path='/Bill/Pay' exact component={Pay}/>
                <Route path='/Bill/Pay/PayPics' exact component={PayPics}/>
                <Route path='/Bill/Search' exact component={BillSearch}/>
                <Route path="/Bill/SocialOrder/:op_month" exact component={SocialOrder}/>
                <Route path="/Bill/Social/Detail" exact component={SocialDetail}/>
                <Route path='/Bill/GzOrder/:pay_month' exact component={GzOrder}/>
                <Route path='/Bill/GzOrder/:pay_month/Detail/:id' exact component={GzDetail}/>
                <Route path='/Bill/Attendance' exact component={Attendance}/>
                <Route path='/Bill/SalaryDown' exact component={SalaryAdjust}/>
                <Route path='/Bill/SalaryUp' exact component={SalaryAdjust}/>
                <Route path='/Bill/Bujiao' exact component={BujiaoOrder}/>
                <Route path='/Bill/Bujiao/Month' exact component={BujiaoMonth}/>
                <Route path='/Bill/FapiaoDetail' exact component={FapiaoDetail}/>
                <Route path='/Bill/SocialState' exact component={SocialState}/>
                <Route path='/Bill/SocialState/Detail' exact component={SocialStateDetail}/>
            </Switch>
        )
    }
}