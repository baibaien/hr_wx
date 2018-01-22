import React from 'react';
import {SettingsUrls} from '../../../../service/settings/settingsUrl'
import {CommonUrls} from '../../../../service/commonUrl'
import {getData, postData} from '../../../../fetch/httpRequest'
import {selectProvince, selectCity, selectDistrict} from '../../../../utils/city'
import {changeValue, submitValidate} from '../../../../utils/form'


export class AddressEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        const address = this.props.location.state ? this.props.location.state : {
            contact: '',
            mobile: '',
            district: '',
            address: '',
            post_code: '',
            is_default: 0,
        };
        const id = this.props.match.params.id;
        this.settingsUrls = new SettingsUrls();
        this.commonUrls = new CommonUrls();
        // 初始化校验
        this.validates = {
            contact: [
                {
                    func_name: 'required',
                    arg: '请填写收件人信息'
                }
            ],
            mobile: [
                {
                    func_name: 'mobileValid'
                },
                {
                    func_name: 'required',
                    arg: '请填写正确的联系电话'
                }
            ],
            district: [
                {
                    func_name: 'required',
                    arg: '请选择地区'
                }
            ],
            address: [
                {
                    func_name: 'required',
                    arg: '请填写详细地址'
                }
            ],
            post_code: [
                {
                    func_name: 'required',
                    arg: '邮编必填'
                },
                {
                    func_name: 'postcodeValid',
                    arg: ''
                }
            ],

        };
        this.send_data = ['contact', 'mobile', 'district', 'post_code', 'address'];
        this.state = {
            address: address,
            id: id,
            address_err: {},
            provinces: [],
            cities: [],
            districts: [],
        }
    }

    render() {
        return (
            // 邮寄地址
            <div style={{paddingTop: '.6rem'}}>
                <form >
                    <div className="bg-white p-l p-r  b-b full-w pos-f"
                         style={{left: 0, top: 0, zIndex: 2, lineHeight: '.5rem'}}>
                        <span onClick={() => {
                            this.props.history.goBack()
                        }}
                              className="p-r b-r d-ib cursor"><i className="icon_close"></i></span>
                        <button onClick={this.updateData.bind(this)}
                                type="button"
                                className={`btn btn-sm pull-right cursor m-t-sm`}>保存
                        </button>
                    </div>
                    <div className="bg-white m-b-sm b-t b-b">
                        <ul className="detail">
                            <li>
                                <span>收件人</span>
                                <div className="pull-right">
                                    <input type="text" className={`t-r`} name="contact" placeholder="填写收件人姓名"
                                           value={this.state.address.contact}
                                           onChange={changeValue.bind(this,
                                               ['address', 'contact'],
                                               this.validates.contact)}/>
                                    <p className="t-sm error t-r">{this.state.address_err.contact}</p>
                                </div>
                            </li>
                            <li>
                                <span>联系电话</span>
                                <div className="pull-right">
                                    <input type="number" className={`t-r`} name="mobile" placeholder="填写联系电话"
                                           value={this.state.address.mobile}
                                           onChange={changeValue.bind(this, ['address', 'mobile'], this.validates.mobile)}/>
                                    <p className="t-sm error t-r">{this.state.address_err.mobile}</p>
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
                                    <select value={this.state.address.province}
                                            onChange={this._selectCity.bind(this)}
                                            className="full-w t-r">
                                        <option value="">请选择</option>
                                        {
                                            this.state.provinces.map((item, index) => {
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
                                            value={this.state.address.city}
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
                                            value={this.state.address.district}
                                            onChange={changeValue.bind(this,
                                                ['address', 'district'],
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
                                    <p className={`error t-sm t-r`}>{this.state.address_err.district}</p>
                                </div>
                            </li>
                            <li>
                                <span>详细地址</span>
                                <div
                                    className={`grey t-sm pull-right w-200 t-r`}>
                                    <input type="text"
                                           name="address"
                                           value={this.state.address.address}
                                           placeholder="请输入"
                                           className="t-r"
                                           onChange={changeValue.bind(this,
                                               ['address', 'address'],
                                               this.validates.address
                                           )
                                           }/>
                                    <p className={`error t-sm t-r`}>{this.state.address_err.address}</p>
                                </div>
                            </li>
                            <li>
                                <span>邮政编码</span>
                                <div
                                    className={`grey t-sm pull-right w-200 t-r`}>
                                    <input type="number"
                                           name="addr"
                                           value={this.state.address.post_code}
                                           placeholder="请输入邮编"
                                           className="t-r"
                                           onChange={changeValue.bind(this,
                                               ['address', 'post_code'],
                                               this.validates.post_code)
                                           }/>
                                    <p className={`error t-sm t-r`}>{this.state.address_err.post_code}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white p-a b-t b-b">
                        <label className="ui-check d-b full-w">
                            <span className="t v-m">设置为默认地址</span>
                            <input type="checkbox"
                                   name="addr"
                                   value={this.state.address.is_default}
                                   onChange={this.changeCheckbox.bind(this)}
                                   checked={this.state.address.is_default}/>
                            <i className="icon_ui pull-right"></i>
                        </label>
                    </div>
                </form>
            </div >
        )
    }

    componentDidMount() {
        selectProvince.call(this)
            .then(res => {
                this.state.address.province
                    ? selectCity.call(this, this.state.address.province)
                    .then(res => {
                        selectDistrict.call(this, this.state.address.city)
                    })
                    : null
            })
    }

    _selectCity(event) {
        changeValue.call(this, ['address', 'province'], [], event);
        selectCity.call(this, this.state.address.province);
    }

    _selectDistrict(event) {
        changeValue.call(this, ['address', 'city'], [], event);
        selectDistrict.call(this, this.state.address.city);
    }

    updateData() {
        let submit_data = {};
        this.send_data.map((item, index) => {
            submit_data[item] = this.state.address[item];
            submitValidate.call(this, 'address', [item], this.validates[item], submit_data[item]);
            submit_data['is_default'] = this.state.address['is_default'] ? 1 : 0;
        });
        if (JSON.stringify(this.state.address_err) === '{}') {
            if (this.state.address.id) {
                //编辑
                postData(this.settingsUrls.updateAddress(this.state.address.id), submit_data)
                    .then((res) => {
                        this.props.history.replace('/Settings/Address')
                    })
            } else {
                // 添加
                postData(this.settingsUrls.addAddress(), submit_data)
                    .then((res) => {
                        this.props.history.replace('/Settings/Address')
                    })
            }
        }
    }

    changeCheckbox() {
        let address = this.state.address;
        let is_default = !this.state.address.is_default;
        address = Object.assign(this.state.address, {
            is_default: is_default
        });
        this.setState({
            address: address
        })
    }
}

