import React from 'react';
import {Link} from 'react-router-dom'

export class StaffDetailPhotos extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log(this.props.location.state);
        this.state = {
            photos: this.props.location.state,
            src_url: {}
        };
    }

    render() {
        this.setUrls();
        return (
            <div>
                <div className="bg-white p-a b-b m-b-sm shadow-bottom">
                    <span onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className="bg-white b-t b-b">
                    <ul className="detail">
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Photos/type/1`,
                                    state: this.state.src_url.id_url
                                }
                            }>
                                <span className="grey">身份证正面</span>
                                <span className="pull-right">
                                    {
                                        this.state.src_url.id_url !== ''
                                            ? <img src={this.state.src_url.id_url}
                                                   style={{width: '.5rem', height: '.25rem'}}/>
                                            : '暂无'
                                    }
                            </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Photos/type/2`,
                                    state: this.state.src_url.id_reverse_url
                                }
                            }
                            >
                                <span className="grey">身份证反面</span>
                                <span className="pull-right">
                                    {
                                        this.state.src_url.id_reverse_url !== ''
                                            ? <img src={this.state.src_url.id_reverse_url}
                                                   style={{width: '.5rem', height: '.25rem'}}/>
                                            : '暂无'
                                    }
                            </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={
                                {
                                    pathname: `/Staffs/Detail/${this.props.match.params.yg_id}/Photos/type/7`,
                                    state: this.state.src_url.white_url
                                }
                            }>
                                <span className="grey">2寸白底免冠照</span>
                                <span className="pull-right">
                                    {
                                        this.state.src_url.white_url
                                            ? <img src={this.state.src_url.white_url}
                                                   style={{width: '.5rem', height: '.25rem'}}/>
                                            : '暂无'

                                    }
                            </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    componentDidMount() {

    }

    setUrls() {
        let src_url = {
            id_url: '',
            id_reverse_url: '',
            white_url: ''
        };
        this.props.location.state.map(item => console.log(item.url));
        this.props.location.state.map((item) => {
            switch (item.type) {
                case 1:
                    src_url.id_url = item.url;
                    break;
                case 2:
                    src_url.id_reverse_url = item.url;
                    break;
                case 6:
                    src_url.white_url = item.url;
                    break;
                default:
                    break
            }
        });
        this.state.src_url = src_url
        console.log(this.state.src_url);
    }

}