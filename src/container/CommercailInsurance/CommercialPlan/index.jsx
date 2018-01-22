import React from 'react'
import {showModal, cancelModal} from "../../../utils/modal"
import {changeUnNecValue} from '../../../utils/form'
import {postData, getData} from '../../../fetch/httpRequest'
import {CommercialUrls} from '../../../service/commercial/commercialUrl'

export class CommercialPlan extends React.Component {
    constructor(props, context) {
        super(props, context);
        const is_team = this.props.location.state['team_num'] != 0;
        const is_medical = this.props.location.state['sup_type'] != 0;
        let commercial = {
            is_company: 0,
            is_team: is_team,
            is_medical: is_medical
        };
        this.commercial_data = ['team_num', 'sup_type', 'yg_id'];
        this.commercialUrls = new CommercialUrls();
        this.commercial_data.map((item, index) => {
            commercial[item] = this.props.location.state[item];
        });
        this.state = {
            modal_in: '',
            show_settings: '',
            commercial: commercial
        };
        document.title='编辑商保方案'
    }

    render() {
        return (
            <div>
                <div className="p-l p-r p-t-sm p-b-sm bg-white b-b shadow-bottom m-b-sm clearfix">
                    <span className="d-ib m-t-xs cursor"
                          onClick={() => {
                              this.props.history.replace({
                                  pathname: '/Commercial/Detail',
                                  state: this.props.location.state
                              })
                          }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="btn btn-sm pull-right cursor" onClick={this.saveData.bind(this)}>保存</span>
                </div>
                <h6 className="title">团体意外伤害险</h6>
                <div className="bg-white b-t b-b">
                    <ul className="detail">
                        <li className="p-r">
                            <span>购买团体意外伤害险</span>
                            <div className="slide pull-right">
                                <label className="ui-check">
                                    <input type="checkbox"
                                           name="is_team"
                                           onChange={this.changeState.bind(this, 'is_team')}
                                           checked={this.state.commercial.is_team === true}
                                    />
                                    <i className="icon_ui"></i>
                                </label>
                            </div>
                        </li>
                        {
                            this.state.commercial.is_team
                                ? <li className="p-r">
                                <span>团体意外伤害险 <span className="grey">（10元每份）</span></span>
                                <div className="slide pull-right">
                                <span className="cursor d-ib t-c" style={{
                                    background: '#33ac37',
                                    color: '#fff',
                                    width: '.2rem',
                                    height: '.2rem',
                                    borderRadius: '3px'
                                }} onClick={this.minusCommercial.bind(this)}>
                                    <i className="icon_minus t" style={{color: '#fff', lineHeight: '.18rem'}}></i>
                                </span>
                                    <input type="text" style={{width: '.4rem'}}
                                           className="t-c"
                                           name=""
                                           value={this.state.commercial.team_num}
                                           onChange={changeUnNecValue.bind(this, ['commercial', 'team_num'])}
                                    />
                                    <span className="d-ib t-c cursor" style={{
                                        background: '#33ac37',
                                        color: '#fff',
                                        width: '.2rem',
                                        height: '.2rem',
                                        borderRadius: '3px'
                                    }} onClick={this.plusCommercial.bind(this)}>
                                    <i className="icon_add t" style={{color: '#fff', lineHeight: '.18rem'}}></i>
                                </span>
                                </div>
                            </li>
                                : ''
                        }
                    </ul>
                </div>
                {
                    this.state.commercial.is_team
                        ? <div>
                        <h6 className="title">补充医疗险</h6>
                        <div className="bg-white b-t b-b">
                            <ul className="detail">
                                <li className="p-r">
                                    <span>购买补充医疗险</span>
                                    <div className="slide pull-right">
                                        <label className="ui-check">
                                            <input type="checkbox"
                                                   name="is_medical"
                                                   onChange={this.changeState.bind(this, 'is_medical')}
                                                   checked={this.state.commercial.is_medical === true}
                                                   disabled={Number(this.state.commercial.team_num) <= 0}
                                            />
                                            <i className="icon_ui"></i>
                                        </label>
                                    </div>
                                </li>
                                {
                                    this.state.commercial.is_medical
                                        ? <li className="p-r">
                                        <span>80元</span>
                                        <div className="slide pull-right">
                                            <label className="ui-check">
                                                <input type="radio"
                                                       defaultValue="1"
                                                       name="medical"
                                                       checked={this.state.commercial.sup_type.toString() === '1'}
                                                       onChange={changeUnNecValue.bind(this, ['commercial', 'sup_type'])}/>
                                                <i className="icon_ui"></i>
                                            </label>
                                        </div>
                                    </li>
                                        : ''
                                }
                                {
                                    this.state.commercial.is_medical
                                        ? <li className="p-r">
                                        <span>120元</span>
                                        <div className="slide pull-right">
                                            <label className="ui-check">
                                                <input type="radio"
                                                       defaultValue="2"
                                                       name="medical"
                                                       checked={this.state.commercial.sup_type.toString() === '2'}
                                                       onChange={changeUnNecValue.bind(this, ['commercial', 'sup_type'])}/>
                                                <i className="icon_ui"></i>
                                            </label>
                                        </div>
                                    </li>
                                        : ''
                                }
                            </ul>
                        </div>
                    </div>
                        : ''
                }
                <div className={`pos-f full-w modal bottom ${this.state.show_settings}`}
                     onClick={cancelModal.bind(this)}>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>

                    </div>
                </div>
            </div>
        )
    }


    minusCommercial() {
        let num = Number(this.state.commercial['team_num']);
        let medical_num = Number(this.state.commercial['sup_type']);
        let is_medical = this.state.commercial['is_medical'];
        num = num-- > 0 ? num-- : 0;
        medical_num = num === 0 ? '0' : medical_num;
        is_medical = !(num === 0);
        this.setState({
            commercial: Object.assign(this.state.commercial, {
                team_num: num,
                sup_type: medical_num,
                is_medical: is_medical
            })
        })
    }

    plusCommercial() {
        let num = Number(this.state.commercial.team_num);
        num++;
        this.setState({
            commercial: Object.assign(this.state.commercial, {team_num: num})
        });
    }

    changeState(obj) {
        this.setState({
            commercial: Object.assign(this.state.commercial, {[obj]: !this.state.commercial[obj]})
        })
    }

    saveData(event) {
        let submit_data = {
            is_company: 0
        };
        let detail = {};
        console.log(this.state.commercial.is_medical);
        this.commercial_data.map((item) => {
            submit_data[item] = this.state.commercial[item]
        });
        if (!this.state.commercial.is_team) {
            submit_data['team_num'] = 0
        }
        if (!this.state.commercial.is_medical || !this.state.commercial.is_team) {
            submit_data['sup_type'] = 0
        }

        postData(this.commercialUrls.setCommercial(), submit_data)
            .then(res => {
                getData(this.commercialUrls.getCommercial())
                    .then((res) => {
                        const commercial_list = res.data
                        commercial_list.map((item, index) => {
                            if (item.yg_id === submit_data.yg_id) {
                                detail = item;
                            }
                        });
                        this.props.history.replace({
                            pathname: '/Commercial/Detail',
                            state: detail
                        })

                    });
            })
    }
}
