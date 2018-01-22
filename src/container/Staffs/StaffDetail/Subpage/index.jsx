import React from 'react';
import {Link} from 'react-router-dom'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {getData} from '../../../../fetch/httpRequest'

export class StaffDetailIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
        const staff_url = new StaffsUrls();
        this.state = {
            common: {
                defect_info: {}
            },
            base: {},
            contact: {},
            social_pay: {},
            contract: [],
            family: [],
            work: {},
            holiday: {},
            photos: [],
            staff_url: staff_url
        };

    }

    render() {
        return (
            <div className="m-b-sm">
                <div className="bg-white p-a b-b m-b-sm">
                    <span className="cursor" onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    {
                        this.state.common.defect_info.status
                            ? ''
                            : <Link to={{
                            pathname: `/CompleteStaffMsg/step${this.state.common.defect_info.is_show_status ? 1 : 2}/`,
                            state: {
                                yg_id: this.state.common.id,
                                fund_status: this.state.common.defect_info.fund_status,
                                social_status: this.state.common.defect_info.social_status
                            }
                        }} className="pull-right">补全信息<i className="icon_right_triangle"></i></Link>
                    }

                </div>
                <div className="bg-white p-t-lg p-b-lg b-t b-b">
                    <p className="p-l p-r">{this.state.base.yg_name} <span
                        className="grey">（司龄{this.calcEmployee(this.state.common.yg_employee_day)}）</span>
                        <span
                            className={`pull-right ${this.state.common.yg_is_wechat == 1 ? "" : "hide"}`}>
                                                                <i className="icon_we_chat green"></i>
                                                            </span>
                    </p>
                    <ul className="detail">
                        <li>
                            <div className="grey t-sm">
                                {this.state.common.yg_hire_date}入职，{this.state.common.yg_formal_date}转正
                            </div>
                        </li>
                        <li>
                            <div className="clearfix ">
                                <p className="grey t-sm">岗位：{this.state.common.yg_zhiwei_name || '暂无'}</p>
                                <p className="grey t-sm">部门：{this.state.common.yg_org_name || '暂无'}</p>
                                <p className={`grey t-sm ${this.state.common.leader_name === '' ? "hide" : ""}`}>
                                    向<span>{this.state.common.leader_name}</span>汇报</p>
                            </div>
                        </li>
                        <li>
                            <div className="clearfix ">
                                <p className="grey t-sm">工作地点： <span>{this.state.common.yg_office_name || '暂无'}</span>
                                </p>
                                <p className="grey t-sm">合同公司： <span>{this.state.common.yg_con_com_name || '暂无'}</span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <h6 className="title p-l p-r">联络信息</h6>
                <div className="bg-white b-t b-b">
                    <ul className="detail">
                        <li>
                            <span>联系电话</span>
                            <div className="pull-right grey">{this.state.contact.yg_phone || '暂无'}</div>
                        </li>
                        <li>
                            <span>备用电话</span>
                            <div className="pull-right grey">{this.state.contact.yg_bak_phone || '暂无'}</div>
                        </li>
                        <li>
                            <span>工作邮箱</span>
                            <div className="pull-right grey">{this.state.contact.yg_email || '暂无'}</div>
                        </li>
                        <li className="clearfix">
                            <span>住址</span>
                            <div className="pull-right w-120">
                                <p className="grey t-r" style={{whiteSpace: 'normal'}}>{this.state.contact.yg_addr}</p>
                                {
                                    this.state.contact.yg_post
                                        ? <p className="grey t-r">/{this.state.contact.yg_post}</p>
                                        : ''
                                }
                            </div>
                        </li>
                        <li className="clearfix">
                            <span>紧急联络</span>
                            <div className="pull-right">
                                <p className="grey t-r">{this.state.contact.yg_em_name || '暂无'}</p>
                                <p className="grey t-r">{this.state.contact.yg_em_rel_name}</p>
                                <p className="grey t-r">{this.state.contact.yg_em_phone}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <h6 className="title p-l p-r">更多信息</h6>
                <div className="bg-white  b-t  b-b">
                    <ul className="detail">
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Basic`,
                                    state: this.state.base
                                }
                            }>
                                <span>基本信息</span>
                                <div className="pull-right grey"><i className="icon_right_triangle"></i></div>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Social`,
                                    state: this.state.social_pay
                                }
                            }>
                                <span>薪酬与五险一金</span>
                                <div className="pull-right grey"><i className="icon_right_triangle"></i></div>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Holiday`,
                                    state: this.state.holiday
                                }
                            }>
                                <span>出勤和假期</span>
                                <div className="pull-right grey"><i className="icon_right_triangle"></i></div>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Contract`,
                                    state: this.state.contract
                                }
                            }>
                                <span>劳动信息合同</span>
                                <div className="pull-right grey"><i className="icon_right_triangle"></i></div>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Family`,
                                    state: this.state.family
                                }
                            }>
                                <span>家庭成员</span>
                                <div className="pull-right grey"><i className="icon_right_triangle"></i></div>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Work`,
                                    state: this.state.work
                                }
                            }>
                                <span>履历</span>
                                <div className="pull-right grey"><i className="icon_right_triangle"></i></div>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Photos`,
                                    state: this.state.photos
                                }}>
                                <span>证件/扫描照片</span>
                                <div className="pull-right grey"><i className="icon_right_triangle"></i></div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )

    }

    componentDidMount() {
        const yg_id = this.props.match.params.yg_id;
        getData(this.state.staff_url.staffDetail(yg_id))
            .then(res => {
                this.setState({
                    common: res.data.common,
                    base: res.data.base,
                    social_pay: res.data.salary_social,
                    contract: res.data.contract,
                    family: res.data.family,
                    work: {works: res.data.works, edus: res.data.edus},
                    holiday: res.data.holidays,
                    photos: res.data.certificate_images,
                    contact: res.data.contact
                });
                document.title = this.state.base.yg_name;
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 司龄转换
    calcEmployee(time) {
        if (time < 30) {
            return `${time}天`;
        } else if (time < 365) {
            return `${Math.floor(time / 30)}月${time % 30}天`;
        } else {
            let tmp = time % 365;
            return `${Math.floor(time / 365)}年${Math.floor(tmp / 30)}月${tmp % 30}天`;
        }
    }
}