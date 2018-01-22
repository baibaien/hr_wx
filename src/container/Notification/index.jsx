import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {NotDetail} from './NotDetail/index'
import {NotIndex} from './NotIndex/index'

export class Notification extends React.Component {
    constructor(props, context) {
        super(props, context);

    }

    render() {
        return (
            <Switch>
                <Route path='/Notice' exact component={NotIndex}/>
                <Route path='/Notice/Detail/:id' exact component={NotDetail}/>
            </Switch>
        )
    }
}