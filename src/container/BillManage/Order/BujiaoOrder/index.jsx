import React from 'react'
import {Link} from 'react-router-dom'
import JRoll from 'jroll/build/jroll.min'
import {showModal, cancelModal} from "../../../../utils/modal";
import {BillManageUrls} from '../../../../service/billManageApi/billManageUrl'
import {getData} from '../../../../fetch/httpRequest'
import {Search} from '../../../../components/Search/index'
import {ScrollMore} from '../../../../utils/scroll'
import {onTouchStart, onTouchEnd, getScrollStyle, getTips, onScrollEnd, onScroll} from '../../../../utils/scroll'
import {dateTransformToMonth} from "../../../../utils/dateTransform"

export class BujiaoOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.init = true;
        this.state = {
            gz_data: [],
            meta: {
                op_month: {},
                yg_list: {
                    back: []
                },
                back_op_month: []
            },
            key_word: ['social', 'fund'],
            current_item: {},
            current_month: '',
            show_modal: '',
            modal_name: '',
            modal_in: '',
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            open: {}
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
        document.title = '添加补缴';
    }

    render() {
        const selected_style = {
            background: '#33ac37',
            color: '#fff',
            padding: '.08rem .05rem',
            borderRadius: '5px'
        };
        const un_editable_style = {
            background: '#d7d7d7',
            padding: '.08rem .05rem',
            borderRadius: '5px'
        };
        return (
            <div style={{paddingBottom: '1.6rem', paddingTop: '.6rem'}} className="full-h">
                <div className="pos-f bg-white p-l p-r b-b shadow-bottom"
                     style={{left: 0, right: 0, top: 0, lineHeight: '.5rem'}}>
                    <Search onSearch={this.searchYg}
                            onRefreshPage={this.getStaffList}
                            goBack={() => {
                                this.props.history.push('/Index')
                            }}
                            setting={
                                {
                                    parent_this: this,
                                    // refresh_url: this.billManageUrls.getGzList(),
                                    placeholder: '输入员工姓名进行搜索',
                                    reset_data: []
                                }
                            }/>
                </div>
                <div className={`t-l title  ${this.state.gz_data.length === 0 && !this.init ? 'hide' : ''}`}>
                    {
                        Object.keys(this.state.meta.back_op_month).map((item, index) => {
                            return (
                                <span className={`m-r cursor ${this.state.current_month === item ? '' : 'grey'}`}
                                      key={index}
                                onClick={this.toggleMonth.bind(this, item)}>{dateTransformToMonth(item)}</span>
                            )
                        })
                    }
                </div>
                <div className={`p-a t-c ${this.state.gz_data.length === 0 && !this.init ? '' : 'hide'}`}>
                    <img src="/src/assets/image/none.svg" alt=""/>
                </div>
                <div className={`full-h ${this.state.gz_data.length === 0 && !this.init ? 'hide' : ''}`}>
                    <div className="pos-r full-h shadow-bottom b-b" style={{paddingTop: '.5rem'}}>
                        <div className="pos-a full-w shadow-bottom bg-white "
                             style={{left: 0, right: 0, top: 0, height: '.5rem'}}>
                            <ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">
                                <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                    className="d-ib t grey t-l border-box">
                                    <span>员工姓名</span>
                                </li>
                                <li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}
                                    className="d-ib t grey t-l border-box">
                                    <span>社保</span>
                                </li>
                                <li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}
                                    className="d-ib t grey t-l border-box">公积金
                                </li>
                            </ul>
                        </div>
                        <div style={getScrollStyle().scroll}
                             onTouchStart={onTouchStart.bind(this)}
                             onTouchEnd={onTouchEnd.bind(this)}
                             id="scroll">
                            <div style={getScrollStyle().wrapper} className="full-w">
                                <ul className="bg-white ">

                                    {
                                        this.state.gz_data.map((item, index) => {
                                            return (
                                                <li key={index} className={`b-t pos-r`}
                                                >
                                                    <ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">
                                                        <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                                            className="d-ib t-sm t-l border-box">
                                                            <span>{item.yg_name}</span>
                                                        </li>
                                                        <li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}
                                                            className="d-ib t-sm grey t-l border-box">
                                                            <span className="v-m t-sm"
                                                                  style={this.getStatus.call(this, item)[0].status === 2
                                                                      ? selected_style
                                                                      : (this.getStatus.call(this, item)[0].status === 0
                                                                          ? un_editable_style
                                                                          : {})
                                                                  }>{
                                                                this.getStatus.call(this, item)[0].content
                                                            }
                                                </span>
                                                        </li>
                                                        <li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}
                                                            className="d-ib t-sm grey t-l border-box">
                                                            <span className="v-m t-sm"
                                                                  style={this.getStatus.call(this, item)[1].status === 2
                                                                      ? selected_style
                                                                      : (this.getStatus.call(this, item)[1].status === 0
                                                                          ? un_editable_style
                                                                          : {})
                                                                  }>{
                                                                this.getStatus.call(this, item)[1].content
                                                            }
                                                </span>
                                                            <i onClick={this.showOption.bind(this, item, 'option')}
                                                               style={{
                                                                   right: '.1rem',
                                                                   top: '50%',
                                                                   marginTop: '-6px'
                                                               }}
                                                               className={`icon_right_triangle pos-a v-m t-md ${
                                                                   (this.getStatus.call(this, item)[1].status <= 0 && this.getStatus.call(this, item)[0].status <= 0) ? 'hide' : ''}`
                                                               }> </i></li>
                                                    </ul>
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

                </div>
                <div className="footer shadow-top b-t pos-f full-w bg-white"
                     style={{left: 0, bottom: 0, height: '1.35rem', zIndex: 1}}>
                    <p className="p-a b-b" onClick={this.toggleOrder.bind(this)}>已添加补缴员工
                        <span className="pull-right ">
                            <span
                                className={`label m-r-sm ${this.state.meta.yg_list.back.length === 0 ? 'disabled' : 'success'}`}>{this.state.meta.yg_list.back.length}
                            </span>
                            {/*{*/}
                            {/*this.no_more && this.state.meta.yg_list.back.length !== 0*/}
                            {/*? <i*/}
                            {/*className="icon_angle_up hide"> </i>*/}
                            {/*: ''*/}
                            {/*}*/}
                        </span>
                    </p>
                    <div className="p-a">
                        {/*<p className="t-sm grey t-c m-b">注意：列表中只罗列了当月在职的员工</p>*/}
                        <button
                            className={`btn full-w ${this.state.meta.yg_list.back.length === 0 ? 'disabled' : ''}`}
                            onClick={this.createOrder.bind(this, {
                                type: 3,
                                month: this.state.meta.current_month
                            })}>
                            生成补缴账单
                        </button>
                    </div>
                </div>
                <div className={`pos-f full-w modal bottom ${this.state.show_modal}`}
                     style={this.state.modal_name === 'option' ? {zIndex: 2} : {}}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            this.state.modal_name === 'option'
                                ? <ul className="bg-white">
                                    <li className="p-a-sm grey t-sm t-c">选择项目编辑补缴月份</li>
                                    <li className={`p-a t-c b-t ${this.getStatus.call(this, this.state.current_item)[0].status <= 0 ? 'hide' : ''}`}>
                                        <Link to={{
                                            pathname: "/Bill/Bujiao/Month",
                                            state: {
                                                tlist: this.state.current_item.social_tlist,
                                                back_month: this.state.current_item.social_back,
                                                yg_id: this.state.current_item.yg_id,
                                                op_month: this.state.meta.op_month.operation,
                                                type: 1
                                            }
                                        }}>社保</Link>
                                    </li>
                                    <li className={`p-a t-c b-t ${this.getStatus.call(this, this.state.current_item)[1].status <= 0 ? 'hide' : ''}`}>
                                        <Link to={{
                                            pathname: "/Bill/Bujiao/Month",
                                            state: {
                                                tlist: this.state.current_item.fund_tlist,
                                                back_month: this.state.current_item.fund_back,
                                                yg_id: this.state.current_item.yg_id,
                                                op_month: this.state.meta.op_month.operation,
                                                type: 2
                                            }
                                        }}>公积金</Link>
                                    </li>
                                    <li className="p-a t-c cursor" style={{borderTop: '4px solid #eee'}}
                                        onClick={cancelModal.bind(this)}>取消
                                    </li>
                                </ul>
                                : ''
                        }
                        {/*{*/}
                            {/*this.state.modal_name === 'order'*/}
                                {/*? <div style={{*/}
                                    {/*maxHeight: '3rem',*/}
                                    {/*marginBottom: '1.75rem',*/}
                                    {/*overflowY: 'auto',*/}
                                    {/*overflowX: 'hidden'*/}
                                {/*}}>*/}
                                    {/*<div style={{paddingTop: '.5rem'}}>*/}
                                        {/*<div className="pos-a full-w b-b shadow-bottom bg-white"*/}
                                             {/*style={{left: 0, right: 0, top: 0, height: '.5rem'}}>*/}
                                            {/*<ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">*/}
                                                {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                                                    {/*className="d-ib t grey t-l border-box">*/}
                                                    {/*<span>员工姓名</span>*/}
                                                {/*</li>*/}
                                                {/*<li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}*/}
                                                    {/*className="d-ib t grey t-l border-box">*/}
                                                    {/*<span>社保</span>*/}
                                                {/*</li>*/}
                                                {/*<li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}*/}
                                                    {/*className="d-ib t grey t-l border-box">公积金*/}
                                                {/*</li>*/}
                                            {/*</ul>*/}
                                        {/*</div>*/}
                                        {/*<ul className="bg-white full-h" style={{oveflowY: 'auto', overflowX: 'hidden'}}>*/}
                                            {/*{*/}
                                                {/*this.state.gz_data.filter((item) => {*/}
                                                    {/*return this.state.meta.yg_list.back.indexOf(item.yg_id) >= 0*/}
                                                {/*}).map((item, index) => {*/}
                                                    {/*return (*/}
                                                        {/*<li key={index} className={`b-t pos-r`}*/}
                                                        {/*>*/}
                                                            {/*<ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">*/}
                                                                {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                                                                    {/*className="d-ib t-sm t-l border-box">*/}
                                                                    {/*<span>{item.yg_name}</span>*/}
                                                                {/*</li>*/}
                                                                {/*<li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}*/}
                                                                    {/*className="d-ib t-sm grey t-l border-box">*/}
                                                            {/*<span className="v-m t-sm"*/}
                                                                  {/*style={this.getStatus.call(this, item)[0].status === 2*/}
                                                                      {/*? selected_style*/}
                                                                      {/*: (this.getStatus.call(this, item)[0].status === 0*/}
                                                                          {/*? un_editable_style*/}
                                                                          {/*: {})*/}
                                                                  {/*}>{*/}
                                                                {/*this.getStatus.call(this, item)[0].content*/}
                                                            {/*}*/}
                                                {/*</span>*/}
                                                                {/*</li>*/}
                                                                {/*<li style={{width: '37.5%', padding: '5px 5px 5px .12rem'}}*/}
                                                                    {/*className="d-ib t-sm grey t-l border-box">*/}
                                                            {/*<span className="v-m t-sm"*/}
                                                                  {/*style={this.getStatus.call(this, item)[1].status === 2*/}
                                                                      {/*? selected_style*/}
                                                                      {/*: (this.getStatus.call(this, item)[1].status === 0*/}
                                                                          {/*? un_editable_style*/}
                                                                          {/*: {})*/}
                                                                  {/*}>{*/}
                                                                {/*this.getStatus.call(this, item)[1].content*/}
                                                            {/*}*/}
                                                {/*</span>*/}
                                                                    {/*<i onClick={this.showOption.bind(this, item, 'option')}*/}
                                                                       {/*style={{*/}
                                                                           {/*right: '.1rem',*/}
                                                                           {/*top: '50%',*/}
                                                                           {/*marginTop: '-6px'*/}
                                                                       {/*}}*/}
                                                                       {/*className={`icon_right_triangle pos-a v-m t-md ${*/}
                                                                           {/*(this.getStatus.call(this, item)[1].status <= 0 && this.getStatus.call(this, item)[0].status <= 0) ? 'hide' : ''}`*/}
                                                                       {/*}> </i></li>*/}
                                                            {/*</ul>*/}
                                                        {/*</li>*/}
                                                    {/*)*/}
                                                {/*})*/}
                                            {/*}*/}
                                        {/*</ul>*/}
                                    {/*</div>*/}

                                {/*</div>*/}
                                {/*: ''*/}
                        {/*}*/}
                    </div>
                </div>
            </div>

        )
    }

    componentDidMount() {
        getData(this.billManageUrls.getBujiaoList(), {pagesize: 20, page: this.page})
            .then(res => {
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                let gz_data = res.data.map((item) => {
                    return Object.assign(item, this.createText(this, item));
                });

                this.setState({
                    gz_data: gz_data,
                    meta: res.meta,
                    current_month: Object.keys(res.meta.back_op_month)[0]
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
                this.Jroll.scrollTo(0, 0);
            });
    }

    searchYg(parent_this, params) {
        // 存储数据便于加载
        parent_this.search_data = params;
        parent_this.getStaffList(parent_this, params, true);
        parent_this.Jroll.scrollTo(0, 0);
    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.getStaffList(this, this.search_data)
    }

    getStaffList(parent_this, params = '', refresh = false, month='') {
        let data;
        parent_this.page = refresh ? 1 : parent_this.page;
        // params = refresh ? '' : params;
        parent_this.search_data = params;
        data = {pagesize: 20, page: parent_this.page, search: params, month: month};
        getData(parent_this.billManageUrls.getBujiaoList(), data)
            .then(res => {
                parent_this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                let new_data = res.data.map((item) => {
                    return Object.assign(item, parent_this.createText(parent_this, item));
                })
                let gz_data = refresh ? new_data : parent_this.state.gz_data.concat(new_data);
                parent_this.setState({
                    gz_data: gz_data,
                    meta: res.meta
                });
                parent_this.Jroll.refresh();
                // parent_this.Jroll.scrollTo(0,0)
            })

    }

    createText(parent_this, month_obj) {
        // 创建提示文本
        const obj = {};
        parent_this.state.key_word.forEach(item => {
            if (month_obj[`${item}_back`].length === 0) {
                obj[`${item}_back_text`] = ''
            } else {
                const length = month_obj[`${item}_back`].length - 1;
                const text_start = month_obj[`${item}_back`][0].substring(5);
                const text_end = month_obj[`${item}_back`][length].substring(5)
                obj[`${item}_back_text`] = length === 0 ? `${text_start}月`: `${text_start}月~${text_end}月(${length + 1}个月)`
            }
        });
        return obj
    }


    getStatus(obj) {
        let arr = this.createStateArr(obj);
        return arr.map(item => this.judgeStatus(item));
    }

    // 判断社保状态码
    judgeStatus(item_arr) {
        //index: 0:状态，1：是否可编辑，2：编辑文本 3：tlist
        if (item_arr[0] === 0) {
            if (item_arr[3].length === 0 || (item_arr[2] === '' && item_arr[1] === 0)) {
                return {content: '无补缴月', status: -1}
            } else if (item_arr[3].length !== 0 && item_arr[2] === '' && item_arr[1] === 1) {
                return {content: '可添加补缴', status: 1}
            } else if (item_arr[2] !== '' && item_arr[1] === 0) {
                //不可编辑
                return {content: item_arr[2], status: 0}
            } else if (item_arr[2] !== '' && item_arr[1] === 1) {
                //可编辑
                return {content: item_arr[2], status: 2}
            }
        } else if (item_arr[0] === 1) {
            return {content: '未开始受理', status: -2}

        } else if (item_arr[0] === -1) {
            return {content: '已截止受理', status: -3}
        }
    }

    createStateArr(obj) {
        const key_word = this.state.key_word;
        return key_word.map(item => [obj[`is_pay_${item}_status`],
            obj[`yg_is_${item}_back_edit`],
            obj[`${item}_back_text`],
            obj[`${item}_tlist`]
        ])
    }

    showOption(item, modal_name) {
        this.setState({
            current_item: item,
        });
        showModal.call(this, modal_name);
    }

    // 账单包含员工
    billStaff() {
        return this.state.gz_data.filter(item => {
            const temp = this.createStateArr(item);
            let flag = temp.map(sub_item => {
                return sub_item[0] === 0 && sub_item[1] === 1 && sub_item[2] !== '';
            });
            return (flag[0] || flag[1])
        })
    }

    createOrder(params) {
        if (this.state.meta.yg_list.back.length !== 0) {
            getData(this.billManageUrls.createBill(), params)
                .then(res => {
                    this.props.history.push('/Bill/UnbillOrder')
                })
                .catch(err => {
                });
        }

    }

    toggleOrder() {
        // 显示账单中员工功能暂时关闭
        // if (this.state.meta.yg_list.back.length !== 0 && this.no_more) {
        //     console.log(this.state.modal_name);
        //     if (this.state.modal_name === '') {
        //         showModal.call(this, 'order')
        //     } else if (this.state.modal_name === 'order') {
        //         cancelModal.call(this);
        //     }
        // }
    }
    toggleMonth(month) {
        if(this.state.current_month !== month) {
            this.setState({
                current_month: month
            });
            this.getStaffList(this,'', true, month);
            this.Jroll.scrollTo(0, 0);
        }
    }
}