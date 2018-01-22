import React from 'react'
import {Link} from 'react-router-dom'
export class ConSn extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="full-h">
                <div className="p-a b-b shadow-bottom pos-a full-w bg-white" style={{left: 0,top:0,height: '.5rem'}}>
                    <span onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className=" p-a "
                     style={{backgroundColor: 'rgba(0,0,0,0.7)', minHeight: '100%', paddingTop: '.5rem'}}>
                    {
                        this.props.location.state.match(/.*(\.([png]|[gif]|[jpg]))/)
                            ? <img src={this.props.location.state} alt="营业执照" className="m-t full-w"/>
                            : <p className="t-c t-lg m-t" style={{color: '#fff'}}>暂无图片</p>
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        console.log(this.props.location.state);
    }
}