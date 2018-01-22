import React from 'react';
import {getData} from '../../../../fetch/httpRequest'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {Search} from '../../../../components/Search/index'
import {clearSessionItem, setSessionItem} from '../../../../utils/sessionStorage'
import {onTouchStart, onTouchEnd, getScrollStyle, getTips, onScrollEnd, onScroll} from '../../../../utils/scroll'

//补全员工信息部分涉及信息页之间跳转，因此在session中设置了员工id,及银行证件等信息,需要在此页面中清除缓存
export class CompleteMsgIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.staffsUrls = new StaffsUrls();
        this.no_more = false;
        this.page = 1;
        this.is_touching = false;
        this.search_data = {search: ''};
        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
        this.state = {
            next_step: '/completestaffmsg/step1/2',
            staffs: [],
            show_search: false,
            search_data: {
                search: ''
            },
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
        }
        const clear = ['yg_id', 'img_urls', 'hospitals', 'select_bank', 'select_sub_bank'];
        clear.forEach((item) => clearSessionItem(item));
    }

    render() {
        return (
            <div style={{paddingTop: '.6rem'}} className="full-h">
                <div className="pos-f bg-white p-l p-r b-b shadow-bottom"
                     style={{left: 0, right: 0, top: 0, lineHeight: '.5rem'}}>
                    <Search onSearch={this.searchStaff}
                            onRefreshPage={this.searchStaff}
                            goBack={() => {
                                this.props.history.replace('/Index')
                            }}
                            setting={
                                {
                                    parent_this: this,
                                    placeholder: '输入员工姓名进行搜索',
                                    reset_data: []
                                }
                            }
                    />
                </div>
                <div className="b-t"
                     style={getScrollStyle().scroll}
                     onTouchStart={onTouchStart.bind(this)}
                     onTouchEnd={onTouchEnd.bind(this)}
                     id="scroll">
                    <div style={getScrollStyle().wrapper}>
                        <ul
                            className={`${this.state.show_search ? 'hide' : ''} bg-white detail  b-b`}>
                            {
                                this.state.staffs.map((item, index) => {
                                    return (
                                        <li key={index}
                                            onClick={() => {
                                                setSessionItem('yg_id', item.yg_id);
                                                this.props.history.push({
                                                    pathname: `/CompleteStaffMsg/step${item.is_show_status ? 1 : 2}/`,
                                                    state: item
                                                })
                                            }}>
                                            <span>{item.yg_name} <i
                                                className={`${item.yg_is_wechat ? '' : 'hide'}  green icon_wechat`}></i></span>
                                            <div className="grey t-sm pull-right">
                                                {item.miss_info}
                                                <span className="m-l-sm v-m"><i
                                                    className="icon_right_triangle"></i></span>
                                            </div>
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
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        getData(this.staffsUrls.getUnCompelteStaffs(), {pagesize: 20, page: this.page})
            .then(res => {
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    staffs: res.data
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
            })

    }

    searchStaff(parent_this, params = '', refresh = false) {
        parent_this.page = refresh ? 1 : parent_this.page;
        parent_this.search_data = {search: params, pagesize: 20, page: parent_this.page};
        getData(parent_this.staffsUrls.getUnCompelteStaffs(), parent_this.search_data)
            .then(res => {
                let staffs = refresh ? res.data : parent_this.state.staffs.concat(res.data);
                parent_this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                parent_this.setState({
                    show_search: false,
                    staffs: staffs
                });
                parent_this.Jroll.refresh();
            })
    }

    showSearch() {
        this.setState({
            show_search: true
        });
    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.searchStaff(this, this.search_data.search)
    }


    componentWillUnmount() {
    }
}