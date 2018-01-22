import React from 'react'
import {postData, getData} from '../../../../../fetch/httpRequest'
import {StaffsUrls} from '../../../../../service/staffs/staffsUrl'
import {CommonUrls} from '../../../../../service/commonUrl'
import {showModal, cancelModal} from '../../../../../utils/modal'
import {getConfig} from '../../../../../utils/wxConfig'
import {getSessionItem, setSessionItem, clearSessionItem} from '../../../../../utils/sessionStorage'

export class PicDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && !getSessionItem('pic_detail')) { //判断iPhone|iPad|iPod|iOS
            window.location.reload();
        }
        setSessionItem('pic_detail', window.location.href.split('#')[0]);
        getConfig.call(this, encodeURIComponent(getSessionItem('pic_detail')));
        this.staffsUrls = new StaffsUrls();
        this.commonUrls = new CommonUrls();
        this.state = {
            img_url: this.props.location.state.url
        };
        this.fail_msg = '';
        document.title = '预览';
    }

    render() {
        return (
            <div className="full-h " style={{paddingTop: '.5rem'}}>
                <div className="bg-white b-b p-a" style={{marginTop: '-.5rem'}}>
                    <span className="cursor" onClick={this.getBack.bind(this)}><i
                        className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right">
                        <div className="t-c">
                            <span
                                className={`pull-right btn btn-sm`}
                                onClick={this.uploadImage.bind(this, this.props.location.state.type)}>重新上传</span>
                        </div>
                    </span>
                </div>
                <div className="p-a full-h" style={{background: 'rgba(0,0,0,0.7)'}}>
                    <img src={this.state.img_url} alt="" className="full-w " style={{maxHeight: '100%'}}/>
                </div>
                <div className={`pos-f full-w modal bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'fail'
                                ? <div className="bg-white p-a">
                                <p className="m-b">{this.fail_msg}</p>
                                <div className="t-c">
                                    <button className="btn btn-sm cursor"
                                            onClick={cancelModal.bind(this)}>确定</button>
                                </div>
                            </div>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }

    uploadImage() {
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
                            this.sendImageId(serverId);
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

    sendImageId(serveId) {
        getData(this.staffsUrls.uploadImage(), {
            yg_id: this.props.location.state.yg_id,
            server_id: serveId,
            type: this.props.location.state.type
        })
            .then(res => {
                this.setState({
                    img_url: res.url
                });
            })
    }

    getBack() {
        clearSessionItem('pic_detail');
        this.props.history.goBack();
    }
}