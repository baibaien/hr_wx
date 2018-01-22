import React from 'react';
import {Link} from 'react-router-dom'
import {StaffsUrls} from '../../../service/staffs/staffsUrl'
import {getData} from '../../../fetch/httpRequest'
import {dateTransform} from '../../../utils/dateTransform'


export class StaffEventList extends React.Component {
    constructor(props, context) {
        super(props, context);
        const staff_urls = new StaffsUrls();
        this.state = {
            staff_urls: staff_urls,
            staffs: []
        }

    }

    render() {
        return (
            // 员工事件提醒列表
            <div>
                <div className="bg-white p-a b-b m-b-sm">
                    <span className="cursor" onClick={() => {
                        this.props.history.replace('/Index')
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className="bg-white">
                    <ul className="detail b-t b-b">
                        {
                            this.state.staffs.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={`/Staffs/Detail/${item.yg_id}`}>
                                            <div className="clearfix">
                                                <span >{item.yg_name}</span>
                                                <div className="pull-right t-r">
                                                    <span
                                                        className="grey t-sm m-r-sm">
                                                        {
                                                            this.props.match.params.event_type === '1'
                                                                ? item.yg_birth
                                                                : (this.props.match.params.event_type === '2'
                                                                    ? item.yg_hire_date
                                                                    : item.yg_formal_date
                                                            )
                                                        }
                                                        {
                                                            this.props.match.params.event_type === '2'
                                                                ? <span>({item.year}周年)</span>
                                                                : ''
                                                        }
                                                    </span>
                                                    <i className="icon_right_triangle v-m"></i>
                                                </div>
                                            </div>
                                        </Link>
                                    </li >
                                )
                            })
                        }
                    </ul>
                </div>
            </div >
        )
    }

    componentDidMount() {
        let event_type = this.props.match.params.event_type;
        document.title = event_type == 1 ? '近期员工生日' : (event_type == 2 ? '近期员工入职周年'　: "预定本月转正员工")
        switch (event_type) {
            // 生日提醒
            case '1':
                getData(this.state.staff_urls.birthRemind()).then(res => {
                    console.log(res);
                    this.setState({
                        staffs: res.data
                    })
                });
                break;
            // 周年提醒
            case '2':
                getData(this.state.staff_urls.annualRemind())
                    .then(res => this.setState({
                        staffs: res.data
                    }))
                    .catch(err => {
                        console.log(err)
                    })
                ;
                break;
            // 入职提醒
            case '3':
                getData(this.state.staff_urls.formalRemind())
                    .then(res => this.setState({
                        staffs: res.data
                    }))
                    .catch(err => {
                        console.log(err)
                    });
                break;
            default:
                break
        }
    }
}