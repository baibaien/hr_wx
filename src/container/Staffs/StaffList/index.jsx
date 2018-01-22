import React from 'react';
import {Link} from 'react-router-dom'
import {StaffsUrls} from '../../../service/staffs/staffsUrl'
import {getData} from '../../../fetch/httpRequest'
import {Search} from '../../../components/Search/index'

export class StaffList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.staffsUrls = new StaffsUrls();
        this.init = true;
        this.state = {
            orgs: [],
            staffs: [],
            title: []
        }
        document.title = '员工名录'
    }

    render() {
        return (
            // 员工列表
            <div>
                <div style={{height: '.5rem', lineHeight: '.5rem'}}>
                    <div className="pos-f bg-white p-l p-r b-b shadow-bottom" style={{left: 0, right: 0, top: 0}}>
                        <Search onSearch={this.searchYg}
                                onRefreshPage={this.getStaffList}
                                goBack={() => {
                                    this.props.history.replace('/Index')
                                }}
                                setting={
                                    {
                                        parent_this: this,
                                        // refresh_url: this.staffUrls.staffList(),
                                        placeholder: '输入员工姓名进行搜索',
                                        reset_data:[]
                                    }
                                }
                        />
                    </div>
                </div>
                {
                    this.state.orgs.length === 0
                        ? ''
                        : <div >
                        <h6 className="title p-l p-r">部门</h6>
                        <div className="bg-white">
                            <ul className="detail b-t b-b">
                                {
                                    this.state.orgs.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                {
                                                    item.children_count === 0 && item.staff_count === 0
                                                        ? <div className="clearfix">
                                                        <span >{item.name}</span>
                                                        <div className="pull-right t-r p-r-lg pos-r">
                                                        <span
                                                            className="grey d-b t-sm">下设{item.children_count}个部门</span>
                                                            <span
                                                                className="d-b grey t-sm">直属{item.staff_count}位成员</span>
                                                        </div>
                                                    </div>
                                                        : <div className="clearfix cursor"
                                                               onClick={this.getDepartmentDetail.bind(this, item.id)}>
                                                        <span >{item.name}</span>
                                                        <div className="pull-right t-r p-r-lg pos-r">
                                                        <span
                                                            className="grey d-b t-sm">下设{item.children_count}个部门</span>
                                                            <span
                                                                className="d-b grey t-sm">直属{item.staff_count}位成员</span>
                                                            <span className="pos-a"
                                                                  style={{
                                                                      right: 0,
                                                                      top: '50%',
                                                                      marginTop: '-.08rem'
                                                                  }}><i
                                                                className="icon_right_triangle"></i></span>
                                                        </div>
                                                    </div>
                                                }
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                }

                {
                    this.state.title.length === 0 && !this.init && this.state.orgs.length === 0
                        ? <div className="t-md p-t t-c">
                        <img src="/src/assets/image/none.svg"/></div>
                        :
                        this.state.title.map((item, index) => {
                            return (
                                <div key={index}>
                                    <h6 className="title p-l p-r">{item}</h6>
                                    <div className="bg-white">
                                        <ul className="detail b-t b-b">
                                            {
                                                this.state.staffs[item].map((sub_item, sub_index) => {
                                                    return (
                                                        <li key={sub_index}>
                                                            <Link to={`/Staffs/Detail/${sub_item.id}`}>
                                                                <div className="clearfix">
                                                            <span >{sub_item.yg_name}
                                                                <span
                                                                    className={`m-l-sm v-m ${sub_item.yg_is_wechat == 1 ? "" : "hide"}`}>
                                                                <i className="icon_we_chat green"></i>
                                                            </span>
                                                            </span>
                                                                    <div className="pull-right t-r">
                                                                    <span
                                                                        className="d-b grey t-sm">{sub_item.yg_zhiwei_name}</span>
                                                                        <i className="icon_right_triangle"></i>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        )
    }

    componentDidMount() {
        this.getStaffList(this);
    }

    getStaffList(parent_this, params = {}) {
        return getData(parent_this.staffsUrls.searchStaff(), params)
            .then(res => {
                parent_this.init = false;
                let title = [];
                title = Object.keys(res.staffs);
                parent_this.setState({
                    orgs: res.orgs,
                    staffs: res.staffs,
                    title: title
                })
            })
    }

    getDepartmentDetail(yg_org_id) {
        this.getStaffList(this, {yg_org_id: yg_org_id});
    }

    searchYg(parent_this, params) {
        parent_this.getStaffList(parent_this, {search: params})
            .then(res => {
                parent_this.setState({
                    orgs: []
                })
            })
    }
}