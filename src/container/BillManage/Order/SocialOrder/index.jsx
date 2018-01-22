import React from 'react'
import {Link} from 'react-router-dom'
import JRoll from 'jroll/build/jroll.min'
import {BillManageUrls} from '../../../../service/billManageApi/billManageUrl'
import {getData, postData} from '../../../../fetch/httpRequest'
import {Search} from '../../../../components/Search/index'
import {dateTransformToMonth} from '../../../../utils/dateTransform'
import {swipeOption, swipeBack} from '../../../../utils/swipe'
import {onTouchStart, onTouchEnd, getScrollStyle, getTips, onScrollEnd, onScroll} from '../../../../utils/scroll'


export class SocialOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.init = true;
        this.state = {
            gz_data: [],
            meta: {
                op_month: {},
                yg_list: {
                    socialFund: []
                }
            },
            key_word: ['social', 'fund'],
            current_item: {},
            show_modal: '',
            modal_name: '',
            modal_in: '',
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            open: {},
            options_list_social: [],
            options_list_fund: [],
            current_edit: -1,
            left_style: {}
        };
        this.no_more = false;
        this.page = 1;
        this.is_touching = false;
        this.search_data = '';
        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
        document.title = '计算五险一金账单'
    }

    render() {
        const handle_style = {
            right: '-2rem',
            width: '2rem',
        };
        return (
            <div style={{paddingBottom: '1.6rem', paddingTop: '.6rem'}} className="full-h">
                <div className="pos-f bg-white p-l p-r b-b shadow-bottom" style={{left: 0, right: 0, top: 0}}>
                    <div className={`pull-right bg-white t-r cursor `}
                         style={{height: '.5rem', width: '.5rem', lineHeight: '.5rem'}}
                         onClick={this.toggleEdit.bind(this)}>
                        {
                            this.state.edit
                                ? <button className="btn btn-sm m-t-sm">保存</button>
                                : <span className=""><i className="icon_edit_simple v-m t-sm grey m-r-xs"></i>
                            编辑</span>
                        }
                    </div>
                    <div className={this.state.edit ? 'hide' : ''}
                         style={{marginRight: '.6rem', height: '.5rem', lineHeight: '.5rem'}}>
                        <Search onSearch={this.searchYg}
                                onRefreshPage={this.getStaffList}
                                goBack={() => {
                                    this.props.history.push('/Index')
                                }}
                                setting={
                                    {
                                        parent_this: this,
                                        placeholder: '输入员工姓名进行搜索',
                                        reset_data: []
                                    }
                                }/>
                    </div>
                </div>

                <div className={`p-a t-c ${this.state.gz_data.length === 0 && !this.init ? '' : 'hide'}`}>
                    <img src="/src/assets/image/none.svg" alt=""/>
                </div>
                <div className={`full-h b-b pos-r ${this.state.gz_data.length === 0 && !this.init ? 'hide' : ''}`}
                     style={{paddingTop: '.5rem'}}>
                    <div className="pos-a full-w b-b shadow-bottom bg-white"
                         style={{left: 0, right: 0, top: 0, height: '.5rem'}}>
                        <ul style={{fontSize: 0}} className="p-t-sm p-b-sm p-r ">
                            <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                className="d-ib t grey t-l border-box">
                                <span>员工姓名</span>
                            </li>
                            <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                className="d-ib t grey t-l border-box">
                                <span>缴纳城市</span>
                            </li>
                            <li style={{width: '20%', padding: '5px 5px 5px .12rem'}}
                                className="d-ib t grey t-l border-box">
                                <span>社保</span>
                            </li>
                            <li style={{width: '20%', padding: '5px 5px 5px .12rem'}}
                                className="d-ib t grey t-l border-box">公积金
                            </li>
                            <li style={{width: '5%', padding: '5px 5px 5px .12rem'}}
                                className="d-ib t grey t-l border-box">
                            </li>
                        </ul>
                    </div>
                    <div style={getScrollStyle().scroll}
                         onTouchStart={onTouchStart.bind(this)}
                         onTouchEnd={onTouchEnd.bind(this)}
                         id="scroll">
                        <div style={getScrollStyle().wrapper}>
                            <div className={this.state.current_edit > -1 ? 'mask' : 'hide'}
                                 onClick={swipeBack.bind(this)}>
                            </div>
                            <ul className="full-w bg-white">
                                {
                                    this.state.gz_data.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`b-t pos-r swipe-option p-r
                                                    ${this.getStatus.call(this, item)[1].status < -1 || (this.getStatus.call(this, item)[1].status === -1 && this.getStatus.call(this, item)[0].status === -1) ? 'bg-grey' : ''}
                                                    `}
                                                style={item.yg_id === this.state.current_edit ? this.state.left_style : {}}
                                            >
                                                <ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">
                                                    <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                                        className="d-ib t-sm t-l border-box v-t ellipsis">
                                                        <span>{item.yg_name}</span>
                                                    </li>
                                                    <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                                        className="d-ib t-sm t-l border-box v-t ellipsis">
                                                        <span>{item.yg_city_name}</span>
                                                    </li>
                                                    <li style={{width: '20%', padding: '5px 5px 5px .12rem'}}
                                                        className="d-ib t-sm grey t-l border-box v-t">
                                                            <span
                                                                className={this.getStatus.call(this, item)[0].status >= -1 ? '' : 'hide'}>
                                                                <i className={this.getStatus.call(this, item)[0].status === 2 ? 'icon_done green' : ''}> </i>
                                                                <i className={this.getStatus.call(this, item)[0].status === 1 ? 'icon_done grey' : ''}></i>
                                                                <i className={this.getStatus.call(this, item)[0].status === -1 ? 'icon_forbid grey' : ''}></i>
                                                                <i className={this.getStatus.call(this, item)[0].status === -0.1 || this.getStatus.call(this, item)[0].status === 0.1 ? 'icon_minus grey' : ''}></i>
                                                            </span>
                                                        <span
                                                            className={this.getStatus.call(this, item)[0].status >= -1 ? 'hide' : ''}
                                                            style={{whiteSpace: 'nowrap'}}>
                                                                        {this.getStatus.call(this, item)[0].content}
                                                                    </span>
                                                    </li>
                                                    <li style={{width: '20%', padding: '5px 5px 5px .12rem'}}
                                                        className="d-ib t-sm grey t-l border-box v-t">
                                                            <span
                                                                className={this.getStatus.call(this, item)[1].status >= -1 ? '' : 'hide'}>
                                                                <i className={this.getStatus.call(this, item)[1].status === 2 ? 'icon_done green' : ''}></i>
                                                                <i className={this.getStatus.call(this, item)[1].status === 1 ? 'icon_done grey' : ''}></i>
                                                                <i className={this.getStatus.call(this, item)[1].status === -1 ? 'icon_forbid grey' : ''}></i>
                                                                <i className={this.getStatus.call(this, item)[1].status === -0.1 || this.getStatus.call(this, item)[1].status === 0.1 ? 'icon_minus grey' : ''}></i>

                                                            </span>
                                                        {/*<span*/}
                                                        {/*className={this.getStatus.call(this, item)[1].status >= -1 ? 'hide' : ''}>*/}
                                                        {/*{ this.getStatus.call(this, item)[1].content}*/}
                                                        {/*</span>*/}
                                                    </li>
                                                    <li style={{width: '5%', padding: '0'}}
                                                        className="d-ib t grey t-l border-box v-t pull-right">
                                                            <span className='cursor swipe' style={handle_style}>
                                                                {/* todo 社保操作状态*/}
                                                                <span onClick={this.updateStatus.bind(this, item, 2)}
                                                                      className={this.state.options_list_social.indexOf(item.yg_id) >= 0 ? 'd-ib w-100' : 'hide'}
                                                                >
                                                                    {
                                                                        item.is_pay_social === 0
                                                                            ? <span>
                                                                            <i className="icon_complete t-sm v-m m-r-xs"></i>
                                                                            <span className="v-m">开启社保</span>
                                                                        </span>
                                                                            : <span>
                                                                            <i className="icon_error t-sm v-m m-r-xs"></i>
                                                                            <span className="v-m">关闭社保</span>
                                                                        </span>
                                                                    }
                                                                </span>
                                                                {/* todo 公积金操作状态*/}
                                                                <span onClick={this.updateStatus.bind(this, item, 3)}
                                                                      className={this.state.options_list_fund.indexOf(item.yg_id) >= 0 ? 'd-ib w-100' : 'hide'}>
                                                                    {
                                                                        item.is_pay_fund == 0
                                                                            ? <span>
                                                                            <i className="icon_complete t-sm v-m m-r-xs"></i>
                                                                                <span className="v-m t-sm">开启公积金</span>
                                                                        </span>
                                                                            : <span>
                                                                            <i className="icon_error t-sm v-m m-r-xs"></i>
                                                                                <span className="v-m t-sm">关闭公积金</span>
                                                                        </span>
                                                                    }
                                                                </span>
                                                                {/*不可编辑状态时*/}
                                                                <span onClick={swipeBack.bind(this)}
                                                                      className={this.state.options_list_social.indexOf(item.yg_id) >= 0 ? 'hide' : 'd-ib w-100'}
                                                                >
                                                                    <i className="icon_error t-sm v-m m-r-xs"></i>
                                                                    <span className="v-m t-sm">社保不可编辑</span>
                                                                </span>
                                                                {/*不可编辑状态时*/}
                                                                <span onClick={swipeBack.bind(this)}
                                                                      className={this.state.options_list_fund.indexOf(item.yg_id) >= 0 ? 'hide' : 'd-ib w-100'}
                                                                >
                                                                    <i className="icon_error t-sm v-m m-r-xs"></i>
                                                                    <span className="v-m t-sm">公积金不可编辑</span>
                                                                </span>
                                                                {/*不可编辑状态时*/}
                                                            </span>
                                                        {/*操作按钮   */}
                                                        <i className={this.state.edit ? 'pull-right cursor icon_detail grey v-t' : 'hide'}
                                                           onClick={swipeOption.bind(this, item, '2rem')}></i>
                                                        {/*操作按钮   */}
                                                        {/*跳转链接*/}
                                                        <Link to={{
                                                            pathname: `/Bill/Social/Detail`,
                                                            state: {
                                                                social_id: item.social_id,
                                                                fund_id: item.fund_id,
                                                                social_gs: item.social_gs,
                                                                social_gr: item.social_gr,
                                                                fund_gs: item.fund_gs,
                                                                fund_gr: item.fund_gr,
                                                                yg_name: item.yg_name
                                                            }
                                                        }}>
                                                            <i
                                                                className={`pull-right v-m ${this.state.edit ? 'hide' : 'icon_right_triangle'} ${item.social_id !== '' || item.fund_id !== '' ? '' : 'hide'}`
                                                                }> </i>
                                                        </Link>
                                                        {/*跳转链接*/}
                                                    </li>
                                                </ul>
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
                <div className="footer shadow-top b-t pos-f full-w bg-white"
                     style={{left: 0, bottom: 0, height: '1.35rem', zIndex: 1}}>
                    <p className="p-a b-b" onClick={this.toggleShowBill.bind(this)}>账单中将包含的员工
                        <span className="pull-right ">
                            <span
                                className={`label m-r-sm ${this.state.meta.yg_list.socialFund.length === 0 ? 'disabled' : 'success'}`}>{this.state.meta.yg_list.socialFund.length}
                            </span>
                            {/*{*/}
                            {/*this.no_more && this.state.meta.yg_list.socialFund.length !== 0*/}
                            {/*? <i*/}
                            {/*className="icon_angle_up"> </i>*/}
                            {/*: ''*/}
                            {/*}*/}
                        </span>
                    </p>
                    <div className="p-a">
                        {/*<p className="t-sm grey t-c m-b">注意：列表中只罗列了当月在职的员工</p>*/}
                        <button
                            className={`btn full-w ${this.state.meta.yg_list.socialFund.length === 0 ? 'disabled' : ''}`}
                            onClick={this.createOrder.bind(this, {
                                type: 2,
                                month: this.state.meta.current_month
                            })}>
                            生成{dateTransformToMonth(this.state.meta.current_month).split('/')[1]}月五险一金账单
                        </button>
                    </div>
                </div>
                {/*<div className={`pos-f full-w modal bottom ${this.state.show_modal}`}*/}
                     {/*style={this.state.modal_name === 'option' ? {zIndex: 2} : {}}>*/}
                    {/*<div className="modal-mask pos-f"*/}
                         {/*onClick={cancelModal.bind(this)}></div>*/}
                    {/*<div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}*/}
                         {/*style={{*/}
                             {/*marginBottom: '1.75rem',*/}
                             {/*maxHeight: '3rem',*/}
                             {/*overflowY: 'auto',*/}
                             {/*overflowX: 'hidden'*/}
                         {/*}}>*/}
                        {/*<div className="full-h" style={{paddingTop: '.5rem'}}>*/}
                            {/*<div className="pos-a full-w shadow-bottom bg-white "*/}
                                 {/*style={{left: 0, right: 0, top: 0, height: '.5rem'}}>*/}
                                {/*<ul style={{fontSize: 0}} className="p-t-sm p-b-sm p-r">*/}
                                    {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                                        {/*className="d-ib t grey t-l border-box">*/}
                                        {/*<span>姓名</span>*/}
                                    {/*</li>*/}
                                    {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                                        {/*className="d-ib t grey t-l border-box">缴纳城市*/}
                                    {/*</li>*/}
                                    {/*<li style={{width: '20%', padding: '5px 5px 5px .12rem'}}*/}
                                        {/*className="d-ib t grey t-l border-box">*/}
                                        {/*<span>社保</span>*/}
                                    {/*</li>*/}
                                    {/*<li style={{width: '20%', padding: '5px 5px 5px .12rem'}}*/}
                                        {/*className="d-ib t grey t-l border-box">公积金*/}
                                    {/*</li>*/}
                                    {/*<li style={{width: '5%'}}></li>*/}
                                {/*</ul>*/}
                            {/*</div>*/}
                            {/*<ul className="bg-white full-h" style={{overflowY: 'auto', overflowX: 'hidden'}}>*/}
                                {/*{*/}
                                    {/*this.state.gz_data.filter((item) => {*/}
                                        {/*return this.state.meta.yg_list.socialFund.indexOf(item.yg_id) >= 0*/}
                                    {/*}).map((item, index) => {*/}
                                        {/*return (*/}
                                            {/*<li key={index} className={`b-t pos-r swipe-option p-r`}*/}
                                                {/*style={item.yg_id === this.state.current_edit ? this.state.left_style : {}}*/}
                                            {/*>*/}
                                                {/*<ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">*/}
                                                    {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                                                        {/*className="d-ib t-sm t-l border-box v-t ellipsis">*/}
                                                        {/*<span>{item.yg_name}</span>*/}
                                                    {/*</li>*/}
                                                    {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                                                        {/*className="d-ib t-sm t-l border-box v-t ellipsis">*/}
                                                        {/*<span>{item.yg_city_name}</span>*/}
                                                    {/*</li>*/}
                                                    {/*<li style={{width: '20%', padding: '5px 5px 5px .12rem'}}*/}
                                                        {/*className="d-ib t-sm grey t-l border-box v-t">*/}
                                                            {/*<span*/}
                                                                {/*className={this.getStatus.call(this, item)[0].status >= -1 ? '' : 'hide'}>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[0].status === 2 ? 'icon_done green' : ''}> </i>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[0].status === 1 ? 'icon_done grey' : ''}></i>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[0].status === -1 ? 'icon_forbid grey' : ''}></i>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[0].status === -0.1 || this.getStatus.call(this, item)[0].status === 0.1 ? 'icon_minus grey' : ''}></i>*/}
                                                            {/*</span>*/}
                                                        {/*<span*/}
                                                            {/*className={this.getStatus.call(this, item)[0].status >= -1 ? 'hide' : ''}*/}
                                                            {/*style={{whiteSpace: 'nowrap'}}>*/}
                                                                        {/*{this.getStatus.call(this, item)[0].content}*/}
                                                                    {/*</span>*/}
                                                    {/*</li>*/}
                                                    {/*<li style={{width: '20%', padding: '5px 5px 5px .12rem'}}*/}
                                                        {/*className="d-ib t-sm grey t-l border-box v-t">*/}
                                                            {/*<span*/}
                                                                {/*className={this.getStatus.call(this, item)[1].status >= -1 ? '' : 'hide'}>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[1].status === 2 ? 'icon_done green' : ''}></i>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[1].status === 1 ? 'icon_done grey' : ''}></i>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[1].status === -1 ? 'icon_forbid grey' : ''}></i>*/}
                                                                {/*<i className={this.getStatus.call(this, item)[1].status === -0.1 || this.getStatus.call(this, item)[1].status === 0.1 ? 'icon_minus grey' : ''}></i>*/}

                                                            {/*</span>*/}
                                                    {/*</li>*/}
                                                    {/*<li style={{width: '5%', padding: '0'}}*/}
                                                        {/*className="d-ib t grey t-l border-box v-t pull-right">*/}
                                                        {/*/!*跳转链接*!/*/}
                                                        {/*<Link to={{*/}
                                                            {/*pathname: `/Bill/Social/Detail`,*/}
                                                            {/*state: {*/}
                                                                {/*social_id: item.social_id,*/}
                                                                {/*fund_id: item.fund_id,*/}
                                                                {/*social_gs: item.social_gs,*/}
                                                                {/*social_gr: item.social_gr,*/}
                                                                {/*fund_gs: item.fund_gs,*/}
                                                                {/*fund_gr: item.fund_gr,*/}
                                                                {/*yg_name: item.yg_name*/}
                                                            {/*}*/}
                                                        {/*}}>*/}
                                                            {/*<i*/}
                                                                {/*className={`pull-right v-m icon_right_triangle ${item.social_id !== '' || item.fund_id !== '' ? '' : 'hide'}`*/}
                                                                {/*}> </i>*/}
                                                        {/*</Link>*/}
                                                        {/*/!*跳转链接*!/*/}
                                                    {/*</li>*/}
                                                {/*</ul>*/}
                                            {/*</li>*/}
                                        {/*)*/}
                                    {/*})*/}
                                {/*}*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>

        )
    }

    componentDidMount() {
        // this.getStaffList(this, this.billManageUrls.getGzList());
        getData(this.billManageUrls.getGzList(), {
            pagesize: 20,
            page: this.page,
            month: this.props.location.state.op_month
        })
            .then(res => {
                let gz_data = res.data;
                let options_list_social = this.state.options_list_social;
                let options_list_fund = this.state.options_list_fund;
                res.data.forEach((item) => {
                    let id = this.showOption(item);
                    if (id.social) {
                        options_list_social.push(id.social);
                    }
                    if (id.fund) {
                        options_list_fund.push(id.fund)
                    }
                });

                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    gz_data: gz_data,
                    meta: res.meta,
                    options_list_social: options_list_social,
                    options_list_fund: options_list_fund,
                });
                this.init = false;
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

    searchYg(parent_this, params) {
        parent_this.search_data = params;
        parent_this.getStaffList(parent_this, params, true);
        parent_this.Jroll.scrollTo(0, 0)
    }

    getStaffList(parent_this, params = '', refresh = false) {
        let data;
        parent_this.page = refresh ? 1 : parent_this.page;
        // params = refresh ? '' : params;
        parent_this.search_data = params;
        data = {pagesize: 20,
            page: parent_this.page,
            month: parent_this.props.location.state.op_month,
            search: params};
        getData(parent_this.billManageUrls.getGzList(), data)
            .then(res => {
                let gz_data = parent_this.state.gz_data;
                let options_list_social = parent_this.state.options_list_social;
                let options_list_fund = parent_this.state.options_list_fund;
                gz_data = refresh ? res.data : gz_data.concat(res.data);
                res.data.forEach((item) => {
                    let id = parent_this.showOption(item);
                    if (id.social) {
                        options_list_social.push(id.social);
                    }
                    if (id.fund) {
                        options_list_fund.push(id.fund)
                    }
                });

                parent_this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                parent_this.setState({
                    gz_data: gz_data,
                    meta: res.meta,
                    options_list_social: options_list_social,
                    options_list_fund: options_list_fund,
                });
                parent_this.Jroll.refresh();
                // parent_this.Jroll.scrollTo(0, 0);
            })
    }

    getStatus(obj) {
        let arr = this.createStateArr(obj);
        return arr.map(item => this.judgeStatus(item));
    }

    // 判断社保状态码
    judgeStatus(item_arr) {
        //index: 0:状态，1：是否禁用缴纳，2：是否可编辑 3：是否开启缴纳
        //综合数据判断，返回status < 0 时，不可编辑；返回status > - 1 时全部显示icon， 否则显示文字
        if (item_arr[0] === 0) {
            if (item_arr[1] === 0) {
                // 正常编辑
                if (item_arr[2] === 1 && item_arr[3] === 1) {
                    return {content: '可编辑', status: 2}
                } else if (item_arr[3] === 0) {
                    if (item_arr[2] === 0) {
                        //不可编辑
                        return {content: '-', status: -0.1}
                    } else {
                        //可编辑
                        return {content: '-', status: 0.1}
                    }
                } else if (item_arr[2] === 0 && item_arr[3] === 1) {
                    return {content: '不可编辑但已使用该功能', status: 1}
                }
            } else {
                return {content: '禁用', status: -1}
            }
        } else if (item_arr[0] === 1) {
            return {content: '所在城市未开始受理', status: -2}

        } else if (item_arr[0] === -1) {
            return {content: '所在城市已截止受理', status: -3}
        }
    }

    createStateArr(obj) {
        const key_word = this.state.key_word;
        return key_word.map(item => [obj[`is_pay_${item}_status`],
            obj[`is_pay_${item}_stop`],
            obj[`is_pay_${item}_edit`],
            obj[`is_pay_${item}`]
        ])
    }

    showOption(item) {
        // 社保公积金是否可操作判断
        let social_id;
        let fund_id;
        if (item[`is_pay_social_status`] === 0) {
            if (item[`is_pay_social_stop`] !== 1) {
                if (item[`is_pay_social_edit`] === 1 && item[`is_pay_social_data`] === 1) {
                    social_id = item.yg_id
                }
            }
        }
        if (item[`is_pay_fund_status`] === 0) {
            if (item[`is_pay_fund_stop`] !== 1) {
                if (item[`is_pay_fund_edit`] === 1 && item[`is_pay_fund_data`] === 1) {
                    fund_id = item.yg_id
                }
            }
        }
        return {
            social: social_id,
            fund: fund_id
        }
    }

    updateStatus(item, type) {
        swipeBack.call(this);
        let update_data = type == 2 ? {
            yg_id: `${item.yg_id}`,
            is_cover: item.is_pay_social === 0 ? 1 : 0,
            op_month: this.state.meta.op_month.is_pay_social,
            type: 2
        } : {
            yg_id: `${item.yg_id}`,
            is_cover: item.is_pay_fund === 0 ? 1 : 0,
            op_month: this.state.meta.op_month.is_pay_fund,
            type: 3
        };
        postData(this.billManageUrls.updateBillOp(), update_data)
            .then(res => {
                this.getStaffList(this, '', true)
            })
    }

    toggleShowBill() {
        //此功能暂时关闭
        // if (this.no_more && this.state.meta.yg_list.socialFund.length !== 0) {
        //     if (this.state.modal_name === '') {
        //         showModal.call(this, 'order')
        //     } else {
        //         cancelModal.call(this);
        //     }
        // }
    }

    // 账单包含员工
    billStaff() {
        return this.state.gz_data.filter(item => {
            const temp = this.createStateArr(item);
            let flag = temp.map(sub_item => {
                return sub_item[0] === 0 && sub_item[1] === 1 && sub_item[2] !== '';
            });
            console.log('flag', flag);
            return flag[0] || flag[1]
        })
    }

    createOrder(params) {
        // const url = parent_this.billManageUrls.createBill();
        if (this.state.meta.yg_list.socialFund.length !== 0) {
            getData(this.billManageUrls.createBill(), params)
                .then(res => {
                    this.props.history.push('/Bill/UnbillOrder')
                })
                .catch(err => {
                    console.log(err)
                });
        }

    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.getStaffList(this, this.search_data)
    }

    toggleEdit() {
        if (this.state.gz_data.length > 0) {
            let edit = this.state.edit;
            this.setState({
                edit: !edit
            })
        }
    }
}