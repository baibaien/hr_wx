import React from 'react'
import {deleteData, getData} from '../../../../fetch/httpRequest'
import {BillManageUrls} from '../../../../service/billManageApi/billManageUrl'
import {showAlertModal, getAlert, showModal, cancelModal} from '../../../../utils/modal'
import {getConfig } from '../../../../utils/wxConfig'
import {getSessionItem,setSessionItem, clearSessionItem} from '../../../../utils/sessionStorage'


export class PayPics extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && !getSessionItem('pay_detail')) { //判断iPhone|iPad|iPod|iOS
            window.location.reload();
        }
        setSessionItem('pay_detail', window.location.href.split('#')[0]);
        getConfig.call(this, encodeURIComponent(getSessionItem('pay_detail')));
        this.billManageUrls = new BillManageUrls();
        this.url = this.props.location.state.url;
        this.order_id = this.props.location.state.order_id;
        this.fail_msg = '';
        this.state = {
            urls: this.url,
            modal_name: '',
            modal_in: '',
            show_modal: ''
        };

    }

    render() {
        return (
            <div className=" pos-r" style={{paddingTop: '.5rem', paddingBottom: '1.5rem', minHeight: '100%'}}>
                <div className="bg-white b-b p-a" style={{marginTop: '-.5rem'}}>
                    <span className="cursor" onClick={this.getBack.bind(this)}><i
                        className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right">
                        <span
                            className={`pull-right cursor `}
                            onClick={this.uploadImage.bind(this)}><i className="icon_upload v-m grey"></i><span className="v-m">上传更多凭证</span></span>
                        {
                            this.state.urls.length === 5
                                ? <p className="t-sm pull-right">最多只能上传5张有效凭证</p>
                                : ''
                        }
                    </span>
                </div>
                <div className="p-a ">
                    {
                        this.state.urls.map((item, index) => {
                            return (
                                <div className="d-ib p-a-sm pos-r" style={{width: '33.3333%'}} key={index}>
                                    <img src={item.real_path} alt="" className="full-w" style={{height: '.7rem'}}/>
                                    <span className="pos-a cursor" style={{
                                        left: '-.05rem',
                                        bottom: '-.05rem',
                                        width: '.2rem',
                                        textAlign: 'center',
                                        background: 'red',
                                        border: '1px solid #fff',
                                        borderRadius: '100%'
                                    }}
                                          onClick={this.delPic.bind(this, item.voucher_id)}><i
                                        className="icon_close t-sm"
                                        style={{color: '#fff', lineHeight: '.2rem'}}></i></span>
                                </div>
                            )

                        })
                    }

                </div>
                <div className="footer bg-white p-a pos-a full-w b-t shadow-top" style={{left: 0, bottom: '0'}}>
                    <p className="grey t-c t-sm m-t-sm">已上传{this.state.urls.length}张凭证</p>

                    <p className="grey t-c t-sm m-b">点击完成或返回，系统将自动跳转到订单详情</p>
                    <button className={this.state.urls.length === 0 ? 'disabled btn full-w' : 'btn full-w cursor'}
                            onClick={this.compeletePic.bind(this)}>完成
                    </button>
                </div>
                <div className={`pos-f full-w modal bottom bg-grey ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
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


    uploadImage() {
        if (this.state.urls.length < 5) {
            wx.ready(() => {
                wx.chooseImage({
                    count: 5 - this.state.urls.length,
                    sizeType: ['original', 'compressed'],
                    success: (res) => {
                        let localIds = res.localIds;
                        this.uploadInQueu(localIds);
                    },
                    fail: (err) => {
                        this.fail_msg = '无法打开相册,请刷新页面重试';
                        showModal.call(this, 'fail', 'alert')
                    }
                })
            })
        }
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
                        let urls = this.state.urls;
                        urls.push(res);
                        this.setState({
                            urls: urls
                        });
                        if (localIds.length > 0) {
                            this.uploadInQueu(localIds);
                        }
                    });
            },
            fail: (res) => {
                this.fail_msg = '照片上传失败，请重新尝试。';
                showModal.call(this, 'fail', 'alert')
            }
        })
    }

    getBack() {
        // this.props.history.replace('/CompleteStaffMsg/Step2')
        clearSessionItem('pay_detail');
        if (this.state.urls.length === 0) {
            this.props.history.goBack();
        } else {
            this.props.history.push({
                pathname: `/Bill/Detail/${this.props.location.state.order_id}`
            })
        }
    }

    delPic(v_id) {
        if (this.state.urls.length > 1) {
            deleteData(this.billManageUrls.delPics(this.props.location.state.order_id, v_id), {})
                .then(res => {
                    let urls = this.state.urls.filter(item => item.voucher_id !== v_id);
                    this.setState({
                        urls: urls
                    })
                })
        } else {
            let alert_this = getAlert();
            showAlertModal.call(alert_this, '当前凭证已是最后一张，不可删除操作');
        }
    }

    compeletePic() {
        if (this.state.urls.length !== 0) {
            this.props.history.push({
                pathname: `/Bill/Detail/${this.props.location.state.order_id}`
            })
        }
    }
}