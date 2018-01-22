import React from 'react'
import {Link, Switch, Route} from 'react-router-dom'
import {SettingsUrls} from '../../../service/settings/settingsUrl'
import {getData} from '../../../fetch/httpRequest'

import {AddressEdit} from './AddressEdit/index'


class AddressIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
        const setting_urls = new SettingsUrls();
        this.state = {
            setting_urls: setting_urls,
            address_data: [],
        }
        this.init = true;
        document.title = '邮寄地址';
    }

    render() {
        return (
            <div style={{paddingTop: '.5rem'}}>
                <div className="p-a bg-white b-b shadow-bottom pos-f full-w" style={{top: 0, left: 0, zIndex: 2}}>
                    <span className="cursor" onClick={() => {
                        this.props.history.replace("/Index")
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <Link className="pull-right" to='/Settings/Address/Add'><i className="icon_plus"></i>添加新邮寄地址</Link>
                </div>

                {
                    this.state.address_data.length === 0 && !this.init
                        ? <div className="p-a t-c">
                        <img src="/src/assets/image/none.svg" alt=""/>
                    </div>
                        : <div>
                        {
                            this.state.address_data.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <h6 className="title">邮寄地址{index + 1}
                                            <span className={`pull-right ${item.is_default == 0 ? 'hide' : ''}`}><i
                                                className="icon_complete green v-m m-r-xs t-sm"></i><span
                                                className="v-m">默认</span></span>
                                        </h6>
                                        <div className="bg-white b-b b-t">
                                            <ul className="detail b-b">
                                                <li>
                                                    <span>收件人</span>
                                                    <div className="pull-right">
                                                        <span
                                                            className={`grey ${this.state.is_edit === true ? 'hide' : ''}`}>{item.contact}</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <span>联系电话</span>
                                                    <div className="pull-right">
                                                        <span
                                                            className={`grey ${this.state.is_edit === true ? 'hide' : ''}`}>{item.mobile}</span>
                                                    </div>
                                                </li>
                                                <li className="clearfix">
                                                    <span>地址</span>
                                                    <div className="pull-right">
                                                <span
                                                    className={`grey w-200  t-r ${this.state.is_edit === true ? 'hide' : 'd-ib'}`}
                                                    style={{}}>{item.province_name}{item.city_name}{item.district_name}{item.address}</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <span>邮编</span>
                                                    <div className="pull-right">
                                                        <span
                                                            className={`grey w-200 ellipsis t-r ${this.state.is_edit === true ? 'hide' : ''}`}>{item.post_code}</span>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="p-a t-c">
                                                <Link
                                                    to={{
                                                        pathname: `/Settings/Address/Edit`,
                                                        state: item
                                                    }}><i
                                                    className="icon_edit_simple grey v-m m-r-xs t-sm"></i>编辑</Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        )
    }

    componentDidMount() {
        getData(this.state.setting_urls.getHrAddress())
            .then(res => {
                this.init = false;
                this.setState({
                    address_data: res.data
                })
            })
    }

}
export class Address extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/Settings/Address" exact component={AddressIndex}/>
                <Route path="/Settings/Address/Edit" exact component={AddressEdit}/>
                <Route path="/Settings/Address/Add" exact component={AddressEdit}/>
            </Switch>
        )

    }
}