import React from 'react'
import {postData} from '../../../../fetch/httpRequest'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {setSessionItem} from '../../../../utils/sessionStorage'

export class StepFirst extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.staffsUrls = new StaffsUrls();
        const fund_status = this.props.location.state.fund_status;
        const social_status = this.props.location.state.social_status;
        this.state = {
            fund_status: fund_status,
            social_status: social_status,
        };
    }

    render() {
        return (
            <div>
                <div className="bg-white b-b p-a">
                    <span className="cursor"
                          onClick={() => {this.props.history.goBack()}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span
                        className={`pull-right btn btn-sm`}
                        onClick={this.saveData.bind(this)}>下一步</span>
                </div>
                <h6 className="title p-l p-r">社保缴纳情况</h6>
                <div className="bg-white">
                    <ul className="detail b-t b-b">
                        <li>
                            <div className="clearfix">
                                <span>在当地缴纳过社保</span>
                                <div className="pull-right t-r">
                                    <label className="ui-check">
                                        <input type="checkbox"
                                               name="social_status"
                                               checked={this.state.social_status}
                                               onChange={this.changeValue.bind(this, 'social_status')}
                                        />
                                        <i className="icon_ui"></i>
                                    </label>
                                </div>
                            </div>
                        </li>

                    </ul>
                </div>
                <h6 className="title p-l p-r">公积金缴纳情况</h6>
                <div className="bg-white">
                    <ul className="detail b-t b-b">
                        <li>
                            <div className="clearfix">
                                <span>在当地缴纳过公积金</span>
                                <div className="pull-right t-r">
                                    <label className="ui-check">
                                        <input type="checkbox"
                                               name="fund_status"
                                               checked={this.state.fund_status}
                                               onChange={this.changeValue.bind(this, 'fund_status')}/>
                                        <i className="icon_ui"></i>
                                    </label>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    changeValue(obj, event) {
        let status = !this.state[obj];
        this.setState({
            [obj]: status
        })
    }

    saveData() {
        let submit_data = {};
        let fund_status = this.state.fund_status ? 1 : 0;
        let social_status = this.state.social_status ? 1 : 0;
        submit_data = {
            fund_status: fund_status,
            social_status: social_status,
            yg_id: this.props.location.state.yg_id
        };//缺员工id
        postData(this.staffsUrls.saveSocialState(), submit_data)
            .then(res => {
                this.props.history.push({
                    pathname: '/CompleteStaffMsg/step2',
                    state:this.props.location.state
                })
            })
    }

}