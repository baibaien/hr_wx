import React from 'react'
import {Link} from 'react-router-dom'
import JRoll from 'jroll/build/jroll.min'
import {BillManageUrls} from '../../../../service/billManageApi/billManageUrl'
import {Search} from '../../../../components/Search/index'
import {showModal, cancelModal} from '../../../../utils/modal'
import {getData, postData} from '../../../../fetch/httpRequest'
import {dateTransformToMonth} from '../../../../utils/dateTransform'
import {swipeOption, swipeBack} from '../../../../utils/swipe'
import {onTouchStart, onTouchEnd, getScrollStyle, getTips, onScrollEnd, onScroll} from '../../../../utils/scroll'


export class GzOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.init = true;
        this.state = {
            gz_data: [],
            meta: {
                pay_month: {
                    op_month: ''
                },
                current_month: '',
                yg_list: {
                    salary: []
                }
            },
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            open: {},
            edit: false,
            // 判断是否能够进行账单操作的数组
            options_list: [],
            // 判断当前操作哪条记录的菜单
            current_item: -1,
            left_style: {},
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
        document.title = '计算工资账单'
    }

    render() {
        const handle_style = {
            right: '-1rem',
            width: '1rem',
        };
        return (
            <div className="full-h" style={{paddingTop: '.6rem'}}>
                <div className="pos-f bg-white p-l p-r b-b shadow-bottom" style={{left: 0, right: 0, top: 0}}>
                    <div className="pull-right bg-white t-r cursor"
                         style={{height: '.5rem', width: '.5rem', lineHeight: '.5rem'}}
                         onClick={this.toggleEdit.bind(this)}>
                        {
                            this.state.edit
                                ? <button className="btn btn-sm v-m">完成</button>
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
                                        // refresh_url: this.billManageUrls.getGzList(),
                                        placeholder: '输入员工姓名进行搜索',
                                        reset_data: []
                                    }
                                }/>
                    </div>
                </div>
                <div className={`p-a t-c ${this.state.gz_data.length === 0 && !this.init ? '' : `hide`}`}>
                    <img src="/src/assets/image/none.svg" alt=""/>
                </div>
                <div style={{paddingBottom: '1.6rem'}}
                     className={`full-h ${this.state.gz_data.length === 0 && !this.init ? 'hide' : ''}`}>
                    <div className="pos-r full-h shadow-bottom b-b" style={{paddingTop: '.5rem'}}>
                        <div className="pos-a full-w shadow-bottom bg-white "
                             style={{left: 0, right: 0, top: 0, height: '.5rem'}}>
                            <ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">
                                <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                    className="d-ib t grey t-l border-box ">
                                    <span>姓名</span>
                                </li>
                                <li style={{width: '33%', padding: '5px 5px 5px .12rem'}}
                                    className="d-ib t grey t-l border-box">
                                    <span>实发工资</span>
                                </li>
                                <li style={{width: '30%', padding: '5px 5px 5px .12rem'}}
                                    className="d-ib t grey t-l border-box">工资代发
                                </li>

                            </ul>
                        </div>
                        <div style={getScrollStyle().scroll}
                             onTouchStart={onTouchStart.bind(this)}
                             onTouchEnd={onTouchEnd.bind(this)}
                             id="scroll">
                            {/* 出现操作菜单时的透明遮罩*/}
                            <div style={getScrollStyle().wrapper} className="full-w">
                                <div className={this.state.current_edit > -1 ? 'mask' : 'hide'}
                                     onClick={swipeBack.bind(this)}>
                                </div>
                                <ul className="bg-white ">

                                    {
                                        this.state.gz_data.map((item, index) => {
                                            return (
                                                <li key={index} className={`b-t pos-r swipe-option
                                                    ${this.getStatus.call(this, item)['status'] <= -1 ? 'bg-grey' : ''}
                                                    `}
                                                    style={item.yg_id === this.state.current_edit ? this.state.left_style : {}}
                                                >
                                                    <ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">
                                                        <li style={{width: '25%', padding: '5px 5px 5px .12rem'}}
                                                            className="d-ib t-sm t-l border-box ellipsis v-t">
                                                            <span className="v-m">{item.yg_name}</span>
                                                        </li>
                                                        <li style={{width: '33%', padding: '5px 5px 5px .12rem'}}
                                                            className="d-ib t-sm grey t-l border-box v-t">
                                                            <span className="v-m t-sm">
                                                                  {item.yg_salary}
                                                            </span>
                                                        </li>
                                                        <li style={{width: '30%', padding: '5px 5px 5px .12rem'}}
                                                            className="d-ib t-sm grey t-l border- v-t">
                                                            <i className={this.getStatus.call(this, item)['status'] >= -1 ? this.getStatus.call(this, item)['content'] : 'hide'}
                                                               style={{verticalAlign: 'middle'}}> </i>
                                                            {
                                                                this.getStatus.call(this, item)['status'] < -1
                                                                    ? this.getStatus.call(this, item)['content']
                                                                    : ''
                                                            }
                                                        </li>
                                                        <li style={{width: '5%', padding: '5px 5px 5px .12rem'}}
                                                            className="d-ib t grey t-l border-box">
                                                                <span
                                                                    className='cursor swipe'
                                                                    onClick={this.updateStatus.bind(this, item)}
                                                                    style={handle_style}>
                                                                    <span
                                                                        className={this.state.options_list.indexOf(item.yg_id) >= 0 ? 'd-ib w-100' : 'hide'}>
                                                                        {
                                                                            item.yg_is_salary === 0
                                                                                ? <span
                                                                                style={this.state.options_list.indexOf(item.yg_id) >= 0 ? {} : {opacity: '0.7'}}><i
                                                                                className="icon_complete t-sm v-m m-r-xs"></i>
                                                                            <span className="v-m">开启代发</span></span>
                                                                                : <span
                                                                                style={this.state.options_list.indexOf(item.yg_id) >= 0 ? {} : {opacity: '0.7'}}><i
                                                                                className="icon_error t-sm v-m m-r-xs"></i>
                                                                            <span className="v-m">关闭代发</span></span>
                                                                        }
                                                                    </span>
                                                                    {/*不可编辑状态时*/}
                                                                    <span onClick={swipeBack.bind(this)}
                                                                          className={this.state.options_list.indexOf(item.yg_id) >= 0 ? 'hide' : 'd-ib w-100'}
                                                                    >
                                                                    <i className="icon_error t-sm v-m m-r-xs"></i>
                                                                    <span className="v-m t-sm">当前不可编辑</span>
                                                                </span>
                                                                    {/*不可编辑状态时*/}
                                                                </span>

                                                            {/*操作按钮   */}
                                                            <span
                                                                className={this.state.edit ? 'p-l pull-right cursor' : 'hide'}
                                                                onClick={swipeOption.bind(this, item, '1rem')}>
                                                                    <i className='icon_detail grey'></i>
                                                                </span>
                                                            {/*操作按钮   */}
                                                            {/*跳转链接*/}
                                                            <Link className="pull-right p-l "
                                                                  to={{
                                                                      pathname: `/Bill/GzOrder/${dateTransformToMonth(this.state.meta.pay_month.salary).split('/').join('-')}/Detail/${item.salary_id}`,
                                                                      state: {
                                                                          item: item,
                                                                          pay_month: this.state.meta.pay_month.salary
                                                                      }
                                                                  }}>
                                                                <i className={this.state.edit ? 'hide' : 'icon_right_triangle'}></i>

                                                            </Link>
                                                            {/*跳转链接*/}
                                                        </li>
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
                    <p className="p-a b-b cursor"
                       onClick={this.showOrderStaff.bind(this, this.props.parent_this, {
                           type: this.state.order_type,
                           month: this.props.current_month
                       })}>账单中将包含的员工
                        <span className="pull-right ">
                            <span
                                className={`label m-r-sm ${this.state.meta.yg_list.salary.length === 0 ? 'disabled' : 'success'}`}>{this.state.meta.yg_list.salary.length}
                            </span>
                            {/*只有全部数据加载完成后才能查看员工*/}
                            {/*{*/}
                            {/*this.no_more*/}
                            {/*? <i className="icon_angle_up "> </i>*/}
                            {/*: ''*/}
                            {/*}*/}
                        </span>
                    </p>
                    <div className="p-a">
                        {/*<p className="t-sm grey t-c m-b">注意：列表中只罗列了当月在职的员工</p>*/}
                        <button
                            className={`cursor btn full-w ${this.state.meta.yg_list.salary.length === 0 ? 'disabled' : ''}`}
                            onClick={this.createOrder.bind(this, {
                                type: 1,
                                month: this.state.meta.current_month
                            })}>
                            生成{dateTransformToMonth(this.state.meta.current_month).split('/')[1]}月工资账单
                        </button>
                    </div>
                </div>
                {/*<div className={`pos-f full-w modal bottom ${this.state.show_modal}`}>*/}
                {/*<div className="modal-mask pos-f"*/}
                {/*onClick={cancelModal.bind(this)}></div>*/}
                {/*<div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}*/}
                {/*style={{marginBottom: '1.75rem'}}>*/}
                {/*<div className="full-h" style={{paddingTop: '.5rem'}}>*/}
                {/*<div className="pos-a full-w shadow-bottom bg-white "*/}
                {/*style={{left: 0, right: 0, top: 0, height: '.5rem'}}>*/}
                {/*<ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">*/}
                {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                {/*className="d-ib t grey t-l border-box">*/}
                {/*<span>姓名</span>*/}
                {/*</li>*/}
                {/*<li style={{width: '33%', padding: '5px 5px 5px .12rem'}}*/}
                {/*className="d-ib t grey t-l border-box">*/}
                {/*<span>实发工资</span>*/}
                {/*</li>*/}
                {/*<li style={{width: '30%', padding: '5px 5px 5px .12rem'}}*/}
                {/*className="d-ib t grey t-l border-box">工资代发*/}
                {/*</li>*/}
                {/*<li style={{width: '5%', padding: '5px 5px 5px .12rem'}}*/}
                {/*className="d-ib t grey t-l border-box"></li>*/}
                {/*</ul>*/}
                {/*</div>*/}
                {/*<ul className="bg-white full-h" style={{overflowY: 'auto', overflowX: 'hidden'}}>*/}
                {/*{*/}
                {/*this.state.gz_data.filter((item) => {*/}
                {/*return this.state.meta.yg_list.salary.indexOf(item.yg_id) >= 0*/}
                {/*}).map((item, index) => {*/}
                {/*return (*/}
                {/*<li key={index} className={`b-t pos-r p-r-xs`}*/}
                {/*>*/}
                {/*<ul style={{fontSize: 0}} className="p-t-sm p-b-sm ">*/}
                {/*<li style={{width: '25%', padding: '5px 5px 5px .12rem'}}*/}
                {/*className="d-ib t-sm t-l border-box ellipsis v-t">*/}
                {/*<span className="v-m">{item.yg_name}</span>*/}
                {/*</li>*/}
                {/*<li style={{width: '33%', padding: '5px 5px 5px .12rem'}}*/}
                {/*className="d-ib t-sm grey t-l border-box v-t">*/}
                {/*<span className="v-m t-sm">*/}
                {/*{item.yg_salary}*/}
                {/*</span>*/}
                {/*</li>*/}
                {/*<li style={{width: '30%', padding: '5px 5px 5px .12rem'}}*/}
                {/*className="d-ib t-sm grey t-l border- v-t">*/}
                {/*<i className={this.getStatus.call(this, item)['status'] >= -1 ? this.getStatus.call(this, item)['content'] : 'hide'}*/}
                {/*style={{verticalAlign: 'middle'}}> </i>*/}
                {/*{*/}
                {/*this.getStatus.call(this, item)['status'] < -1*/}
                {/*? this.getStatus.call(this, item)['content']*/}
                {/*: ''*/}
                {/*}*/}
                {/*</li>*/}
                {/*<li style={{width: '5%', padding: '5px 5px 5px 0'}}*/}
                {/*className="pull-right">*/}
                {/*<Link className=""*/}
                {/*to={{*/}
                {/*pathname: `/Bill/GzOrder/${dateTransformToMonth(this.state.meta.pay_month.salary).split('/').join('-')}/Detail/${item.salary_id}`,*/}
                {/*state: {*/}
                {/*item: item,*/}
                {/*pay_month: this.state.meta.pay_month.salary*/}
                {/*}*/}
                {/*}}><i*/}
                {/*className="icon_right_triangle"></i>*/}
                {/*</Link>*/}
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
        getData(this.billManageUrls.getGzList(), {
            pagesize: 20,
            page: this.page,
            month: this.props.location.state.op_month
        })
            .then(res => {
                let options_list = this.state.options_list;
                res.data.forEach((item) => {
                    let id = this.showOption(item, res.meta);
                    if (id) {
                        options_list.push(id);
                    }
                });
                console.log('option', options_list);
                this.init = false;
                this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                this.setState({
                    gz_data: res.data,
                    meta: res.meta,
                    options_list: options_list,
                });
                const options = {
                    preventDefault: false,
                    zoom: false,
                    bounce: true,
                    scrollBarY: true,
                    scrollBarFade: true
                };

                this.Jroll = new JRoll("#scroll", options);
                this.Jroll.on('scroll', onScroll.bind(this));
                this.Jroll.on('scrollEnd', onScrollEnd.bind(this));
                this.Jroll.refresh();
            })
    }

    searchYg(parent_this, params) {
        parent_this.search_data = params;
        parent_this.getStaffList(parent_this, params, true);
        parent_this.Jroll.scrollTo(0, 0);
    }

    getStaffList(parent_this, params = '', refresh = false) {
        let data;
        parent_this.page = refresh ? 1 : parent_this.page;
        // params = refresh ? '' : params;
        parent_this.search_data = params;
        data = {pagesize: 20, page: parent_this.page, search: params, month: parent_this.props.location.state.op_month};
        getData(parent_this.billManageUrls.getGzList(), data)
            .then(res => {
                let gz_data = parent_this.state.gz_data;
                let options_list = parent_this.state.options_list;
                gz_data = refresh ? res.data : gz_data.concat(res.data);
                res.data.forEach((item) => {
                    let id = parent_this.showOption(item, res.meta);
                    if (id) {
                        options_list.push(id);
                    }
                });

                parent_this.no_more = res.meta.pagination.current_page >= res.meta.pagination.total_pages;
                parent_this.setState({
                    gz_data: gz_data,
                    meta: res.meta,
                    options_list: options_list,
                    current_item: -1,
                });
                parent_this.Jroll.refresh();
            })
    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.getStaffList(this, this.search_data)
    }

    createOrder(params) {
        if (this.state.meta.yg_list.salary.length !== 0) {
            getData(this.billManageUrls.createBill(), params)
                .then(res => {
                    this.props.history.push('/Bill/UnbillOrder')
                })
                .catch(err => {
                })
        }
    }

    createStateArr(obj) {
        // 创建格式化对照文本
        return [obj[`yg_is_salary_status`],
            obj[`yg_is_salary_stop`],
            obj[`yg_is_salary_edit`],
            obj[`yg_is_salary`]
        ]
    }

    // 账单包含员工
    billStaff() {
        return this.state.gz_data.filter((item) => {
            const temp = this.createStateArr(item);
            if (temp[0] === 0 && temp[1] === 0 && temp[2] === 1 && temp[3] === 1) {
                return temp
            }
        })
    }

    showOrderStaff() {
        //此功能暂时关闭
        // if (this.state.meta.yg_list.salary.length > 0 && this.no_more) {
        //     if (this.state.modal_name === '') {
        //         showModal.call(this, 'orderStaff')
        //     } else {
        //         cancelModal.call(this);
        //     }
        // }
    }

    getStatus(obj) {
        return this.judgeStaus(this.createStateArr(obj));
    }

    // 判断工资状态码
    judgeStaus(item_arr) {
        //index: 0:状态 status，1：是否允许操作 stop，2：是否可编辑 edit，3：是否使用公司业务
        if (item_arr[0] === 0) {
            if (item_arr[1] === 0) {
                if (item_arr[3] === 0) {
                    // 不使用公司业务 -
                    // if (item_arr[2] === 0) {
                    //     //不可编辑
                    //     return {content: '-', status: -0.1}
                    // } else {
                    //     //可编辑
                    //     return {content: '-', status: 0.1}
                    // }
                    return {content: 'icon_minus grey', status: 0}
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

    toggleEdit() {
        if (this.state.gz_data.length > 0) {
            let edit = this.state.edit;
            this.setState({
                edit: !edit
            });
        }
    }

    showOption(item, meta) {
        if (Number(meta.op_month.yg_is_salary) === Number(meta.op_month.operation)) {
            if (item.yg_is_salary_stop !== 1) {
                if (item.yg_is_salary_edit === 1 && item.yg_is_salary_data === 1) {
                    return item.yg_id
                }
            }
        }
    }

    updateStatus(item) {
        swipeBack.call(this);
        postData(this.billManageUrls.updateBillOp(), {
            yg_id: `${item.yg_id}`,
            is_cover: item.yg_is_salary === 0 ? 1 : 0,
            op_month: this.state.meta.op_month.yg_is_salary,
            type: 1
        })
            .then(res => {
                this.getStaffList(this, '', true)
            })

    }
}