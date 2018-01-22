import React from 'react'
import {Link} from 'react-router-dom'
import {getData, postData} from '../../../../fetch/httpRequest'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {CommonUrls} from '../../../../service/commonUrl'
import {getConfig} from '../../../../utils/wxConfig'
import {changeUnNecValue, changeValue, submitValidate} from "../../../../utils/form"
import {clearSessionItem, getSessionItem, setSessionItem} from '../../../../utils/sessionStorage'
import {showModal, cancelModal} from '../../../../utils/modal'
import {Bank} from "../Bank/index";
import {PicModal} from '../Modals/PicModal'

// 数据yg_id,医院，证件照，银行数据因需跳转页面存储于sessionStorage中
// 如提交数据成功，则跳转页面并将此数据清除
export class StepSecond extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && !getSessionItem('reload_step2')) { //判断iPhone|iPad|iPod|iOS
            window.location.reload();
        }
        setSessionItem('reload_step2', window.location.href.split('#')[0]);
        getConfig.call(this, encodeURIComponent(getSessionItem('reload_step2')));
        this.init = true;
        this.temp_session = ['img_urls', 'hospitals', 'select_bank', 'select_sub_bank', 'yg_id'];
        this.staffsUrls = new StaffsUrls();
        this.commonUrls = new CommonUrls();
        this.fail_msg = '';
        this.validates = {
            yg_bank_acc: [{
                func_name: 'cardValid',
            }],
            yg_hk_post: [{
                func_name: 'postcodeValid'
            }],
            yg_post: [{
                func_name: 'postcodeValid'
            }]
        };
        this.state = {
            cities: [],
            districts: [],
            provinces: [],
            address: {},
            bank: [],
            default_bank: [],
            default_sub_bank: [],
            sub_bank: false,
            bank_valid: '',
            upload: [],
            img_urls: [],
            example_url: '',
            default_upload: [],
            miss_info: {},
            show_title: [],
            origin_info: {},
            pic_type: -1,
            // hr_yg_hospital: hospitals,
            hr_yg_hospital: [],
            setting: {
                yg_nation: [],
                yg_xueli: []
            },
            social_status: 0,
            fund_status: 0,
            miss_info_err: {},
            show_bank: false,
            modal_name: '',
            modal_in: '',
            show_modal: ''
        };


        document.title = '补全员工信息'
    }

    render() {
        const img_style = {
            width: '.2rem',
            height: '.18rem'
        };
        const type_id = Object.keys(this.state.default_upload).map(item => this.state.default_upload[item].type_id);
        const default_upload = Object.keys(this.state.default_upload).map(item => this.state.default_upload[item]);
        const upload = Object.keys(this.state.upload).map(item => this.state.upload[item]);
        const real_length = this.state.show_title.hasOwnProperty('bank_code') ? Object.keys(this.state.show_title).length - 3 : Object.keys(this.state.show_title).length;
        let uni_validate = ['yg_bank_acc', 'bank_code', 'bank_sub_code'];
        let bank_valid = 0;
        uni_validate.forEach(item => {
            if (!this.state.miss_info[item]) {
                bank_valid++;
            }

        });
        return (
            <div className="full-h">
                {
                    this.state.show_bank
                        ? ''
                        : <div>
                        <div className="bg-white b-b p-l p-r p-t-sm p-b-sm">
                            <span className="d-ib m-t-xs v-m cursor"
                                  onClick={() => {
                                      clearSessionItem('reload_step2');
                                      this.props.history.replace({
                                          pathname: `/CompleteStaffMsg${this.props.location.state.is_show_status ? `/Step1` : ''}`,
                                          state: {
                                              fund_status: this.state.fund_status,
                                              social_status: this.state.social_status,
                                              yg_id: this.props.location.state.yg_id
                                          }
                                      })
                                  }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                            <span
                                className={`pull-right btn btn-sm ${Object.keys(this.state.show_title).length === 0 ? 'hide' : ''}`}
                                onClick={this.saveData.bind(this)}>
                        提交
                    </span>
                        </div>
                        {
                            Object.keys(this.state.show_title).length === 0 && this.state.default_upload.length === 0 && this.state.upload.length === 0 && !this.init
                                ? <p className="m-t-lg t-c grey">根据您的选择，目前暂无需要提供的信息请直接点击返回</p>
                                : ''
                        }
                        {
                            this.state.show_title.hasOwnProperty('bank_code')
                                ? <div>
                                <h6 className="title">工资卡
                                    <span
                                        className={bank_valid === 0 || bank_valid === 3 ? 'hide' : "error t-sm m-l-sm"}>{this.state.bank_valid}
                            </span>
                                </h6>
                                <div className="bg-white b-t b-b">
                                    <ul className="detail">
                                        <li >
                                            <span>卡号</span>
                                            <div className="pull-right">
                                                <input type="text"
                                                       name=""
                                                       value={this.state.miss_info.yg_bank_acc}
                                                       placeholder="输入卡号"
                                                       className="t-r"
                                                       onChange={changeValue.bind(this,
                                                           ['miss_info', 'yg_bank_acc'],
                                                           this.validates.yg_bank_acc
                                                       )}/>
                                                <p className="t-sm error t-r">{this.state.miss_info_err.yg_bank_acc}</p>
                                            </div>
                                        </li>
                                        <li >
                                            <span>开户行</span>
                                            <div className="pull-right t-r">
                                                {this.state.miss_info.bank_name}
                                                <span className="d-ib v-m" onClick={this.showBank.bind(this, false)}
                                                      style={{marginLeft: '.-1rem', width: '.1rem'}}><i
                                                    className="icon_right_triangle "> </i></span>
                                                <p className="t-sm error t-r" style={{marginTop: '-.05rem'}}>
                                                    {!this.state.miss_info.bank_code && this.state.sub_bank ? `尚未选择开户行！` : ''}
                                                </p>
                                            </div>
                                        </li>
                                        <li >
                                            <span>开户支行</span>
                                            <div className="pull-right">
                                        <span className="ellipsis v-t t-r" style={{width: '2rem'}}>
                                        {this.state.miss_info.bank_sub_name}
                                        </span>
                                                <span className="d-ib v-m" onClick={this.showBank.bind(this, true)}
                                                      style={{marginLeft: '.-1rem', width: '.1rem'}}><i
                                                    className="icon_right_triangle "> </i></span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                                : ''
                        }
                        {
                            real_length === 0
                                ? ''
                                : <div>
                                <h6 className="title">五险一金及其他信息</h6>
                                {
                                    this.state.show_title.hasOwnProperty('yg_nation') || this.state.show_title.hasOwnProperty('yg_xueli')
                                        ? <div className="bg-white b-t b-b m-b-sm">
                                        <ul className="detail">
                                            <li className={this.state.show_title.hasOwnProperty('yg_nation') ? '' : 'hide'}>
                                                <span>民族</span>
                                                <div className="pull-right">
                                                    <select name=""
                                                            value={this.state.miss_info.yg_nation}
                                                            className="t-r"
                                                            onChange={changeUnNecValue.bind(this,
                                                                ['miss_info', 'yg_nation']
                                                            )}>
                                                        <option value="">请选择</option>
                                                        {
                                                            this.state.setting.yg_nation.map((item, index) => {
                                                                return (
                                                                    <option key={index}
                                                                            value={item.id}>{item.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </li>
                                            <li className={this.state.show_title.hasOwnProperty('yg_xueli') ? '' : 'hide'}>
                                                <span>文化程度</span>
                                                <div className="pull-right">
                                                    <select name=""
                                                            value={this.state.miss_info.yg_xueli}
                                                            className="t-r"
                                                            onChange={changeUnNecValue.bind(this,
                                                                ['miss_info', 'yg_xueli']
                                                            )}>
                                                        <option value="">请选择</option>
                                                        {
                                                            this.state.setting.yg_xueli.map((item, index) => {
                                                                return (
                                                                    <option key={index}
                                                                            value={item.id}>{item.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                        : ''
                                }
                                {
                                    this.state.show_title.hasOwnProperty('yg_addr') || this.state.show_title.hasOwnProperty('yg_post')
                                        ? <div
                                        className=' bg-white m-b-sm'>
                                        <ul className="detail b-t b-b">
                                            <li className={this.state.show_title.hasOwnProperty('yg_addr') ? '' : 'hide'}>
                                                <span>住址</span>
                                                <div className="pull-right t-r">
                                                    <input type="text"
                                                           name=""
                                                           value={this.state.miss_info.yg_addr}
                                                           className="t-r"
                                                           placeholder="输入住址"
                                                           onChange={changeUnNecValue.bind(this,
                                                               ['miss_info', 'yg_addr']
                                                           )}/>
                                                </div>
                                            </li>
                                            <li className={this.state.show_title.hasOwnProperty('yg_post') ? '' : 'hide'}>
                                                <span>住址邮编</span>
                                                <div className="pull-right t-r">
                                                    <input type="text"
                                                           name=""
                                                           value={this.state.miss_info.yg_post}
                                                           className="t-r"
                                                           placeholder="输入户籍地邮编"
                                                           onChange={changeValue.bind(this,
                                                               ['miss_info', 'yg_post'],
                                                               this.validates.yg_post
                                                           )}/>
                                                    <p className="t-sm error  t-r">{this.state.miss_info_err.yg_post}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                        : ''
                                }
                                {
                                    this.state.show_title.hasOwnProperty('yg_hk_post') || this.state.show_title.hasOwnProperty('yg_hk_addr')
                                        ? <div
                                        className='m-b-sm bg-white b-t b-b'>
                                        <ul className="detail">
                                            <li className={this.state.show_title.hasOwnProperty('yg_hk_addr') ? '' : 'hide'}>
                                                <span>户籍详细地址</span>
                                                <div className="pull-right t-r">
                                                    <input type="text"
                                                           name=""
                                                           value={this.state.miss_info.yg_hk_addr}
                                                           className="t-r"
                                                           placeholder="输入户籍地址"
                                                           maxLength='30'
                                                           onChange={changeUnNecValue.bind(this,
                                                               ['miss_info', 'yg_hk_addr']
                                                           )}/>
                                                </div>
                                            </li>
                                            <li className={this.state.show_title.hasOwnProperty('yg_hk_post') ? '' : 'hide'}>
                                                <span>户籍所在地邮编</span>
                                                <div className="pull-right t-r">
                                                    <input type="text"
                                                           name=""
                                                           value={this.state.miss_info.yg_hk_post}
                                                           className="t-r"
                                                           placeholder="输入户籍地邮编"
                                                           onChange={changeValue.bind(this,
                                                               ['miss_info', 'yg_hk_post'],
                                                               this.validates.yg_hk_post
                                                           )}/>
                                                    <p className="t-sm error  t-r">{this.state.miss_info_err.yg_hk_post}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                        : ''
                                }
                                {
                                    this.state.show_title.hasOwnProperty('social_number') || this.state.show_title.hasOwnProperty('yg_social_acc') || this.state.show_title.hasOwnProperty('yg_fund_acc')
                                        ? <div className="m-t-sm bg-white b-t b-b">
                                        <ul className="detail">
                                            <li className={this.state.show_title.hasOwnProperty('social_number') || this.state.show_title.hasOwnProperty('yg_social_acc') ? 'bg-white' : 'hide'}>
                                                <span>社保账户</span>
                                                <div className="pull-right">
                                                    <input type="text"
                                                           name=""
                                                           value={this.state.miss_info.social_number}
                                                           className="t-r"
                                                           placeholder="社保账户"
                                                           onChange={changeUnNecValue.bind(this,
                                                               ['miss_info', 'social_number']
                                                           )}/>
                                                </div>
                                            </li>
                                            <li className={this.state.show_title.hasOwnProperty('yg_fund_acc') ? 'bg-white' : 'hide'}>
                                                <span>公积金账户</span>
                                                <div className="pull-right">
                                                    <input type="text"
                                                           name=""
                                                           value={this.state.miss_info.yg_fund_acc}
                                                           className="t-r"
                                                           placeholder="公积金账户"
                                                           onChange={changeUnNecValue.bind(this,
                                                               ['miss_info', 'yg_fund_acc']
                                                           )}/>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                        : ''
                                }
                                <div
                                    className={this.state.show_title.hasOwnProperty('hr_yg_hospital') ? 'm-t-sm bg-white b-t b-b p-a clearfix pos-r' : 'hide'}>
                                    <span className="pull-left">定点医疗机构</span>
                                    <div className="p-r-lg pos-r" style={{marginLeft: '1rem',minHeight: '.2rem'}}>
                                        <ul>
                                            {
                                                this.state.hr_yg_hospital.map((item, index) => {
                                                    return (
                                                        <li key={index}
                                                            className="grey t-r full-w ellipsis">{item.name}</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                        <span className="d-ib v-m pull-right"
                                              style={{
                                                  // marginRight: '-.15rem',
                                                  width: '.1rem',
                                                  position: 'absolute',
                                                  top: '50%',
                                                  marginTop: '-8px',
                                                  right:'0'
                                              }}>
                            <Link to={{
                                pathname: "/CompleteStaffMsg/Hospitals",
                                state: {
                                    hospitals: getSessionItem('hospitals')
                                }
                            }}><i className="icon_right_triangle"> </i>
                            </Link>
                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                        {/*证件及其他照片上传*/}
                        {
                            default_upload.length === 0 && upload.length === 0
                                ? ''
                                : <div>
                                <h6 className="title">证件和其他材料照片或扫描件</h6>
                                <div className="bg-white b-t b-b">
                                    <ul className="detail">
                                        {
                                            type_id.indexOf(1) >= 0
                                                ? <li className="clearfix">身份证正面
                                                <span className="pull-right p-l-xl cursor"
                                                      onClick={this.showDetail.bind(this, 1, this.state.default_upload['1'].id)}>
                                                {
                                                    this.state.img_urls[1]
                                                        ? <img src={this.state.img_urls[1]} alt=""
                                                               style={img_style}/>
                                                        : <span
                                                        onClick={this.showUploadImage.bind(this, 1, this.state.default_upload[1].example_url)}>
                                                            <i
                                                                className="icon_upload grey t-sm v-m"></i>上传</span>
                                                }
                                        </span>
                                            </li>
                                                : ''
                                        }
                                        {
                                            type_id.indexOf(2) >= 0
                                                ? <li>身份证反面
                                                <span className="pull-right p-l-xl cursor"
                                                      onClick={this.showDetail.bind(this, 2, this.state.default_upload['2'].id)}>
                                            {
                                                this.state.img_urls[2]
                                                    ? <img src={this.state.img_urls[2]} alt=""
                                                           style={img_style}/>
                                                    : <span
                                                    onClick={this.showUploadImage.bind(this, 2, this.state.default_upload[2].example_url)}>
                                                            <i
                                                                className="icon_upload grey t-sm v-m"></i>上传</span>
                                            }
                                                </span>
                                            </li>
                                                : ''
                                        }
                                        {
                                            type_id.indexOf(3) >= 0
                                                ? <li>户口本主页
                                                <span className="pull-right cursor p-l-xl"
                                                      onClick={this.showDetail.bind(this, 3, this.state.default_upload['3'].id)}>
                                            {
                                                this.state.img_urls[3]
                                                    ? <img src={this.state.img_urls[3]} alt=""
                                                           style={img_style}/>
                                                    : <span
                                                    onClick={this.showUploadImage.bind(this, 3, this.state.default_upload[3].example_url)}>
                                                            <i
                                                                className="icon_upload grey t-sm v-m"></i>上传</span>
                                            }
                                                </span>
                                            </li>
                                                : ''
                                        }
                                        {
                                            type_id.indexOf(4) >= 0
                                                ? <li>户口本个人页
                                                <span className="pull-right cursor p-l-xl"
                                                      onClick={this.showDetail.bind(this, 4, this.state.default_upload['4'].id)}>
                                            {
                                                this.state.img_urls[4]
                                                    ? <img src={this.state.img_urls[4]} alt=""
                                                           style={img_style}/>
                                                    : <span
                                                    onClick={this.showUploadImage.bind(this, 4, this.state.default_upload[4].example_url)}>
                                                            <i
                                                                className="icon_upload grey t-sm v-m"></i>上传</span>
                                            }
                                                </span>
                                            </li>
                                                : ''
                                        }
                                        {
                                            //其它证件照片
                                            upload.map((item, index) => {
                                                return (
                                                    <li key={index}>{item.detect_item}
                                                        <span className="pull-right cursor p-l-xl"
                                                              onClick={this.showDetail.bind(this, item.type_id, item.id)}>
                                            {
                                                this.state.img_urls[item.type_id]
                                                    ? <img src={this.state.img_urls[item.type_id]} alt=""
                                                           style={img_style}/>
                                                    : <span
                                                    onClick={this.showUploadImage.bind(this, item.type_id, this.state.upload[item.type_id].example_url)}>
                                                            <i
                                                                className="icon_upload grey t-sm v-m"></i>上传</span>
                                            }
                                                </span>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                }
                {
                    this.state.show_bank
                        ? <Bank default_bank={this.state.default_bank}
                                default_sub_bank={this.state.default_sub_bank}
                                parent_this={this}
                                selectBank={this.selectBank}
                                bank_type={this.state.sub_bank}
                    />
                        : ''
                }
                <div className={`pos-f full-w modal bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'pic_upload'
                                ? <PicModal type={this.state.pic_type}
                                            onUpload={this.uploadImage}
                                            parent_this={this}
                                            url={this.state.example_url}/>
                                : ""
                        }
                        {
                            this.state.modal_name === 'fail'
                                ? <div className="bg-white p-a">
                                <p className="m-b" style={{wordWrap: 'break-word'}}>{this.fail_msg}</p>
                                <div className="t-c">
                                    <button className="btn btn-sm cursor"
                                            onClick={cancelModal.bind(this)}>确定
                                    </button>
                                </div>
                            </div>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {

        let img_urls = getSessionItem('img_urls');
        let hospitals = getSessionItem('hospitals', 'array');
        let select_bank = getSessionItem('select_bank') || {};
        let select_sub_bank = getSessionItem('select_sub_bank') || {};
        let miss_info = {
            yg_bank_name: select_bank.bank_name,
            yg_bank_id: select_bank.bank_id,
            yg_bank_sub: select_sub_bank.bank_name
        };
        getData(this.staffsUrls.getUnCompeletMsg(getSessionItem('yg_id') || this.props.location.state.yg_id))
            .then(res => {
                const item = res.item;
                let temp_url = {};
                // 如无缓存，则从补全信息首页进入，否则从缓存中读取银行信息覆盖银行信息
                // 社保有俩字段要判断显示哪个
                let info = JSON.parse(JSON.stringify(res.info));
                this.init = false;
                info.social_number = item.social_number ? info.social_number : info.yg_social_acc;
                miss_info = getSessionItem('select_bank') ? Object.assign(info, miss_info) : info;
                Object.keys(res.default_upload).forEach(item => temp_url[item] = res.default_upload[item].url);
                Object.keys(res.upload).forEach(item => temp_url[item] = res.upload[item].url);
                // 如无缓存，则从补全信息首页进入，否则从缓存中读取图片信息覆盖
                img_urls = getSessionItem('img_urls') ? img_urls : temp_url;
                // 如无缓存，则从补全信息首页进入，否则从缓存中读取医院信息覆盖
                hospitals = getSessionItem('hospitals') ? hospitals : res.hr_yg_hospital;
                this.setState({
                    miss_info: miss_info,
                    upload: res.upload,
                    default_upload: res.default_upload,
                    show_title: res.item,
                    setting: res.setting,
                    default_bank: res.setting.bank,
                    // img_urls: img_urls,
                    img_urls: temp_url,
                    hr_yg_hospital: hospitals,
                    social_status: res.info.social_status,
                    fund_status: res.info.fund_status
                });
            })
    }

    showBank(sub_bank) {
        if (sub_bank && !this.state.miss_info.bank_code) {
            this.setState({
                sub_bank: sub_bank
            })
        } else {
            this.setState({
                show_bank: true,
                sub_bank: sub_bank,
                default_sub_bank: []
            })
        }
    }

    selectBank(bank, bank_type) {
        let miss_info = this.state.miss_info;
        let temp;
        if (bank_type) {
            sessionStorage.setItem('select_sub_bank', JSON.stringify(bank));
            temp = Object.assign(miss_info, {
                bank_sub_code: bank.bank_code,
                bank_sub_name: bank.bank_name
            });
        } else {
            sessionStorage.setItem('select_bank', JSON.stringify(bank));
            temp = Object.assign(miss_info, {
                bank_code: bank.bank_id,
                bank_name: bank.bank_name,
                bank_sub_code: '',
                bank_sub_name: ''
            });
        }
        this.setState({
            miss_info: temp,
            show_bank: false
        })
    }

    showUploadImage(type, url) {
        this.setState({
            pic_type: type,
            example_url: url
        });
        showModal.call(this, 'pic_upload')
    }

    uploadImage(type) {
        cancelModal.call(this);
        wx.ready(() => {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                success: (res) => {
                    let localIds = res.localIds;
                    wx.uploadImage({
                        localId: localIds[0],
                        isShowProgressTips: 1,
                        success: (res) => {
                            let serverId = res.serverId;
                            this.sendImageId(serverId, type);
                        },
                        fail: (err) => {
                            this.fail_msg = '照片上传失败，请重新尝试。';
                            showModal.call(this, 'fail', 'alert')
                        }
                    })
                },
                fail: (err) => {
                    this.fail_msg = '无法打开相册,请刷新页面重试';
                    showModal.call(this, 'fail', 'alert')
                }
            })
        })

    }

    sendImageId(serveId, type) {
        getData(this.staffsUrls.uploadImage(), {
            yg_id: this.props.location.state.yg_id,
            server_id: serveId,
            type: type
        })
            .then(res => {
                let img_urls = this.state.img_urls;
                img_urls[type] = res.url;
                this.setState({
                    img_urls: img_urls
                })
            })
    }

    showDetail(type, id) {
        if (this.state.img_urls[type]) {
            clearSessionItem('reload_step2');
            this.props.history.push({
                pathname: '/CompleteStaffMsg/PicDetail',
                state: {
                    url: this.state.img_urls[type],
                    type: type,
                    yg_id: this.state.miss_info.yg_id,
                    id: id
                }
            })
        }
    }

    saveData() {
        let submit_data = {
            yg_id: this.props.location.state.yg_id
        };
        let validate = ['yg_hk_post', 'yg_post']
        let uni_validate = ['bank_sub_code', 'bank_code', 'bank_sub_code'];
        let bank_valid = 0;
        submit_data = Object.assign(submit_data, this.state.miss_info);
        if (this.state.show_title.social_number) {
            submit_data.social_number = this.state.miss_info.social_number
        } else {
            submit_data.yg_social_acc = this.state.miss_info.social_number;
            delete submit_data.social_number;
        }
        validate.map((item, index) => {
            submitValidate.call(this, 'miss_info', [item], this.validates[item], submit_data[item]);
        });
        uni_validate.forEach(item => {
            if (!this.state.miss_info[item]) {
                bank_valid++;
            }

        });
        if (JSON.stringify(this.state.miss_info_err) === '{}' && (bank_valid === 3 || bank_valid === 0)) {
            postData(this.staffsUrls.updateStaffUncompelete(), submit_data)
                .then((res) => {
                    //清除缓存
                    clearSessionItem('reload_step2');
                    this.temp_session.forEach(item => clearSessionItem(item));
                    this.props.history.replace('/CompleteStaffMsg')
                    // this.props.history.go(-1);
                });
        } else if (bank_valid !== 3 && bank_valid !== 0) {
            this.setState({
                bank_valid: '请填写完整银行信息！'
            })
        }
    }
}