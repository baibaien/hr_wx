import React from 'react'
import {Link} from 'react-router-dom'
export class PhotoDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>
                <div className="p-a b-b shadow-bottom">
                    <span className="cursor" onClick={() => {this.props.history.goBack()}}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className="full-h p-a pos-f" style={{backgroundColor:'rgba(0,0,0,0.7)', top: '.5rem', left:0,bottom:0,right:0}}>
                    {
                        this.props.location.state === ''
                            ? <p className="t-c t-lg m-t" style={{color: '#fff'}}>暂无图片</p>
                            : <img src={this.props.location.state} className="m-t full-w"/>
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
    }
}