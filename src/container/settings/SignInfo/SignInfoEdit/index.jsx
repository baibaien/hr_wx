import React from 'react';
import {Link} from 'react-router-dom'
import {SettingsUrls} from '../../../../service/settings/settingsUrl'
import {CommonUrls} from '../../../../service/commonUrl'
import {getData, postData} from '../../../../fetch/httpRequest'
import {selectCity, selectDistrict} from '../../../../utils/city'
import {changeValue, submitValidate, createErrorPath} from '../../../../utils/form'


export class SignInfoEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.settingsUrls = new SettingsUrls();
        this.commonUrls = new CommonUrls();
        // 初始化校验
        this.validates = {
            company: [
                {
                    func_name: 'required',
                    arg: '请填写公司名称'
                }
            ],
            district: [
                {
                    func_name: 'required',
                    arg: '请填写城市'
                }
            ],
            addr: [
                {
                    func_name: 'required',
                    arg: '请填写地址'
                }
            ],
            postcode: [
                {
                    func_name: 'required',
                    arg: '请填写邮编'
                },
                {
                    func_name: 'postcodeValid',
                    arg: ''
                }
            ],
            com_sn: [
                {
                    func_name: 'required',
                    arg: '请填写营业执照号'
                }
            ]

        };
        this.send_data = ['company', 'com_sn', 'district', 'postcode', 'addr'];
        this.state = {
            sign_info: this.props.location.state,
            sign_info_err: {
                hr_office_addr: {}
            },
            cities: [],
            districts: [],
        }
    }

    render() {
        return (
            // 签约信息
            <div style={{paddingTop:'.5rem'}}>
                <form >
                    <div className="bg-white p-l p-r  b-b full-w pos-f" style={{left:0, top:0, zIndex:2, lineHeight: '.5rem'}}>
                        <span onClick={()=>{this.props.history.goBack()}}
                        className="p-r b-r d-ib cursor"><i className="icon_close"></i></span>
                        <button onClick={this.updateData.bind(this)}
                                type="button"
                                className={`btn btn-sm pull-right cursor m-t-sm`}>保存
                        </button>
                    </div>
                    <h6 className="title p-l p-r">账户主体</h6>
                    <div className="bg-white m-b-sm b-t b-b">
                        <ul className="detail">
                            <li className="clearfix">
                                <span>公司名称</span>
                                <div
                                    className={`grey t-sm pull-right  ` }>
                                    {this.state.sign_info.company}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="m-b-sm b-t b-b bg-white">
                        <ul className="detail">
                            <li>
                                <span>省</span>
                                <div
                                    className={`grey t-sm pull-right w-200 t-r`}>
                                    <select value={this.state.sign_info.hr_office_addr.province}
                                            onChange={this._selectCity.bind(this)}
                                            className="full-w t-r">
                                        <option value="">请选择</option>
                                        {
                                            this.state.sign_info.province.map((item, index) => {
                                                return (
                                                    <option value={item.id} key={index}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </li>
                            <li>
                                <span>市</span>
                                <div
                                    className={`  grey t-sm pull-right w-200 t-r`}>
                                    <select id=""
                                            value={this.state.sign_info.hr_office_addr.city}
                                            onChange={this._selectDistrict.bind(this)}
                                            className="full-w t-r">
                                        <option value="">请选择</option>
                                        {
                                            this.state.cities.map((item, index) => {
                                                return (
                                                    <option value={item.id} key={index}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </li>
                            <li>
                                <span>区</span>
                                <div
                                    className={`grey t-sm pull-right w-200 t-r`}>
                                    <select name="district" className="full-w t-r"
                                            value={this.state.sign_info.hr_office_addr.district}
                                            onChange={changeValue.bind(this,
                                                ['sign_info', 'hr_office_addr', 'district'],
                                                this.validates.district)
                                            }>
                                        <option value="">请选择</option>
                                        {
                                            this.state.districts.map((item, index) => {
                                                return (
                                                    <option value={item.id} key={index}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <p className={`error t-sm t-r`}>{this.state.sign_info_err['hr_office_addr'][`district`]}</p>
                                </div>
                            </li>
                            <li>
                                <span>详细地址</span>
                                <div
                                    className={`grey t-sm pull-right w-200 t-r`}>
                                    <input type="text"
                                           name="addr"
                                           value={this.state.sign_info.hr_office_addr.addr}
                                           placeholder="请输入"
                                           className="t-r"
                                           onChange={changeValue.bind(this,
                                               ['sign_info', 'hr_office_addr', 'addr'],
                                               this.validates.addr
                                           )
                                           }/>
                                    <p className={`error t-sm t-r`}>{this.state.sign_info_err['hr_office_addr']['addr']}</p>
                                </div>
                            </li>
                            <li>
                                <span>邮政编码</span>
                                <div
                                    className={`grey t-sm pull-right w-200 t-r`}>
                                    <input type="text"
                                           name="addr"
                                           value={this.state.sign_info.hr_office_addr.postcode}
                                           placeholder="请输入邮编"
                                           className="t-r"
                                           onChange={changeValue.bind(this,
                                               ['sign_info', 'hr_office_addr', 'postcode'],
                                               this.validates.postcode)
                                           }/>
                                    <p className={`error t-sm t-r`}>{this.state.sign_info_err['hr_office_addr'][`postcode`]}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white b-t b-b">
                        <ul className="detail">
                            <li>
                                <span>营业执照号</span>
                                <div className={`grey t-sm pull-right  `}>
                                    <input type="text" name="com_sn"
                                           value={this.state.sign_info.com_sn || ''}
                                           placeholder="请输入"
                                           className="t-r"
                                           onChange={changeValue.bind(this,
                                               ['sign_info', 'com_sn'],
                                               this.validates.com_sn
                                           )}
                                    />
                                    <p className={`error t-sm t-r`}>{this.state.sign_info_err[`com_sn`]}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </form>
            </div >
        )
    }

    componentDidMount() {
        this.state.sign_info.hr_office_addr.province
            ? getData(this.commonUrls.getCities(this.state.sign_info.hr_office_addr.province))
            .then((res) => {
                    this.setState({
                        cities: res.data
                    })
                }
            )
            .catch(err => {
                console.log(err)
            })
            : null;
        this.state.sign_info.hr_office_addr.city
            ? getData(this.commonUrls.getDistricts(this.state.sign_info.hr_office_addr.city))
            .then((res) => {
                    this.setState({
                        districts: res.data
                    })
                }
            )
            : null
    }

    _selectCity(event) {
        changeValue.call(this, ['sign_info', 'hr_office_addr', 'province'], [], event);
        if (event.target.value !== '') {
            selectCity.call(this, this.state.sign_info.hr_office_addr.province);
        } else {
            this.setState({
                cities: [],
                districts: []
            })
        }
    }

    _selectDistrict(event) {
        changeValue.call(this, ['sign_info', 'hr_office_addr', 'city'], [], event);
        if (event.target.value !== '') {
            selectDistrict.call(this, this.state.sign_info.hr_office_addr.city);
        }else {
            this.setState({
                districts: []
            })
        }
    }

    updateData(event) {
        let submit_data = {
            hr_office_addr: {}
        };
        this.send_data.map((item, index) => {
            if (item === 'company' || item === 'com_sn') {
                submit_data[item] = this.state.sign_info[item];
                submitValidate.call(this, 'sign_info', ['sign_info', item], this.validates[item], submit_data[item]);
            } else {
                submit_data['hr_office_addr'][item] = this.state.sign_info['hr_office_addr'][item];
                submitValidate.call(this, 'sign_info', ['sign_info', 'hr_office_addr', item], this.validates[item], submit_data['hr_office_addr'][item])
            }

        });
        if (JSON.stringify(this.state.sign_info_err.hr_office_addr) === '{}' && !this.state.sign_info_err.com_sn && !this.state.sign_info_err.company) {
            postData(this.settingsUrls.updateSignInfo(), submit_data)
                .then((res) => {
                    this.props.history.replace('/Settings/SignInfo')
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}

