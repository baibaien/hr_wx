import React from 'react'
import JRoll from 'jroll/build/jroll.min'
import {Search} from '../../../../components/Search/index'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {CommonUrls} from '../../../../service/commonUrl'
import {getData, postData} from '../../../../fetch/httpRequest'
import {onTouchEnd, onTouchStart, onScrollEnd, onScroll, getTips, getScrollStyle} from '../../../../utils/scroll'

export class Bank extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.page = 1;
        this.is_touching = false;
        this.no_more = false;
        this.init = true;
        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
        // // 组件滚动中监测数值。
        // this.onScroll = this.onScroll.bind(this);
        // // 组件滚动结束时触发
        // this.onScrollEnd = this.onScrollEnd.bind(this);
        // this.onTouchStart = this.onTouchStart.bind(this);
        // this.onTouchEnd = this.onTouchEnd.bind(this);
        this.search_data = '';
        this.staffsUrls = new StaffsUrls();
        this.commonUrls = new CommonUrls();
        this.default_bank = JSON.parse(sessionStorage.getItem('default_bank')) || [];
        this.default_bank = this.default_bank.length > 0 ? this.default_bank.map(item => JSON.parse(item)) : [];
        this.state = {
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度s
            y: 0,
        }
    }

    render() {
        // 判断此页应该展示银行还是分行信息
        let banks = this.props.bank_type ? this.props.default_sub_bank : this.props.default_bank;
        return (
            <div className="clearfix full-h" style={{paddingTop: '.5rem'}}>
                <div className="pos-f bg-white p-l p-r b-b shadow-bottom"
                     style={{left: 0, right: 0, top: 0, lineHeight: '.5rem'}}>
                    <Search onSearch={this.props.bank_type ? this.searchSubBank : this.searchBank}
                            onRefreshPage={this.getBank}
                            goBack={() => {
                                this.props.parent_this.setState({show_bank: false})
                            }}
                            setting={
                                {
                                    parent_this: this,
                                    refresh_url: '',
                                    placeholder: '输入银行关键字进行搜索',
                                    reset_data: []
                                }
                            }
                    />
                </div>
                <div id="scroll" style={getScrollStyle().scroll}
                     onTouchStart={this.props.bank_type ? onTouchStart.bind(this) : ''}
                     onTouchEnd={this.props.bank_type ? onTouchEnd.bind(this) : ''}>
                    <div style={getScrollStyle().wrapper}>
                        {
                            banks.length === 0 && !this.init
                                ? <div className="p-a t-c">
                                <img src="/src/assets/image/none.svg" alt=""/>
                            </div>
                                : <ul className="b-b">
                                {
                                    banks.map((item, index) => {
                                        return (
                                            <li className="t-l bg-white b-t p-a" key={index}
                                                onClick={this.props.selectBank.bind(this.props.parent_this, item, this.props.bank_type)}>
                                                {item.bank_name}
                                            </li>
                                        )
                                    })
                                }
                                {
                                    this.props.bank_type
                                        ? <li className="t-c pos-a full-w grey"
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
                                        : ''
                                }
                            </ul>
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        const options = {
            // 默认iscroll会拦截元素的默认事件处理函数，需要响应onClick，因此要配置
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
        if (this.props.bank_type && this.props.default_sub_bank.length > 0) {
            this.searchSubBank(this, this.search_data);
        }
    }


    componentDidUpdate() {
    }

    componentWillUnmount() {
        // document.removeEventListener('touchmove', () => {
        //     event.preventDefault()
        // }, false);
    }

    searchBank(parent_this, data, reset_fresh = false) {
        let sumbit_data = {pagesize: 20, name: data};
        parent_this.init = false;
        postData(parent_this.props.parent_this.commonUrls.getBank(), sumbit_data)
            .then(res => {
                parent_this.props.parent_this.setState({
                    default_bank: res.data,
                    name: data
                });

            })
    }

    searchSubBank(parent_this, data, reset_fresh = false) {
        //需要保存search data，以便加载更多里继续传输数据
        parent_this.search_data = data;
        //page数据储存在当前上下文
        parent_this.page = reset_fresh ? 1 : parent_this.page;
        parent_this.init = false;
        let sumbit_data = {
            page: parent_this.page,
            pagesize: 20,
            name: data,
            bank_id: parent_this.props.parent_this.state.miss_info.bank_code
        };
        postData(parent_this.commonUrls.getSubBank(), sumbit_data)
            .then(res => {
                let default_sub_bank = parent_this.props.parent_this.state.default_sub_bank;
                default_sub_bank = reset_fresh ? res.data : default_sub_bank.concat(res.data);
                res.meta.pagination.total_pages <= this.page ? this.no_more = true : false;
                parent_this.props.parent_this.setState({
                    default_sub_bank: default_sub_bank
                });
                parent_this.Jroll.refresh();
                parent_this.Jroll.scrollTo(0, 0);

            })
    }

    getBank(parent_this) {
        if (parent_this.props.bank_type) {
            parent_this.searchSubBank(parent_this);
        } else {
            parent_this.searchBank(parent_this);
        }
    }
}