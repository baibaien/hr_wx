import React from 'react';
import {Switch, Route} from 'react-router-dom'
import {CompleteMsgIndex} from './Subpage/index'
import {StepFirst} from './Steps/Step1'
import {StepSecond} from './Steps/Step2'
import {Hospitals} from './Hospitals/index'
import {PicDetail} from './Steps/PicDetail/index'


export class CompleteStaffMsg extends React.Component {
    constructor(props) {
        super(props);
        document.title = '补全员工信息'
    }
    render() {
        return (
            // 补全员工信息
            <Switch>
                    <Route path="/CompleteStaffMsg" exact component={CompleteMsgIndex}/>
                    <Route path="/CompleteStaffMsg/Step1" exact component={StepFirst}/>
                    <Route path="/CompleteStaffMsg/Step2" exact component={StepSecond}/>
                    <Route path="/CompleteStaffMsg/Hospitals" exact component={Hospitals}/>
                    <Route path="/CompleteStaffMsg/PicDetail" exact component={PicDetail}/>
            </Switch>

        )
    }
}