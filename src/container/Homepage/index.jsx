import React from 'react';
import {Link} from 'react-router-dom'
import {getData, setRootHistory} from '../../fetch/httpRequest'
import {HomePageUrls} from '../../service/homepage/homepageUrl'
import {IndexTodo} from './subpage/indexTodo'
import {IndexRemind} from './subpage/indexRemind'
import {IndexHeader} from './subpage/indexHeader'
import {IndexStaffs} from './subpage/indexStaffs'
import {IndexAccount} from './subpage/indexAccount'
import {showModal, cancelModal} from '../../utils/modal'
import {getConfig} from '../../utils/wxConfig'
import {getSessionItem, setSessionItem} from '../../utils/sessionStorage'

export class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.scroll_top = 0;
        this.header_init = 0;
        this.state = {
            modal_name: '',
            modal_in: '',
            show_modal: '',
            alert_title: '',
            alert_content: '',
            alert_id: 0,
            isLoading: true,
            header: {},
            todo_index: {
                notice_unread_total: 0,
                gen_bills: [],
                gen_salary: {},
                gen_commercial: [],
                incomplete_staff_total: 0,
                count: 1
            },
            unpaid_amount: {
                amount: 0,
                total: 0
            },
            bill_unorder: {
                total: 0
            },
            index_remind: {
                lately_birth_staff_total: 0,
                lately_entry_a_year_staff_total: 0,
                formal_staff_total: 0
            },
            fixed: '',
            has_unread_msg: {
                is_incomplete: 'complete',
            },
        };
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) &&
            (!getSessionItem('reload_step2') && !getSessionItem('pay') && !getSessionItem('pay_detail') && !getSessionItem('pic_detail'))) {
            getConfig.call(this, encodeURIComponent(window.location.href.split('#')[0]));
        }
        setRootHistory(this);
        document.title = '蚂蚁HR'
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className="full-h" style={{overflowY: 'auto'}}
                 onScroll={this.setFixedHeader.bind(this)}>
                <IndexHeader data={this.state.header}
                             scrollPage={this.scrollPage}
                             fixedHeader={this.state.fixed}
                             parent_this={this}
                />
                {
                    this.state.bill_unorder.total == 0 &&
                    this.state.todo_index.gen_bills.length === 0 &&
                    this.state.todo_index.gen_salary instanceof Array &&
                    this.state.todo_index.gen_commercial instanceof Array &&
                    this.state.todo_index.incomplete_staff_total == 0 &&
                    this.state.todo_index.notice_unread_total == 0
                        ? ''
                        : <IndexTodo data={this.state.todo_index} unorder={this.state.bill_unorder}/>
                }
                <IndexRemind data={this.state.index_remind}/>
                <IndexStaffs back_month={this.state.todo_index.back_op_month}/>
                <IndexAccount parent_this={this}/>

                {/*<div className="m-t-sm p-l p-r p-t-sm p-b-sm bg-white b-t b-b m-b-lg">*/}
                {/*更多功能*/}
                {/*</div>*/}
                <div className={`pos-f full-w modal  bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'fail'
                                ? <div className="bg-white p-a t-c">
                                <p className="m-b">{this.fail_msg}</p>
                                <button onClick={cancelModal.bind(this)} className="btn btn-sm">确定</button>
                            </div>
                                : ''
                        }
                        <div className={`bg-white p-b ${this.state.modal_name === 'alert' ? '' : 'hide'}`}>
                            <p className="p-a b-b t-md">{this.state.alert_title}</p>
                            <div className="p-a" id="alert-content" style={{maxHeight: '3rem', overflow: 'hidden'}}>
                                {/*{this.state.alert_content}*/}
                            </div>
                            <div className="p-l p-r p-t b-t">
                                <span><Link to={`/Notice/Detail/${this.state.alert_id}`}><i
                                    className="icon_arrow_right v-m grey"></i>了解详情</Link></span>
                                <span className="pull-right cursor"
                                      onClick={cancelModal.bind(this)}><i className="icon_close v-m grey t-sm"></i>关闭公告
                                </span>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        )
    }

    componentDidMount() {
        const homePageUrls = new HomePageUrls();
        let index_todo_data;
        let bill_unorder_data;
        let index_remind_data;
        let header;
        // 首页待办事项
        getData(homePageUrls.indexToBe())
            .then(res => {
                let count = this.state.count;
                count++;
                index_todo_data = Object.assign(res, count);
                this.header_init++;
                this.setState({
                    todo_index: index_todo_data
                });
                getData(homePageUrls.popAlert())
                    .then(res => {
                        console.log(res);
                        if (!(res instanceof Array)) {
                            let alert_content = this.htmlDecodeByRegExp(res.data.content);
                            this.setState({
                                alert_content: alert_content,
                                alert_title: res.data.title,
                                alert_id: res.data.id
                            });
                            document.getElementById('alert-content').innerHTML = alert_content;
                            showModal.call(this, 'alert', 'alert');
                        }
                    })
            })
            .catch(err => {
                console.log(err)
            });
        // 首页未生成订单数量
        getData(homePageUrls.billUnOrder())
            .then(res => {
                bill_unorder_data = res;
                this.header_init++;
                this.setState({
                    bill_unorder: {
                        total: bill_unorder_data.total
                    },
                });
                // this.header_init = this.header_init + 1;
            })
            .catch(err => {
                console.log(err)
            });
        //首页重要事项提醒
        getData(homePageUrls.indexRemind())
            .then(res => {
                index_remind_data = res;
                this.header_init++;
                this.setState({
                    index_remind: index_remind_data,
                });
                // console.log('header', this.header_init)
            })
            .catch(err => {
                console.log(err)
            });
        // 首页标题事项
        getData(homePageUrls.getIndexTop())
            .then(res => {
                header = res;
                this.header_init++;
                this.setState({
                    header: header,
                });

            })
            .catch(err => {
                console.log(err);
            });

    }

    scrollPage(parent_this, event) {
        if (event && parent_this.header_init === 4) {
            parent_this.scroll_top = event.offsetTop;
        }
    }

    setFixedHeader(event) {
        if (this.scroll_top <= event.target.scrollTop && this.state.fixed === '') {
            this.setState({
                fixed: 'fixed'
            });
        } else if (this.scroll_top > event.target.scrollTop && this.state.fixed === 'fixed') {
            this.setState({
                fixed: ''
            })
        }
    }

    htmlDecodeByRegExp(str) {
        let s = '';
        if (str.length == 0) return '';
        s = str.replace(/&amp;/g, '&');
        s = s.replace(/&lt;/g, '<');
        s = s.replace(/&gt;/g, '>');
        s = s.replace(/&nbsp;/g, ' ');
        s = s.replace(/&#39;/g, '\'');
        s = s.replace(/&quot;/g, '\'');
        return s;
    }
}