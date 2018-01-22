import React from 'react'
import {Link} from 'react-router-dom'
import {NoticeUrls} from '../../../service/Notice/noticeUrl'
import {getData} from '../../../fetch/httpRequest'
import { onScroll, onScrollEnd, onTouchStart, onTouchEnd, getScrollStyle, getTips} from '../../../utils/scroll'


export class NotIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.noticeUrls = new NoticeUrls();
        this.page = 1;
        this.is_touching = false;
        this.no_more = false;
        this.state = {
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            list: [],
        };
        this.page = 1;
        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
        document.title = '通知'
    }

    render() {
        return (
            <div className="full-h" style={{paddingTop: '.7rem'}}>
                <div className="bg-white b-b p-a" style={{marginTop: '-.7rem'}}>
                    <span className="cursor" onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right" onClick={this.setAllRead.bind(this)}><i className="icon_done_batch grey v-m"></i>全部标记为已读
                    </span>
                </div>
                <div className="m-t-sm b-t b-b " style={getScrollStyle().scroll}
                     onTouchStart={onTouchStart.bind(this)}
                     onTouchEnd={onTouchEnd.bind(this)}
                     id="scroll">
                    <div style={getScrollStyle().wrapper}>
                        <ul className="detail bg-white">
                            {
                                this.state.list.map((item, index) => {
                                    return (
                                        <li className="p-l" key={index}>
                                            <Link to={`/Notice/Detail/${item.id}`}>
                                                <h6 className="t-md m-b-xs">
                                                    <span className="bold ">{item.title}</span>
                                                    <span className="pull-right"><i
                                                        className="icon_right_triangle t-md"></i></span>
                                                    <span className="pull-right grey t-sm">{item.create_time}</span>
                                                </h6>
                                                <p className="grey pos-r">
                                                    <span className={item.status == 1 ? 'pos-a' : 'hide'}
                                                          style={
                                                              {
                                                                  left: '-.1rem',
                                                                  width: '.08rem',
                                                                  top:'.06rem',
                                                                  lineHeight: '.2rem',
                                                                  height: '.08rem',
                                                                  borderRadius: '.08rem',
                                                                  background: 'red'
                                                              }
                                                          }>
                                            </span>
                                                    <span id={`summary-${index}`}></span>
                                                </p>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                            <li className="t-c pos-a full-w grey"
                                style={{
                                    textShadow: '1px 1px #f3f3f3',
                                    height: '.3rem',
                                    bottom: '',
                                    padding: 0,
                                    left: 0,
                                    background: '#eee'
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
        getData(this.noticeUrls.getNoticeList(), {size: 20, page: this.page})
            .then(res => {
                let summary = res.data.map(item => this.htmlDecodeByRegExp(item.summary));
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    list: res.data
                });
                summary.forEach((item, index) => {
                   document.getElementById(`summary-${index}`).innerHTML= item;
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

    getList(fresh = false) {
        this.page = fresh ? 1 : this.page;
        getData(this.noticeUrls.getNoticeList(), {size: 20, page: this.page})
            .then(res => {
                let list = fresh ? res.data : this.state.list.concat(res.data);
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    list: list
                });
                this.Jroll.refresh();
            })

    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.getList()
    }
    setAllRead() {
        getData(this.noticeUrls.setAllRead())
            .then(res => {
                this.getList(true);
            })
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