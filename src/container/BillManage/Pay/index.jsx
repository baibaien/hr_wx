import React from 'react'
import {Link} from 'react-router-dom'
import {getData, postData} from "../../../fetch/httpRequest"
import {showModal, cancelModal} from "../../../utils/modal"
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {CommonUrls} from '../../../service/commonUrl'
import {dateTransform} from '../../../utils/dateTransform'
import {BillOrder} from '../BillOrder/index'
import {getConfig} from '../../../utils/wxConfig'
import {getSessionItem, setSessionItem, clearSessionItem} from '../../../utils/sessionStorage'

//支付页面
export class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && !getSessionItem('pay')) { //判断iPhone|iPad|iPod|iOS
            window.location.reload();
        }
        setSessionItem('pay', window.location.href.split('#')[0]);
        getConfig.call(this, encodeURIComponent(getSessionItem('pay')));
        this.billManageUrls = new BillManageUrls();
        this.commonUrls = new CommonUrls();
        this.fail_msg = '';
        this.urls = [];
        this.state = {
            modal_in: '',
            show_modal: '',
            modal_name: '',
            pay_list: ['微信', '网银转账', '支付宝'],
            img_list: ['wepay', 'unionpay', 'alipay'],
            pay_type: 0,
            is_third_pay: 0,
            third_pay_info: {},
            img_url: '',
            order: {},
            fp_type: '1',
            bank_list: {
                bank: {},
                ali: {}
            },
            detail: []
        };

        document.title = '支付订单'
    }

    render() {
        return (
            <div>
                <div className="p-a b-b shadow-bottom m-b-sm bg-white">
                    <span className="cursor" onClick={() => {
                        clearSessionItem('pay');
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right">
                        <Link to="/Settings/Fapiao">发票信息 <i className="icon_right_triangle v-m"></i></Link>
                    </span>
                </div>
                <div className="bg-white b-b">
                    <div className="bg-grey p-a b-t">
                        <span>订单编号：{this.props.location.state.order_id}</span>
                        <span className="pull-right">下单于{dateTransform(this.state.order.addtime)}</span>
                    </div>
                    <div className="bg-white p-l p-r p-t-xl p-b-xl clearfix b-b">
                        <div className="d-ib">
                            <p className="grey">订单金额：{this.state.order.payable}</p>
                            <p className="grey">余额抵扣： {this.state.order.offset_money}</p>
                        </div>
                        <div className="pull-right t-r">
                            <p className="bold t-20">{this.state.order.all_money}</p>
                            <p className="grey t-c">应付</p>
                        </div>
                    </div>
                    <div className="p-a b-b">
                        <img
                            src={this.state.is_third_pay === 1 ? this.state.third_pay_info.icon : `/src/assets/image/${this.state.img_list[this.state.pay_type]}.png`}
                            alt=""
                            style={{width: '.25rem'}}/>
                        <span className="grey v-m">{
                            this.state.is_third_pay === 1
                                ? this.state.third_pay_info.name
                                : this.state.pay_list[this.state.pay_type]
                        }支付</span>
                        <span className={this.state.is_third_pay === 1 ? 'hide' : "pull-right cursor"}
                              onClick={showModal.bind(this, 'pay')}>更多支付方式<i
                            className="icon_right_triangle"></i></span>
                        {/*<span className="pull-right" onClick={this.showModal.bind(this)}>更多支付方式<i*/}
                        {/*className="icon_right_triangle"></i></span>*/}
                    </div>
                    <div className={`p-l-xl p-r-xl p-t-xxl p-b b-b ${this.state.pay_type === 2 ? '' : 'hide'}`}>
                        <p className="grey t-sm t-c m-b-xs">户名：{this.state.bank_list.ali.name}</p>
                        <p className="bg-grey p-t-lg p-b-lg t-c bold t-20">{this.state.bank_list.ali.account}</p>
                        <p className="grey t-sm t-c">支付宝账户</p>
                        <p className="t-c grey m-t-lg t-sm">
                            请勿关闭该页面，打开支付宝按照应付金额转账到以上账号<br/>
                            支付完成后记得截图或拍照并返回该页面上传
                        </p>
                    </div>
                    <div className={`p-l-xl p-r-xl p-t-xxl p-b b-b ${this.state.pay_type === 1 ? '' : 'hide'}`}>
                        <p className="grey t-sm t-c">户名： {this.state.bank_list.bank.name}</p>
                        <p className="grey t-c m-t-sm t-sm">支行：{this.state.bank_list.bank.bank}</p>
                        <p className="grey t-c m-t-sm t-sm">卡号：{this.state.bank_list.bank.account}</p>
                    </div>
                    <div className={`p-a b-b ${this.state.pay_type === 0 ? '' : 'hide'}`}>
                        <span className="full-w btn cursor" onClick={this.wxPay.bind(this)}>确认支付</span>
                    </div>
                    {
                        this.state.is_third_pay === 1
                            ? <div>
                            <div className={`p-l-xl p-r-xl p-t-xxl p-b b-b`}>
                                <p className="grey t-sm t-c"> {this.state.third_pay_info.bank.desc}</p>
                            </div>
                            <div className={`p-a b-b`}>
                                <span className="full-w btn cursor" onClick={this.thirdPay.bind(this)}>确认支付</span>
                            </div>
                        </div>
                            : ''
                    }
                    <div className={this.state.pay_type === 0 ? 'hide' : 'p-a'}>
                        <button className="btn full-w"
                                onClick={this.uploadImage.bind(this)}>上传支付凭证
                        </button>
                        {/*<button className="btn full-w"*/}
                        {/*onClick={this.hehe.bind(this)}>test*/}
                        {/*</button>*/}
                    </div>
                </div>
                <h6 className="title">订单中包含账单</h6>
                <BillOrder data={this.state.detail}/>
                <div className={`pos-f full-w modal bottom bg-grey ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'pay'
                                ? <div key="1">
                                <p className="p-t-sm p-b-sm grey t-sm t-c bg-white">请选择支付方式</p>
                                <ul>
                                    {

                                        this.state.pay_list.map((item, index) => {
                                            return (
                                                <li className={this.state.is_wx || (!this.state.is_wx && index !== 0) ? "cursor t-c bg-white b-t p-t p-b" : 'hide' }
                                                    key={index}
                                                    onClick={this.changePay.bind(this, index)}>{item}</li>
                                                //     <li className="t-c bg-white b-t p-t p-b"
                                                // key={index}
                                                // onClick={this.changePay.bind(this, index)}>{item}</li>
                                            )
                                        })
                                    }
                                    <li className="t-c bg-white p-t p-b b-t m-t-xs cursor"
                                        onClick={cancelModal.bind(this)}>
                                        取消
                                    </li>
                                </ul>
                            </div>
                                : ''
                        }

                        {
                            this.state.modal_name === 'fail'
                                ? <div className="bg-white p-a t-c">
                                <p className="m-b">{this.fail_msg}</p>
                                <button onClick={cancelModal.bind(this)} className="btn btn-sm">确定</button>
                            </div>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        // this.fail_msg = getSessionItem('pay');
        // showModal.call(this, 'fail', 'alert');
        getData(this.billManageUrls.getOrder(this.props.location.state.order_id))
            .then(res => {
                let pay_type = this.state.pay_type;
                if (Number(res.money) > 3000) {
                    pay_type = 1;
                }
                this.setState({
                    order: res.order,
                    bank_list: res.BANK_LIST,
                    is_wx: res.is_wx,
                    img_url: res.img_url,
                    detail: res.detail,
                    fp_type: res.security.fp_type,
                    pay_type: pay_type,
                    is_third_pay: res.is_thrid_pay,
                    third_pay_info: res.third_pay_info
                })
            })
    }

    wxPay() {
        getData(this.billManageUrls.payWx(this.props.location.state.order_id))
            .then(res => {
                console.log(res);
                this.onBridgeReady(res.pay_info.result);
            })
    }

    thirdPay() {
        getData(this.billManageUrls.payThird(this.props.location.state.order_id))
            .then(res => {
                this.props.history.push({
                    pathname: `/Bill/Detail/${this.props.location.state.order_id}`
                })
            })
    }

    onBridgeReady(data) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": data.bank_wx_app_id,     //公众号名称，由商户传入
                "nonceStr": data.nonce_str, //随机串
                "package": `prepay_id=${data.prepay_id}`,
                "signType": data.sign_type,         //微信签名方式：
                "paySign": data.pay_sign, //微信签名,
                "timeStamp": data.timestamp
            },
            (err) => {
                if (err.err_msg == "get_brand_wcpay_request:ok") {
                    clearSessionItem('pay');
                    this.props.history.push(`/Bill/Detail/${this.props.location.state.order_id}`)
                } else {
                    let msg = Object.keys(data).map(item => `${item}: ${data[item]}`);
                    // this.fail_msg = msg;
                    // showModal.call(this, 'fail', 'alert')
                }    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            }
        );
    }

    testNavigator() {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }

    changePay(index) {
        this.setState({
            pay_type: index
        });
        cancelModal.call(this);
    }

    uploadImage() {
        wx.ready(() => {
            wx.chooseImage({
                count: 5,
                sizeType: ['original', 'compressed'],
                success: (res) => {
                    let localIds = res.localIds;
                    this.uploadInQueu(localIds, this.urls);
                },
                fail: (err) => {
                    this.fail_msg = '无法打开相册,请刷新页面重试';
                    showModal.call(this, 'fail', 'alert')
                }
            })
        })
    }

    uploadInQueu(localIds) {
        let localId = localIds.pop();
        wx.uploadImage({
            localId: localId,
            isShowProgressTips: 0,
            success: (res) => {
                let serverId = res.serverId;
                getData(this.billManageUrls.uploadPics(), {
                    order_id: this.props.location.state.order_id,
                    server_id: serverId,
                })
                    .then(res => {
                        this.urls.push(res);
                        if (localIds.length > 0) {
                            this.uploadInQueu(localIds);
                        } else {
                            clearSessionItem('pay');
                            this.props.history.push({
                                pathname: '/Bill/Pay/PayPics',
                                state: {
                                    order_id: this.props.location.state.order_id,
                                    url: this.urls
                                }
                            });
                        }
                    });
            },
            fail: (err) => {
                this.fail_msg = '照片上传失败，请重新尝试。';
                showModal.call(this, 'fail', 'alert')
            }
        })
    }
}
