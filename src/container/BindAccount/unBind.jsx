import React from 'react'
import {HomePageUrls} from '../../service/homepage/homepageUrl'
import {postData} from '../../fetch/httpRequest'
import {clearSessionItem} from '../../utils/sessionStorage'
import {showModal, cancelModal} from '../../utils/modal'

export class Unbind extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.homePageUrls = new HomePageUrls();
        this.state = {
            modal_in: '',
            modal_name: '',
            show_modal: ''
        }
    }

    render() {
        return (
            <div className="bg-grey t-c full-h pos-a full-w" style={{top: 0, left: 0}}>
                <div className="p-t-xxl">
                    <img src="/src/assets/image/invalid-name.png" alt="" style={{width: '50%'}}
                         className="m-b"/>
                    <p className="t-lg m-b-lg t-c m-t">您尚未开通人事外包服务</p>

                </div>
                <div className="bg-white p-t-xxl t-c full-w" style={{position: 'absolute', bottom: '0', left: 0}}>
                    <p className="t-lg t-c">400-686-9915</p>
                    <p className="grey t-sm t-c m-b">工作日 9:30～18:00</p>
                    <div className="t-c" style={{marginBottom: '.5rem'}}>
                        <a className="btn btn-sm" href="tel: 400-686-9915">致电详询</a>
                        <span className="grey t-u d-b m-t cursor" onClick={showModal.bind(this, 'confirm', 'alert')}>解除绑定</span>
                    </div>
                    <div className="footer ">
                        <p className="t-c">1000万中小企业的云端人力资源部
                        </p>
                        <p className="grey t-sm t-c p-b-sm">
                            <span className="m-r-sm">五险一金代缴 /托管 · 薪酬代发 · 商保购买 · 手续代办理等</span>
                        </p>
                    </div>
                </div>
                <div className={`pos-f full-w modal  bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'confirm'
                                ? <div className="bg-white t-c p-a">
                                <p className="m-b">解除绑定后您需要重新绑定才能在微信中使用蚂蚁HR服务</p>
                                <div className="btn-group p-a t-c">
                                    <button className="btn btn-sm disabled"
                                            onClick={cancelModal.bind(this)}>取消
                                    </button>
                                    <button className="btn btn-sm m-l"
                                            onClick={this.unBind.bind(this)}>确定
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

    unBind() {
        postData(this.homePageUrls.accountUnBind(), {})
            .then(res => {
                clearSessionItem('mayihr_token');
                // this.props.history.replace('/Bind')
                this.props.history.replace('/');
            })
            .catch(err => {
                console.log(err)
            })
    }
}