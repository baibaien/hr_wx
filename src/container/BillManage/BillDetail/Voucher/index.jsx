import React from 'react'
import {postData, getData} from '../../../../fetch/httpRequest'
import {BillManageUrls} from '../../../../service/billManageApi/billManageUrl'
import {showAlertModal, getAlertData} from '../../../../utils/modal'


export class BillVoucher extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.order_id = this.props.match.params.order_id;
        this.clientWidth = 0;
        //标记touch状态， -1: 没有移动动作; 0: 开始新一次触摸手势; 1: 完成一次触摸动作
        this.touching = -1;
        // this.current_index = 0;
        this.transform_x = 0;
        this.state = {
            img_urls: [],
            current_index: 0,
            transform_x: 0,
        };
        this.init = true;
        document.title = '付款凭证'

    }

    render() {
        const style = {
            whiteSpace: 'nowrap',
            transition: 'all .2s ease',
            transform: `translateX(${this.state.transform_x}px)`,
        }
        return (
            <div className="full-h full-w" ref='client_wrapper' style={{paddingTop: '.5rem'}}
                 onTouchStart={this.touchStart.bind(this)}
                 onTouchMove={this.touchMove.bind(this)}
                 onTouchEnd={this.touchEnd.bind(this)}>
                <div className="bg-white b-b p-a pos-f" style={{left: 0, top: 0, right: 0, height: '.5rem'}}>
                    <span className="cursor" onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right">
                        <i className="icon_left_triangle grey p-l p-r v-m cursor"
                           onClick={this.scrollBack.bind(this)}></i>
                        <span className="grey v-m">
                            {this.state.img_urls.length === 0 ? 0 : this.state.current_index + 1}/{this.state.img_urls.length}
                        </span>
                        <i className="icon_right_triangle p-l v-m cursor"
                           onClick={this.scrollPrev.bind(this)}></i>
                    </span>
                </div>
                {
                    this.state.img_urls.length === 0 && !this.init
                        ? <div className="p-a t-c">
                        <img src="/src/assets/image/none.svg" alt=""/>
                    </div>
                        : <div className="full-h full-w"  style={{overflow: 'hidden'}}>
                        <ul className="d-b full-h " style={style}>
                            {
                                this.state.img_urls.map((item, index) => {
                                    return (
                                        <li className="full-h d-ib p-a border-box full-w"
                                            key={index}
                                            style={{background: 'rgba(0,0,0,0.7)'}}>
                                            <img src={item.real_path} alt="" className="full-w full-h"/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                }

            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.getFukuanPic(this.props.match.params.order_id))
            .then(res => {
                this.init = false;
                this.setState({
                    img_urls: res,
                });
            });
        this.clientWidth = this.refs.client_wrapper.clientWidth;
    }

    scrollPrev() {
        if (this.state.current_index < this.state.img_urls.length - 1) {
            let x = this.state.transform_x;
            x = x - this.clientWidth;
            let current_index = this.state.current_index + 1;
            this.setState({
                transform_x: x,
                current_index: current_index
            })
        }
    }

    scrollBack() {
        if (this.state.current_index > 0) {
            let x = this.state.transform_x;
            x = x + this.clientWidth;
            console.log('x', x);
            let current_index = this.state.current_index - 1;
            this.setState({
                transform_x: x,
                current_index: current_index
            })
        }
    }

    touchStart(event) {
        this.touching = 0;
        this.setState({
            start_x: event.changedTouches[0].pageX
        })
    }

    touchMove(event) {
        event.preventDefault();
        let current_x = event.changedTouches[0].pageX;
        if (this.touching === 0) {
            if (current_x < this.state.start_x - 5) {
                //向前滑
                this.scrollPrev();
            } else if (current_x > this.state.start_x + 5) {
                // 向右滑
                console.log('right')
                this.scrollBack();
            }
        }
        this.touching = 1;
    }

    touchEnd() {
        this.touching = -1;
        this.setState({
            start_x: 0
        })
    }
}