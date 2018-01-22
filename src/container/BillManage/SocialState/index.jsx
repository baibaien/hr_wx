// 五险一金操作状态
import React from 'react';
import {Link} from 'react-router-dom'
import {getData} from '../../../fetch/httpRequest';
import {BillManageUrls} from '../../../service/billManageApi/billManageUrl'
import {dateTransformToMonth} from '../../../utils/dateTransform'
import {onTouchStart, onTouchEnd, onScrollEnd, getScrollStyle, getTips, onScroll, onPullUp} from '../../../utils/scroll'

export class SocialState extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.state = {
            list: [],
            //员工类型1：在职;2: 离职
            status: 1,
            meta: {},
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            open: {}
        };

        this.page = 1;
        this.is_touching = false;
        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
        document.title = '五险一金缴纳状态';
    }

    render() {
        return (
            <div className="full-h" style={{paddingTop: '.5rem'}}>
                <div className="p-a bg-white b-b shadow-bottom" style={{marginTop: '-.5rem'}}>
                    <span onClick={() => this.props.history.goBack()}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right">
                        <span className={this.state.status === 1 ? `active m-r` : 'grey m-r'}
                              onClick={this.toggleState.bind(this, 1)}>在职</span>
                        <span onClick={this.toggleState.bind(this, 2)}
                              className={this.state.status === 2 ? 'active' : 'grey'}>离职</span>
                    </span>
                </div>
                <div className="full-h" style={{paddingTop: '.3rem'}}>
                    {
                        this.state.list.length === 0
                            ? ''
                            : <h6 className="title" style={{marginTop: "-.3rem"}}>订单包含员工服务进度</h6>
                    }
                    <div className=" b-t b-b full-h">
                        <div id="scroll" style={getScrollStyle().scroll}
                             onTouchStart={onTouchStart.bind(this)}
                             onTouchEnd={onTouchEnd.bind(this)}>
                            <div style={getScrollStyle().wrapper} className="">
                                {
                                    this.state.list.length === 0
                                        ? <div className="p-a t-c">
                                        <img src="/src/assets/image/none.svg" alt=""/>
                                    </div>
                                        : <ul className="detail bg-white">
                                        {
                                            this.state.list.map((item, index) => {
                                                return (
                                                    <li className="p-b-sm clearfix" key={index}>
                                                        <Link to={{
                                                            pathname: '/Bill/SocialState/Detail',
                                                            state: item.yg_id
                                                        }}>
                                                            <span className="ellipsis"
                                                                  style={{width: '.6rem'}}>{item.yg_name}</span>
                                                            <div className="pull-right m-l-xs">
                                                                <i className="icon_right_triangle"></i>
                                                            </div>
                                                            <div className="d-ib w-200 pull-right">
                                                                <p className={item.fund_time ? 'grey t-sm t-r' : 'grey t-sm t-r'}>
                                                                    公积金{item.fund_time ? `（${item.fund_time}）` : ''}{item.fund_op || '未缴纳'}</p>
                                                                {/*<p className={item.social_time ? 'grey t-sm t-r' : 'hide'}>*/}
                                                                <p className={item.social_time ? 'grey t-sm t-r' : 'grey t-sm t-r'}>

                                                                    社保{item.social_time ? `（${item.social_time}）` : ''}{item.social_op || '未缴纳'}</p>
                                                            </div>

                                                        </Link>
                                                    </li>
                                                )
                                            })
                                        }
                                        <li className="t-c pos-a full-w  grey"
                                            style={{
                                                background: '#eee',
                                                textShadow: '1px 1px #fff',
                                                height: '.3rem',
                                                bottom: '',
                                                padding: '.05rem 0 0',
                                                left: 0
                                            }}>
                                            {getTips.call(this, this.no_more)}
                                        </li>
                                    </ul>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.getSocialState(), {
            status: 1,
            pagesize: 20
        })
            .then(res => {
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    list: res.data.list,
                    meta: res.meta,
                    status: 1
                });
                const options = {
                    // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
                    preventDefault: false,
                    zoom: false,
                    bounce: true,
                    scrollBarY: true,
                    scrollBarFade: true
                };

                this.Jroll = new JRoll(`#scroll`, options);
                this.Jroll.on('scroll', onScroll.bind(this));
                this.Jroll.on('scrollEnd', onScrollEnd.bind(this));
                this.Jroll.refresh();
            });

    }

    getList(status, refresh = false) {
        this.page = refresh ? 1 : this.page;
        getData(this.billManageUrls.getSocialState(), {
            pagesize: 20,
            status: status,
            page: this.page
        })
            .then(res => {
                let list = refresh ? res.data.list : this.state.list.concat(res.data.list);
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    list: list,
                    meta: res.meta,
                    status: status
                });
                this.Jroll.refresh();
            });
    }

    toggleState(status) {
        this.getList(status, true);
        this.Jroll.scrollTo(0, 0)
    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.getList(this.state.status)
    }
}