import React from 'react';
import {Link} from 'react-router-dom'
import {getSessionItem} from '../../../utils/sessionStorage'
import {dateTransform} from '../../../utils/dateTransform'
import JRoll from 'jroll/build/jroll.min'
import {onScroll, onTouchEnd, onTouchStart, onScrollEnd, getTips, getScrollStyle} from '../../../utils/scroll'

export class BillList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.path = getSessionItem('bill_type') === '1'
            ? `/Bill/Pay`
            : `/Bill/Detail`;

        this.page = 1;
        this.is_touching = false;
        this.state = {
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            open: {}
        };

        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
    }

    render() {
        const deleteObj = {
            width: '.5rem',
            lineHeight: '.55rem',
            marginLeft: '.15rem',
            textAlign: 'center',
            padding: '.15rem',
            marginTop: '-.15rem'
        };
        const list_style = {
            height: '.55rem',
            whiteSpace: 'nowrap',
            transition: 'all .2s ease-out',
            transform: `translate(0px, 0px) translateZ(0px) scale(1)`,
            touchAction: 'none'
        };
        return (
            <div className="full-h pos-r">
                <div id="scroll" style={getScrollStyle().scroll}
                     onTouchStart={onTouchStart.bind(this)}
                     onTouchEnd={onTouchEnd.bind(this)}>
                    <div style={getScrollStyle().wrapper} className="">
                        <ul className="detail b-t b-b bg-white"
                        >
                            {
                                this.props.data.bills.map((item, index) => {
                                    return (
                                        <li key={index} className={`p-b-sm`}
                                            style={this.swipe_index === index ? Object.assign(list_style, {}) : Object.assign(list_style, this.state.open)}
                                        >
                                            <div className="clearfix full-w d-ib">
                                                <div
                                                    className={this.props.data.edit ? 'hide' : 'pull-right p-t m-l-sm'}>
                                                    <Link to={{
                                                        pathname: getSessionItem('bill_type') === '1' ? this.path : `${this.path}/${item.order_id}`,
                                                        state: item
                                                    }}>

                                                        <i className="icon_right_triangle"></i>
                                                    </Link>
                                                </div>
                                                {
                                                    this.props.deleteItem
                                                        ? <span
                                                        className={this.props.data.edit ? 'pull-right p-t m-l-sm' : 'hide'}
                                                        onClick={this.props.deleteItem.bind(this.props.data.parent_this, item.order_id)}><i
                                                        className="icon_error error"></i></span>
                                                        : ''
                                                }

                                                <div className="m-r">
                                                    <div className="m-b-sm"><span
                                                        className="t-sm grey">订单编号{item.order_id}</span><span
                                                        className="pull-right t-sm grey">下单于{dateTransform(item.add_time ? item.add_time : item.addtime)}</span>
                                                    </div>
                                                    <div >
                                                        <span className=" ellipsis"
                                                              style={{width: '1.5rem'}}>{item.title}</span>
                                                        <span className="pull-right">{item.all_money}</span>
                                                    </div>
                                                </div>


                                            </div>
                                        </li>
                                    )
                                })
                            }
                            {
                                this.props.data.bills.length === 0 && !this.props.data.init
                                    ? <li>
                                    <div className="p-a t-c">
                                        <img src="/src/assets/image/none.svg" alt=""/>
                                    </div>
                                </li>
                                    : <li className="t-c pos-a full-w  grey"
                                          style={{
                                              background: '#eee',
                                              textShadow: '1px 1px #fff',
                                              height: '.3rem',
                                              bottom: '',
                                              padding: '.05rem 0 0',
                                              left: 0
                                          }}>
                                    {getTips.call(this, this.props.data.no_more)}
                                </li>
                            }

                        </ul>
                    </div>
                </div>
            </div>

        )
    }

    componentDidMount() {
        // if (this.props.data.bills.length > 0) {
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

    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.props.loadMore(this.props.data.parent_this, this.page);
    }


    componentDidUpdate() {
        this.Jroll.refresh();
        return true;
    }

    componentWillUnmount() {
    }
}
