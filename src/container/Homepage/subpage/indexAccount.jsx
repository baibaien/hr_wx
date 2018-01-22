import React from 'react'
import {Link} from 'react-router-dom'
import {SettingModal} from '../Modals/settingModal'
import {HelpModal} from '../Modals/helpModal'
import {UnBindModal} from '../Modals/unBindModal'
import {postData} from '../../../fetch/httpRequest'
import {showModal, cancelModal} from "../../../utils/modal"
import {clearSessionItem} from '../../../utils/sessionStorage'
import {HomePageUrls} from '../../../service/homepage/homepageUrl'

export class IndexAccount extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.homePageUrls = new HomePageUrls();
        this.state = {
            modal_in: '',
            show_settings: ''
        };
    }

    render() {
        return (
            <div>
                <h6 className="title">账户管理</h6>
                <div className="bg-white b-t b-b">
                    <ul className="p-l list">
                        <li className="">
                            <Link to="/Bill">
                                <span className="p-r-sm p-t p-b pull-left">
                                    <i className="icon_history v-m"></i>
                                </span>
                                <div className="b-b p-t p-b m-l p-r">订单管理<span
                                    className="pull-right"><i className="icon_right_triangle v-m"> </i></span></div>
                            </Link>
                        </li>
                        <li className="">
                            <span className="p-r-sm p-t p-b pull-left"><i className="icon_customer_service v-m"> </i></span>
                            <div className="b-b p-t p-b m-l p-r" onClick={showModal.bind(this, 'help')}>帮助与支持<span
                                className="pull-right"><i className="icon_right_triangle v-m"></i></span></div>
                        </li>
                        <li className="">
                            <span className="p-r-sm p-t p-b pull-left"><i className="icon_setting v-m"></i></span>
                            <div className="p-t p-b m-l p-r" onClick={showModal.bind(this, 'setting')}>账户设置<span
                                className="pull-right"><i
                                className="icon_right_triangle v-m"></i></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className={`pos-f full-w modal  bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'setting'
                                ? <SettingModal cancelClick={cancelModal.bind(this)}
                                                parent_this={this}/>
                                : ''
                        }
                        {
                            this.state.modal_name === 'help'
                                ? <HelpModal cancelClick={cancelModal.bind(this)}/>
                                : ''
                        }
                        {
                            this.state.modal_name === 'unbind'
                                ? <UnBindModal cancelClick={cancelModal.bind(this)}
                                               confirmUnbind={this.confirmUnbind}
                                               parent_this={this}
                                               />
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }

    confirmUnbind() {
        postData(this.homePageUrls.accountUnBind(), {})
            .then(res => {
                clearSessionItem('mayihr_token');
                // this.props.parent_this.props.history.push('/Bind'
                this.props.parent_this.props.history.replace('/');
            })
            .catch (err => {
                console.log(err)
            })
    }
}
