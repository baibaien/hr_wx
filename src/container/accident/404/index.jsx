import React from 'react'
import {Link} from 'react-router-dom'
export class NotFound extends React.Component {
    render () {
        return (
            <div className="">
                <div className="p-a bg-white b-b shadow-bottom">
                    <span>
                        <Link to="/Index"><i className="icon_left_triangle grey v-m"></i>返回主页</Link>
                    </span>
                </div>
                <div className="p-a t-c">
                    <img src="/src/assets/image/404.svg" alt="" className="m-b-lg w-200 m-t"/>
                    <p className="t-lg bold t-c">您访问的页面不存在</p>
                    <p className="t-c grey">如有疑问请联系客服</p>
                </div>
            </div>
        )
    }
}
