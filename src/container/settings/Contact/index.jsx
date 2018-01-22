import React from 'react';
import {Link, Switch, Route} from 'react-router-dom'
import {getData} from '../../../fetch/httpRequest'
import {SettingsUrls} from '../../../service/settings/settingsUrl'
import {ContactEdit} from './ContactEdit/index'

class ContactIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
        const settings_urls = new SettingsUrls();
        this.state = {
            contact: {},
            settings_urls: settings_urls
        }
        document.title = '联系人'
    }

    render() {
        return (
            // 联系人
            <div style={{paddingTop:'.6rem'}}>
                <div className="bg-white p-a b-b m-b-sm shadow-bottom pos-f full-w" style={{left:0,top:0,zIndex:2}}>
                    <span  className="cursor" onClick={() => {this.props.history.replace('/Index')}}>
                        <i className="icon_left_triangle grey v-m"></i>返回</span>
                    <Link className="pull-right" to={{
                        pathname: '/Settings/Contact/Edit',
                        state: this.state.contact
                    }}><i className="icon_edit_simple grey v-m m-r-xs t-sm"></i>变更联系人</Link>
                </div>
                <div className="bg-white">
                    <ul className="detail b-t b-b">
                        <li>
                            <span>姓名</span>
                            <div className="grey t-sm pull-right">
                                {this.state.contact.contact}
                            </div>
                        </li>
                        <li>
                            <span>岗位</span>
                            <div className="grey t-sm pull-right">
                                {this.state.contact.position || '暂无'}
                            </div>
                        </li>
                        <li>
                            <span>称谓</span>
                            <div className="grey t-sm pull-right">
                                {this.state.contact.gender == 2 ? '女士' : ( this.state.contact.gender == 1 ? '先生' : '暂无')}
                            </div>
                        </li>
                        <li>
                            <span>电子邮箱</span>
                            <div className="grey t-sm pull-right">
                                {this.state.contact.email || '暂无'}
                            </div>
                        </li>
                        <li>
                            <span>手机</span>
                            <div className="grey t-sm pull-right">
                                {this.state.contact.mobile || '暂无'}
                            </div>
                        </li>
                        <li>
                            <span>固定电话</span>
                            <div className="grey t-sm pull-right">
                                {this.state.contact.phone || '暂无'}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    componentDidMount() {
        getData(this.state.settings_urls.getContact())
            .then((res) => {
                this.setState({
                    contact: res.data
                })
            })
    }
}
export class Contact extends React.Component {
    render() {
        return (
            <Switch>
                    <Route path="/Settings/Contact" exact component={ContactIndex}/>
                    <Route path="/Settings/Contact/Edit" exact component={ContactEdit}/>
            </Switch>
        )

    }
}