import React from 'react'
import {Link} from 'react-router-dom'
// import {SettingModal} from '../Modals/settingModal'
// import {HelpModal} from '../Modals/helpModal'
import {showModal, cancelModal} from "../../../utils/modal"

export class CommercialDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.detail = this.props.location.state;
        this.state = {
            modal_in: '',
            show_settings: '',
        };
        document.title='商保详情'
    }

    render() {
        const medical_fee = this.detail.sup_type === 1 ? 80 : (this.detail.sup_type === 2 ? 120 : 0);
        return (
            <div>
                <div className="p-a b-b bg-white">
                    <span>
                        <span className="cursor"
                              onClick={() => {this.props.history.replace('/Commercial')}}>
                            <i className="icon_left_triangle grey v-m"></i>返回</span>
                    </span>
                </div>
                <div className="bg-white b-b p-a-lg">
                    <p>{this.detail.yg_name}</p>
                    <h6 className="bold t-md">{(this.detail.team_num * 10 + medical_fee).toFixed(2)}</h6>
                    <p className="grey">每月费用</p>
                </div>
                <p className="p-a b-b bg-white"><Link to={{
                    pathname: "/Commercial/Plan",
                    state: this.detail
                }}><i className="icon_edit_simple grey v-m m-r-xs t-sm"></i>编辑商保方案</Link>
                </p>
                <h6 className="title">商保方案</h6>
                <div className="bg-white">
                    <ul className="detail">
                        <li>
                            <span>团体意外伤害险</span>
                            <span className="pull-right grey">
                                {this.detail.team_num}<i className="icon_close v-m grey t-sm m-l-xs m-r-xs"></i>10.00
                            </span>
                        </li>
                        <li>
                            <span>补充医疗保险</span>
                            <span className="pull-right grey">
                                {
                                    this.detail.sup_type == 0
                                        ? '不购买'
                                        : medical_fee
                                }
                            </span>
                        </li>
                    </ul>
                </div>
                <div className={`pos-f cursor full-w modal bottom ${this.state.show_settings}`}
                     onClick={cancelModal.bind(this)}>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>

                    </div>
                </div>
            </div>
        )
    }

}
