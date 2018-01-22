import React from 'react'
import JRoll from 'jroll/build/jroll.min'
import {postData} from '../../../../fetch/httpRequest'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {changeUnNecValue} from '../../../../utils/form'
import {getSessionItem} from '../../../../utils/sessionStorage'
import {showModal, cancelModal} from '../../../../utils/modal'
import {selectedList, selectedItem} from '../../../../utils/selectOptions'
import {LevelModal} from '../Modals/Level'
import {AreaModal} from '../Modals/Area'
import {SelectModal} from '../Modals/Select'

export class Hospitals extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.staffsUrls = new StaffsUrls();
        this.yg_id = this.props.location.state.yg_id;
        //取到缓存中的医院列表
        const selected_hospitals = getSessionItem('hospitals', 'array');
        const selected_hospitals_id = selected_hospitals.map(item => item.id);
        this.init = true;
        // 医院列表
        this.page = 1;
        this.is_touching = false;
        this.no_more = false;
        this.pull_up_tips = {
            // 上拉状态
            0: '',
            1: '加载更多',
            2: '加载中...',
            3: '没有更多数据'
        };
        // 组件滚动中监测数值。
        this.onScroll = this.onScroll.bind(this);
        // 组件滚动结束时触发
        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.state = {
            // 0 没有滑动 1滑动中 2上拉刷新
            pull_up_status: 0,
            // 滚动高度
            y: 0,
            show_search: false,
            show_modal: '',
            modal_in: '',
            modal_name: '',
            hospitals: [],
            selected_hospitals: selected_hospitals,
            selected_hospitals_id: selected_hospitals_id,
            areas: [],
            levels: [{id: 99, name: '社区医院'}],
            hospital_data: {
                name: '',
                level: [],
                area_id: []
            },

        }
    }

    render() {
        const scroll = {
                position: 'relative',
                height: '100%',
                overflow: 'hidden',

            }
        ;
        const wrapper = {
            minHeight: '100%',
            WebkitTransform: 'translate3d(0,0,0)',
            paddingBottom: '.3rem'
        };
        return (
            <div className="full-h" style={{paddingTop: '.7rem', paddingBottom: '.6rem'}}>
                <div className="p-a bg-white clearfix b-b shadow-bottom m-b-sm pos-f full-w" style={{top: 0,height:'.5rem'}}>
                    <div className={`${this.state.show_search ? 'hide' : ''}`}>
                        <span onClick={this.updateHospital.bind(this)}>
                            <i className="icon_left_triangle grey v-m"></i>返回
                        </span>
                        <span className="pull-right" onClick={this.showSearch.bind(this)}>
                        <i className="icon_search grey v-m"></i>
                        搜索医疗机构
                    </span>
                    </div>
                    <div className={`${this.state.show_search ? '' : 'hide'} clearfix`}>
                        <span className="pull-left cursor" onClick={this.hideSearch.bind(this)}><i className="icon_close dark"></i></span>
                        <div className="" style={{marginLeft: '.25rem',marginTop:'-.05rem'}}>
                            <input type="text"
                                   placeholder="输入医疗机构名称进行搜索"
                                   value={this.state.hospital_data.name}
                                   className="v-m full-w"
                                   onChange={changeUnNecValue.bind(this, ['hospital_data', 'name'])}
                                   style={{marginRight: '-.44rem'}}
                            />
                            <button className="btn btn-sm cursor v-m"
                                    onClick={this.searchHospital.bind(this, true)}
                                    style={{width: '.44rem'}}>搜索
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`${this.state.show_search ? '' : 'hide'}`}>
                    <h6 className="title">筛选条件</h6>
                    <div className="bg-white">
                        <ul className="detail">
                            <li className="p-r-lg pos-r" onClick={showModal.bind(this, 'area')}>
                                <span>机构所在地</span>
                                <span className="pull-right ellipsis t-r" style={{width: '1.5rem'}}>
                                    {
                                        this.state.hospital_data['area_id'][0]
                                            ? <span>
                                                {this.state.areas.filter(item => item.id === this.state.hospital_data['area_id'][0])[0].name}等{this.state.hospital_data['area_id'].length}个条件
                                        </span>
                                            : ''
                                    }
                                    <i className="icon_right_triangle pos-a" style={{right: 0}}></i>
                                </span>
                            </li>
                            <li className="p-r-lg pos-r" onClick={showModal.bind(this, 'level')}>
                                <span>医院等级</span>
                                <span className="pull-right ellipsis t-r" style={{width: '1.5rem'}}>
                                    {
                                        this.state.hospital_data['level'][0]
                                            ? <span>
                                                {console.log(this.state.levels)}
                                            {this.state.levels.filter(item => item.id === this.state.hospital_data['level'][0])[0].name}等{this.state.hospital_data['level'].length}个条件
                                        </span>
                                            : ''
                                    }
                                    <i className="icon_right_triangle pos-a" style={{right: 0}}></i>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={`${this.state.show_search ? 'hide' : 'b-t b-b'} `}
                     id="scroll" style={scroll}
                     onTouchStart={this.onTouchStart}
                     onTouchEnd={this.onTouchEnd}
                >
                    <div>
                        {
                            this.state.hospitals.length === 0 && !this.init
                                ? <p className="p-t-lg t-md grey t-c ">无数据，请重新选择筛选条件！</p>
                                : ''
                        }
                        <ul className="detail bg-white"
                            style={wrapper}>

                            {
                                this.state.hospitals.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <label className="ui-check full-w">
                                                <input type="checkbox"
                                                       value={item.id}
                                                       onChange={this.showSelectedHospitals.bind(this, item)}
                                                       checked={this.state.selected_hospitals_id.indexOf(item.id) >= 0}/>
                                                <i className="icon_ui v-m"></i>
                                                <span className="t v-m  ellipsis"
                                                      style={{width: '85%'}}>{item.name}</span>
                                            </label>
                                        </li>
                                    )
                                })
                            }
                            <li className="t-c pos-a full-w bg-grey grey"
                                style={{
                                    textShadow: '1px 1px #f3f3f3',
                                    height: '.3rem',
                                    bottom: '',
                                    padding: 0,
                                    left: 0
                                }}>
                                {this.no_more ? this.pull_up_tips[3] : this.pull_up_tips[this.state.pull_up_status]}
                            </li>
                        </ul>
                    </div>

                </div>
                <div
                    className={`p-a pos-f show-detail b-t shadow-top ${this.state.selected_hospitals.length === 0 ? 'down' : 'up'}
                ${this.state.show_search ? '' : ''}`}
                    onClick={showModal.bind(this, 'select_list')}>
                    {/*// 在没有选中医院时不显示选中医院列表功能暂时取消*/}
                    已选中
                    <span
                        className={this.state.selected_hospitals.map(item => item.type).indexOf(2) >= 0 ? 'hide' : 'm-l grey'}>请选择至少一家社区医院</span>
                    <span className="pull-right">
                        <span className="label success v-m m-r-xs">
                            {this.state.selected_hospitals.length}
                        </span>
                        <i className="icon_angle_up v-m"></i>
                    </span>
                </div>
                <div className={`pos-f full-w modal bottom ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting full-w pos-a ${this.state.modal_in}`}>
                        {
                            //医院等级
                            this.state.modal_name === 'level'
                                ? <LevelModal cancelClick={cancelModal.bind(this)}
                                              saveClick={this.saveSearchData.bind(this)}
                                              data={{
                                                  levels: this.state.levels,
                                                  selected_level: this.state.hospital_data.level
                                              }}/>
                                : ''
                        }
                        {
                            //医院所在区
                            this.state.modal_name === 'area'
                                ? <AreaModal cancelClick={cancelModal.bind(this)}
                                             saveClick={this.saveSearchData.bind(this)}
                                             data={{
                                                 areas: this.state.areas,
                                                 selected_area: this.state.hospital_data.area_id
                                             }}/>
                                : ''
                        }
                        {
                            //选择医院列表
                            this.state.modal_name === 'select_list'
                                ? <SelectModal cancelClick={cancelModal.bind(this)}
                                               deleteClick={this.deleteHospital.bind(this)}
                                               data={this.state.selected_hospitals}/>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.searchHospital();
        this.createScroller();
    }

    createScroller() {
        const options = {
            // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
            preventDefault: false,
            zoom: false,
            bounce: true,
            scrollBarY: true,
            scrollBarFade: true
        };

        this.Jroll = new JRoll(`#scroll`, options);
        this.Jroll.on('scroll', this.onScroll.bind(this));
        this.Jroll.on('scrollEnd', this.onScrollEnd.bind(this));
        this.Jroll.refresh();
        // document.addEventListener('touchmove', () => {
        //     event.preventDefault()
        // }, false);
    }

    // 获得医院列表
    searchHospital(reset_fresh = false) {
        this.page = reset_fresh ? 1 : this.page;
        let data = Object.assign(this.state.hospital_data, {
            pagesize: 20,
            page: this.page,
        });

        // 医院列表
        postData(this.staffsUrls.getHospitals(), data)
            .then(res => {
                let hospitals = this.state.hospitals;
                this.init = false;
                hospitals = reset_fresh ? res.data : hospitals.concat(res.data);
                res.meta.pagination.total_pages <= this.page ? this.no_more = true : false;
                this.setState({
                    hospitals: hospitals,
                    show_search: false
                });
            })
            .catch(err => {
            });
    }

    // 获得医院筛选条件
    getHospitalSelection(search_data) {
        search_data = Object.assign(search_data, {pagesize: '20', page: this.page});
        return postData(this.staffsUrls.getHospitalForm(), search_data)
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 显示搜索条件
    showSearch() {
        const data = this.getHospitalSelection({yg_id: getSessionItem('yg_id')});
        data.then(res => {
            let levels = this.state.levels.length > 1 ? this.state.levels : this.state.levels.concat(res.levels);
            this.setState({
                show_search: true,
                levels: levels,
                areas: res.areas
            })
        })
            .catch(err => {
                console.log(err)
            })
    }
    hideSearch() {
        this.setState({
            show_search: false,
            hospital_data: {
                name: '',
                level: [],
                area_id: []
            },
        })
    }
    // 保存所选医院列表
    saveSearchData(obj_name, val_arr) {
        const hospital_data = this.state.hospital_data;
        Object.assign(hospital_data, {[obj_name]: val_arr});
        this.setState({
            hospital_data: hospital_data
        });
        cancelModal.call(this);
    }


    showSelectedHospitals(item) {
        let list = selectedList(this.state.selected_hospitals_id, item['id'], 5);
        let item_list = selectedItem(this.state.selected_hospitals, item, 5)
        this.setState({
            selected_hospitals_id: list,
            selected_hospitals: item_list
        })
    }

    // 删除所选
    deleteHospital(id) {
        const list_id = this.state.selected_hospitals_id;
        const list = this.state.selected_hospitals;
        const index = list_id.indexOf(id);
        list.splice(index, 1);
        list_id.splice(index, 1);
        this.setState({
            selected_hospitals: list,
            selected_hospitals_id: list_id
        })
    }

    updateHospital() {
        console.log(1);
        if (this.state.selected_hospitals.length === 0) {
            sessionStorage.setItem('hospitals', JSON.stringify(this.state.selected_hospitals.map(item => JSON.stringify(item))));
            this.props.history.goBack();
        } else {
            let index = this.state.selected_hospitals.map(item => item.type).indexOf(2);
            console.log(index);
            if (index >= 0) {
                postData(this.staffsUrls.updateHospital(), {
                    yg_id: getSessionItem('yg_id'),
                    ids: this.state.selected_hospitals_id
                })
                    .then(res => {
                        sessionStorage.setItem('hospitals', JSON.stringify(this.state.selected_hospitals.map(item => JSON.stringify(item))));
                        this.props.history.goBack();
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }

    fetchItems(isReresh) {
        // 参数指示是否为加载更多页面
        if (isReresh) {
            this.page = 1;
        }
        this.searchHospital();
    }

    onTouchStart(event) {
        this.is_touching = true;
    }

    onTouchEnd(event) {
        this.is_touching = false;
    }

    onPullUp() {
        if (this.is_touching) {
            if (this.Jroll.y <= this.Jroll.maxScrollY - 10) {
                // 刷新
                this.state.pull_up_status !== 2 && this.setState({pull_up_status: 2});
            } else {
                //自然滚动
                this.state.pull_up_status !== 1 && this.setState({pull_up_status: 1});
            }
        }
    }

    onScroll() {
        // 判断上滑还是下滑
        if (this.state.y > this.Jroll.y) {
            // 向上滑
            // 当滑出底部且仍有拖拉事件事，触发刷新
            this.onPullUp();
        }
    }

    onScrollEnd() {
        // 滑动结束后，停在刷新区域
        // 滑动结束时 如果status为2，则有加载动作
        // 加载完成后，status重置为0,如果没有更多数据，则设置提示语tip为3
        if (this.Jroll.y <= this.Jroll.maxScrollY) {
            if (this.state.pull_up_status === 2) { // 发起了加载，那么更新状态
                this.setState({pull_up_status: 0});
                // 没有数据则不再调用加载
                if (!this.no_more) {
                    this.page++;
                    this.fetchItems(false);
                }
            }
        }
    }

    componentDidUpdate() {
        this.Jroll.refresh();
        return true;
    }

    componentWillUnmount() {
        // document.removeEventListener('touchmove', () => {
        //     event.preventDefault()
        // }, false);
    }
}