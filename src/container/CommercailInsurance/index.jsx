import React from 'react';
import {Switch, Route, Link} from 'react-router-dom'
import JRoll from 'jroll/build/jroll.min'
import {getData} from '../../fetch/httpRequest'
import {getSessionItem, setSessionItem, clearSessionItem} from '../../utils/sessionStorage'
import {showModal, cancelModal} from '../../utils/modal'
import {BillManageUrls} from '../../service/billManageApi/billManageUrl'
import {CommercialDetail} from './CommercialDetail/index'
import {CommercialPlan} from './CommercialPlan/index'
import {Search} from '../../components/Search/index'
import {onTouchStart, onTouchEnd, getScrollStyle, getTips, onScrollEnd, onScroll} from '../../utils/scroll'


class Commercial extends React.Component {
    // 商保操作月参数从首页传入，
    // 但是整个页面要跳来跳去编辑商方案特别麻烦，
    // 只能存在session里，回到首页时或者生成账单时再删
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.no_more = false;
        this.page = 1;
        this.is_touching = false;
        this.current_month = new Date();
        this.search_data = '';
        this.init = true;
        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
        this.state = {
            commercial_list: [],
            show_settings: '',
            modal_in: '',
            modal_name: '',
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            meta: {
                yg_list: {
                    commercial: []
                }
            }
        };
        if (!getSessionItem('commercial_month')) {
            setSessionItem('commercial_month', this.props.location.state.op_month)
        }
        document.title = '计算商保账单'
    }

    render() {
        return (
            <div style={{paddingBottom: '1.6rem', paddingTop: '.6rem'}} className="full-h">
                <div className="pos-f bg-white p-l p-r b-b shadow-bottom"
                     style={{left: 0, right: 0, top: 0, lineHeight: '.5rem'}}>
                    <Search onSearch={this.searchYg}
                            onRefreshPage={this.getCommercialOrder}
                            goBack={() => {
                                clearSessionItem('commercial_month');
                                this.props.history.replace('/Index')
                            }}
                            setting={
                                {
                                    parent_this: this,
                                    // refresh_url: this.staffUrls.staffList(),
                                    placeholder: '输入员工姓名进行搜索',
                                    reset_data: ['orgs', 'title']
                                }
                            }
                    />
                </div>
                <div className={`p-a t-c ${this.state.commercial_list.length === 0 && !this.init ? '' : `hide`}`}>
                    <img src="/src/assets/image/none.svg" alt=""/>
                </div>
                <div
                    className={`b-t b-b full-h shadow-bottom ${this.state.commercial_list.length === 0 && !this.init ? 'hide' : ''}`}
                    style={{paddingTop: '.5rem'}}>
                    <div className="p-a b-b bg-white " style={{marginTop: '-.5rem'}}>
                        <span className="grey">员工姓名</span>
                        <span className="pull-right p-r-lg d-ib t-c" style={{width: '1.8rem'}}>商保购买</span>
                    </div>
                    <div style={getScrollStyle().scroll}
                         onTouchStart={onTouchStart.bind(this)}
                         onTouchEnd={onTouchEnd.bind(this)}
                         id="scroll">
                        <div style={getScrollStyle().wrapper} className="full-w">
                            <ul className="bg-white">
                                {
                                    this.state.commercial_list.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={this.getStatus.call(this, item)['status'] > -1 ? 'p-a b-b' : 'bg-grey p-a b-b'}>

                                                <span>{item.yg_name}</span>
                                                <span className="pull-right p-r-lg pos-r t-c"
                                                      style={{width: '1.8rem'}}>
                                            <i className={this.getStatus.call(this, item)['status'] >= -1 ? this.getStatus.call(this, item)['content'] : 'hide'}
                                               style={{verticalAlign: 'middle'}}> </i>
                                                    {
                                                        this.getStatus.call(this, item)['status'] <= -2
                                                            ? this.getStatus.call(this, item)['content']
                                                            : ''
                                                    }

                                                    <Link to={{
                                                        pathname: `/Commercial/Detail`,
                                                        state: item
                                                    }}>
                                                        <span
                                                            className={this.getStatus.call(this, item)['status'] < 0 || this.getStatus.call(this, item)['status'] > 1 ? 'hide' : 'pull-right'}
                                                            style={{width: '.1rem', marginRight: '-.1rem'}}>
                                    <i className="icon_right_triangle"></i>
                                                        </span>
                                                    </Link>
                                                </span>
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
                <div className="footer shadow-top b-t pos-f full-w bg-white"
                     style={{left: 0, bottom: 0, height: '1.35rem', zIndex: 1}}>
                    <p className="p-a b-b cursor"
                       onClick={this.toggleOrder.bind(this)}>账单中将包含的员工 <span className="pull-right ">
                        <span
                            className={`label m-r-sm ${this.state.meta.yg_list.commercial.length === 0 ? 'disabled' : 'success'}`}>{this.state.meta.yg_list.commercial.length}</span>
                        {/*{*/}
                            {/*this.no_more*/}
                                {/*? <i className="icon_angle_up"> </i>*/}
                                {/*: ''*/}
                        {/*}*/}
                    </span>
                    </p>
                    <div className="p-a">
                        {/*<p className="t-sm grey t-c m-b">注意：列表中只罗列了当月在职的员工</p>*/}
                        <button
                            className={`btn full-w cursor ${this.state.meta.yg_list.commercial.length === 0 ? 'disabled' : ''}`}
                            onClick={this.createOrder.bind(this, {
                                type: 4,
                                // month: this.state.meta.current_month
                            })}>生成{this.current_month.getMonth() + 1}月商保账单
                        </button>
                    </div>
                </div>
                <div className={`pos-f cursor full-w modal bottom ${this.state.show_modal}`}
                     onClick={cancelModal.bind(this)}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        <div className="p-a b-b bg-white ">
                            <span className="grey">员工姓名</span>
                            <span className="pull-right p-r-lg d-ib t-c" style={{width: '1.8rem'}}>商保购买</span>
                        </div>
                        {/*<div style={{*/}
                            {/*maxHeight: '3rem',*/}
                            {/*marginBottom: '1.75rem',*/}
                            {/*overflowY: 'auto',*/}
                            {/*overflowX: 'hidden'*/}
                        {/*}}>*/}
                            {/*{*/}
                                {/*this.state.modal_name === 'team'*/}
                                    {/*? <ul className="detail bg-white">*/}
                                    {/*{*/}
                                        {/*this.state.commercial_list.filter((item) => {*/}
                                            {/*return this.state.meta.yg_list.commercial.indexOf(item.yg_id) >= 0*/}
                                        {/*}).map((item, index) => {*/}
                                            {/*return (*/}
                                                {/*<li key={index}>*/}
                                                    {/*<span>{item.yg_name}</span>*/}
                                                    {/*<span className="pull-right p-r-lg pos-r t-c"*/}
                                                          {/*style={{width: '1.8rem'}}>*/}
                                                        {/*<i className={this.getStatus.call(this, item)['status'] >= -1 ? this.getStatus.call(this, item)['content'] : 'hide'}*/}
                                                           {/*style={{verticalAlign: 'middle'}}> </i>*/}
                                                        {/*{*/}
                                                            {/*this.getStatus.call(this, item)['status'] < -1*/}
                                                                {/*? this.getStatus.call(this, item)['content']*/}
                                                                {/*: ''*/}
                                                        {/*}*/}
                            {/*</span>*/}
                                                    {/*<Link to={{*/}
                                                        {/*pathname: `/Commercial/Detail`,*/}
                                                        {/*state: item*/}
                                                    {/*}}>*/}
                                                        {/*<span className="pos-a" style={{right: 0}}>*/}
                                    {/*<i className={(this.getStatus.call(this, item)['status'] < 0 || this.getStatus.call(this, item)['status'] > 1) ? 'hide' : "icon_right_triangle"}></i>*/}
                                {/*</span>*/}
                                                    {/*</Link>*/}
                                                {/*</li>*/}
                                            {/*)*/}
                                        {/*})*/}
                                    {/*}*/}
                                {/*</ul>*/}
                                    {/*: ''*/}
                            {/*}*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

        )
    }

    componentDidMount() {
        let data
        data = {
            pagesize: 20,
            page: this.page,
            month: getSessionItem('commercial_month')
        };
        getData(this.billManageUrls.getGzList(), data)
            .then((res) => {

                this.init = false;
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    commercial_list: res.data,
                    meta: res.meta,
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

    createStateArr(obj) {
        return [obj[`yg_is_commercial_status`],
            obj[`yg_is_commercial_stop`],
            obj[`yg_is_commercial_edit`],
            obj[`yg_is_commercial`]
        ]
    }

    getStatus(obj) {
        return this.judgeStaus(this.createStateArr(obj));
    }

    // 判断商保状态码
    judgeStaus(item_arr) {
        //index: 0:状态 status，1：是否允许操作 stop，2：是否可编辑 edit，3：是否使用公司业务
        if (item_arr[0] === 0) {
            if (item_arr[1] === 0) {
                if (item_arr[3] === 0) {
                    // 不使用公司业务 -
                    if (item_arr[2] === 0) {
                        //不可编辑
                        return {content: 'icon_minus grey', status: -0.1}
                    } else {
                        //可编辑
                        return {content: 'icon_minus grey', status: 0.1}
                    }
                    // return {content: 'icon_minus grey', status: 0}
                } else if (item_arr[2] === 1 && item_arr[3] === 1) {
                    // 使用公司业务并可编辑
                    return {content: 'green icon_done', status: 1}
                } else if (item_arr[2] === 0 && item_arr[3] === 1) {
                    // 使用公司业务当前不可编辑
                    return {content: 'icon_done grey', status: 2}
                }
            } else {
                // -1禁用
                return {content: 'icon_forbid grey', status: -1}
            }
        } else if (item_arr[0] === 1) {
            return {content: '未开始受理', status: -2}

        } else if (item_arr[0] === -1) {
            return {content: '已截止受理', status: -3}
        }
    }

    createOrder(params) {
        // const url = parent_this.billManageUrls.createBill();
        if (this.state.meta.yg_list.commercial.length !== 0) {
            getData(this.billManageUrls.createBill(), params)
                .then((res) => {
                        clearSessionItem('commercial_month');
                        this.props.history.push('/Bill/UnbillOrder')
                    }
                )
                .catch(err => {
                    console.log(err)
                });
        }

    }

    getCommercialOrder(parent_this, params = '', refresh = false) {
        let data
        parent_this.page = refresh ? 1 : parent_this.page;
        // params = refresh ? '' : params;
        parent_this.search_data = params;
        data = {
            pagesize: 20,
            page: parent_this.page,
            search: params,
            month: getSessionItem('commercial_month')
        };
        getData(parent_this.billManageUrls.getGzList(), data)
            .then((res) => {
                let commercial_list = parent_this.state.commercial_list;
                commercial_list = refresh ? res.data : commercial_list.concat(res.data);
                parent_this.init = false;
                parent_this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                parent_this.setState({
                    commercial_list: commercial_list,
                    meta: res.meta,
                });
                parent_this.Jroll.refresh();
            })
    }

    searchYg(parent_this, params) {
        parent_this.search_data = params;
        parent_this.getCommercialOrder(parent_this, params, true);
        parent_this.Jroll.scrollTo(0, 0);

    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.getCommercialOrder(this, this.search_data);

    }

    toggleOrder() {
        // 此功能暂时关闭
        // if (this.state.meta.yg_list.commercial.length !== 0 && this.no_more) {
        //     if (this.state.modal_name === '') {
        //         showModal.call(this, 'team')
        //     } else if (this.state.modal_name === 'team') {
        //         cancelModal();
        //     }
        // }

    }
}

export class CommercialIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            // 商保
            <Switch>
                <Route path='/Commercial' exact component={Commercial}/>
                <Route path='/Commercial/detail' exact component={CommercialDetail}/>
                <Route path='/Commercial/plan' exact component={CommercialPlan}/>
            </Switch>
        )
    }
}