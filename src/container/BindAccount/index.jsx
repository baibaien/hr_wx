import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {MobileBind} from "./mobileBind"
import {ReActivate} from "./reActivate"
import {Unbind} from "./unBind"
import {Person} from "./person"
import {Sign} from "./sign"
import {YgSelf} from './ygSelf'

export class BindIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Switch>
                <Route path="/Bind/" exact component={MobileBind}/>
                <Route path="/Bind/ReActive" exact component={ReActivate}/>
                <Route path="/Bind/Unbind" exact component={Unbind}/>
                <Route path="/Bind/Person" exact component={Person}/>
                <Route path="/Bind/Sign" exact component={Sign}/>
                <Route path="/Bind/YgSelf" exact component={YgSelf}/>
            </Switch>
        )
    }
}