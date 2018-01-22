import React from 'react'
import {postData, getData} from '../../fetch/httpRequest'
import {AccountBindUrls} from "../../service/accountBind/accountBindUrl"
import {HomePageUrls} from "../../service/homepage/homepageUrl"
import {showModal, cancelModal} from '../../utils/modal'
import {clearSessionItem} from '../../utils/sessionStorage'

export class ReActivate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.accountBindUrls = new AccountBindUrls();
        this.homePageUrls = new HomePageUrls();
        this.state = {
            modal_in: '',
            modal_name: '',
            show_modal: ''
        }
    }
    render() {
        return (
            <div className="bg-grey t-c full-h full-w pos-a">
                <div className="p-t-xxl">
                    <img src="/src/assets/image/reactive.png" alt="" className="" style={{width: '50%'}}/>
                </div>
                <p className="t-md m-t t-c">您暂时中止了人事外包服务</p>
                <p className="t-sm grey t-c m-b">您可以点击自助激活继续使用服务</p>
                <p className="t-c t-u grey" onClick={showModal.bind(this, 'confirm', 'alert')}>解除绑定</p>
                <div className="footer p-a full-w pos-a" style={{bottom: 0,left:0}}>
                    <div className="m-b">
                        <button className="btn full-w cursor"
                        onClick={this.reActive.bind(this)}>自助激活</button>
                    </div>
                    <p className="grey t-sm m-b-sm t-c">
                        <span className="">自助激活当月需要成功支付账单才能激活生效哦</span>
                        {/*<span className="t-r ">了解自助激活</span>*/}
                    </p>
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
                                    <button className="btn btn-sm m-l "
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
    reActive() {
        getData(this.accountBindUrls.reActive())
            .then(res => {
                // todo 提示激活成功，跳转
                this.props.history.push('/Index');
            })
            .catch(err => {
                console.log(err);
            })
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