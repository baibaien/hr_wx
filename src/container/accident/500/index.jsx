import React from 'react'
import {Link} from 'react-router-dom'
import '../../../assets/styles/loading.css'
export class ServerBroken extends React.Component {
    render () {
        return (
            <div className="">
                <div className="p-a bg-white b-b shadow-bottom">
                    <span>
                        <Link to="/Index"><i className="icon_left_triangle grey v-m"></i>返回主页</Link>
                    </span>
                </div>
                <div className="p-a t-c">
                    <img src="/src/assets/image/500.svg" alt="" className="m-b-lg w-200 m-t" />
                    <p className="t-lg bold t-c">系统维护中</p>
                    <p className="t-c grey">请稍后重试，如有急需请致电 <a href="tel:400-686-9915">400-686-9915</a></p>
                </div>
            </div>
        )
    }
}
