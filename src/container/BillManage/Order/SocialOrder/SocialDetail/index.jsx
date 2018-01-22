import React from 'react'
import {getData} from '../../../../../fetch/httpRequest'
import {BillManageUrls} from '../../../../../service/billManageApi/billManageUrl'

export class SocialDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.init = true;
        this.state = {
            fund: {
                gs: {},
                yg: {}
            },
            title: [],
            gs: {
                birth: {},
                lose: {},
                medical: {},
                old: {},
                work: {}
            },
            yg: {
                birth: {},
                lose: {},
                medical: {},
                old: {},
                work: {}
            },
            show: 'social'
        }
        document.title = '五险一金详情'
    }

    render() {
        return (
            <div>
                <div className="p-a b-b shadow-bottom bg-white">
                    <span onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right tab">
                        <span onClick={this.toggleShow.bind(this, 'social')}
                              className={this.state.show === 'social' ? 'active m-r-sm' : 'm-r-sm'}>社保</span>
                        <span onClick={this.toggleShow.bind(this, 'fund')}
                              className={this.state.show === 'fund' ? 'active' : ''}>公积金</span>
                    </span>
                </div>
                <div className="bg-white p-a b-b">
                    <p className="m-b-sm p-l">{this.props.location.state.yg_name}({this.state.show === 'social' ? '社保' : '公积金'})</p>
                    <div className="p-l">
                        <div className="d-ib p-r-xxl">
                            <p className="t-md bold">{
                                this.state.show === 'social'
                                    ? (isNaN(this.props.location.state.social_gs) ? this.props.location.state.social_gs : Number(this.props.location.state.social_gs).toFixed(2))
                                    : (isNaN(this.props.location.state.fund_gs) ? this.props.location.state.fund_gs : Number(this.props.location.state.fund_gs).toFixed(2))
                            }</p>
                            <p className="grey t-sm">公司部分合计</p>
                        </div>
                        <div className="d-ib ">
                            <p className="t-md bold">
                                {
                                    this.state.show === 'social'
                                        ? (isNaN(this.props.location.state.social_gr) ? this.props.location.state.social_gr : Number(this.props.location.state.social_gr).toFixed(2) )
                                        : (isNaN(this.props.location.state.fund_gr) ? this.props.location.state.fund_gr : Number(this.props.location.state.fund_gr).toFixed(2))
                                }
                            </p>
                            <p className="grey t-sm">个人部分合计</p>
                        </div>
                    </div>
                </div>
                <div className={this.state.show === 'social' ? '' : 'hide'}>
                    {
                        this.state.title.length === 0 && !this.init
                            ? <div className="p-a t-c">
                            <img src="/src/assets/image/none.svg" alt=""/>
                        </div>
                            : <div>
                            <h6 className="title">公司部分</h6>
                            <div className="bg-white b-t b-b">
                                <ul className="detail">
                                    {
                                        this.state.title.map((item, index) => {
                                            return (
                                                <li key={index}>
                                        <span>
                                            {this.state.gs[item][`title`]}
                                            <span className="grey t-sm">
                                                ({
                                                this.state.gs[item]['per'] === '-'
                                                    ? '-'
                                                    :
                                                    <span>{Number(this.state.gs[item]['per']) === 0 && (Number(this.state.gs[item][`other`]) > 0 || Number(this.state.gs[item][`fixed`]) > 0)
                                                        ? ''
                                                        : `${this.state.gs[item]['per']}%`
                                                    }
                                                        </span>
                                            }
                                                {
                                                    Object.keys(this.state.gs[item])
                                                        .filter(title_item => title_item !== 'title' && title_item !== 'money' && title_item !== 'per' && Number(this.state.gs[item][title_item]) > 0)
                                                        .map((detail_item, index) => {
                                                            return (
                                                                <span>
                                                                    {Number(this.state.gs[item]['per']) === 0 && index === 0 ? '' : '+'}
                                                                    {detail_item === 'fixed' || detail_item === 'other' ? `${this.state.gs[item][detail_item]}` : `${this.state.gs[item][detail_item]}%`}
                                                                </span>
                                                            )
                                                        })
                                                }
                                                )
                                            </span>
                                        </span>
                                                    <span
                                                        className="pull-right grey">{this.state.gs[item]['money']}</span>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <h6 className="title">个人部分</h6>
                            <div className="bg-white b-t b-b">
                                <ul className="detail">
                                    {
                                        this.state.title.map((item, index) => {
                                            return (
                                                <li key={index}>
                                        <span>
                                            {this.state.yg[item][`title`]}
                                            <span className="grey t-sm">
                                                ({
                                                this.state.yg[item]['per'] === '-'
                                                    ? '-'
                                                    :
                                                    <span>{Number(this.state.yg[item]['per']) === 0 && (Object.keys(this.state.yg[item])
                                                        .filter(title_item => title_item !== 'title' && title_item !== 'money' && title_item !== 'per' && Number(this.state.yg[item][title_item]) > 0).length > 0)
                                                        ? ''
                                                        : `${this.state.yg[item]['per']}%`
                                                    }
                                                        </span>
                                            }
                                                {
                                                    Object.keys(this.state.yg[item])
                                                        .filter(title_item => title_item !== 'title' && title_item !== 'money' && title_item !== 'per' && Number(this.state.yg[item][title_item]) > 0)
                                                        .map((detail_item, index) => {
                                                            return (
                                                                <span>
                                                                    {Number(this.state.yg[item]['per']) === 0 && index === 0 ? '' : '+'}
                                                                    {detail_item === 'fixed' || detail_item === 'other' ? `${this.state.yg[item][detail_item]}` : `${this.state.yg[item][detail_item]}%`}
                                                                </span>
                                                            )
                                                        })
                                                }
                                                )
                                            </span>
                                        </span>
                                                    <span
                                                        className="pull-right grey">{this.state.yg[item]['money']}</span>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </div>
                <div className={this.state.show === 'social' ? 'hide' : 'bg-white m-t-sm b-t b-b'}>
                    <ul className="detail">
                        <li>
                                <span>
                                   公司部分
                                    <span className="grey t-sm">
                                        (
                                        {
                                            this.state.fund.gs['per'] === '-'
                                                ? '-'
                                                :
                                                <span>{Number(this.state.fund.gs['per']) === 0 && (Number(this.state.fund.gs[`other`]) > 0 || Number(this.state.fund.gs[`fixed`]) > 0)
                                                    ? ''
                                                    : `${this.state.fund.gs['per']}%`
                                                }
                                                </span>
                                        }
                                        )
                                    </span>
                                </span>
                            <span
                                className="pull-right grey">{this.state.fund.gs['money']}</span>
                        </li>
                        <li>
                                <span>
                                   个人部分
                                    <span className="grey t-sm">
                                        ({
                                        this.state.fund.yg['per'] === '-'
                                            ? '-'
                                            : `${this.state.fund.yg['per']}%`
                                    })
                                        {/*{*/}
                                        {/*this.state.fund.yg['per'] !== '-' && Number(this.state.fund.yg[`other`]) > 0*/}
                                        {/*? <span>+{this.state.fund.yg[`other`]}</span>*/}
                                        {/*: ''*/}
                                        {/*}*/}
                                        {/*{*/}
                                        {/*this.state.fund.yg['per'] !== '-' && Number(this.state.fund.yg[`fixed`]) > 0*/}
                                        {/*? <span>+{this.state.fund.yg[`fixed`]}</span>*/}
                                        {/*: ''*/}
                                        {/*}*/}
                                    </span>
                                        </span>
                            <span
                                className="pull-right grey">{this.state.fund.yg['money']}</span>
                        </li>
                    </ul>
                </div>
            </div>

        )
    }

    componentDidMount() {
        getData(this.billManageUrls.getSocialDetail(), {
            social_id: this.props.location.state.social_id,
            fund_id: this.props.location.state.fund_id
        })
            .then(res => {
                let title = Object.keys(res.gs);
                this.setState({
                    title: title,
                    gs: res.gs,
                    yg: res.yg,
                    fund: res.fund,

                });
                this.init = false;
            })
    }

    toggleShow(str) {
        if (this.state.show !== str) {
            this.setState({
                show: str
            })
        }
    }
}