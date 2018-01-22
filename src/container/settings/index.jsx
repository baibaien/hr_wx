import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {SignInfo} from './SignInfo/index'
import {FapiaoIndex} from './Fapiao/index'
import {Contact} from './Contact/index'
import {Address} from './Address/index'
import {SettingsUrls} from '../../service/settings/settingsUrl'

export class Settings extends React.Component {
    constructor(props, context) {
        super(props, context)
        const settings_urls = new SettingsUrls();
        this.state = {
            settings_urls: settings_urls,
            fapiao: {}
        }
    }

    render() {
        return (
            <Switch>
                <Route path='/Settings/SignInfo' component={SignInfo}/>
                <Route path='/Settings/Fapiao'  component={FapiaoIndex}/>
                <Route path='/Settings/Contact' component={Contact}/>
                <Route path='/Settings/Address' component={Address}/>
            </Switch>
        )
    }

    componentDidMount() {

    }
}