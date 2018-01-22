import React from 'react'
import {Link} from 'react-router-dom'
export class Authoration extends React.Component {
    render() {
        return (
            <div className="">
                <div className="p-a bg-white b-b shadow-bottom">
                </div>
                <div>
                <div className="p-a t-c">
                    <img src="/src/assets/image/author.png" alt="" className="m-b-lg m-t" style={{width: '1.3rem'}}/>
                    <p className="t-lg bold t-c">{this.state.name}请求访问您的账户信息</p>
                    <p className="t-c grey">该功能一般用于为您排除故障或解决问题</p>
                </div>
                <div className="bg-white">
                    <ul className="m-b-lg">
                        <li className="t-sm">授权期间的服务人员的操作将留有可审查的记录</li>
                        <li className="t-sm">同意授权后您可以在本页面随时终止授权；
                            服务人员完成服务后也会主动停止授权
                        </li>
                        <li className="t-sm">此次授权最长有效期为2小时，过期自动终止</li>
                    </ul>
                    <div>
                        <button className="btn" onClick={this.authored.bind(this)}>同意授权</button>
                        <button className="btn btn-sm" onClick={this.authored.bind(this)}>终止授权</button>
                    </div>
                    <p className="t-c grey t-sm">如果您不希望给予蚂蚁HR服务人员上述权限<br/>
                        忽略本请求即可，您无需做任何操作</p>
                </div>
                </div>
                <div>
                    <div className="p-a t-c">
                        <img src="/src/assets/image/author-end.png" alt="" className="m-b-lg m-t" style={{width:'1.3rem'}}/>
                        <p className="t-lg bold t-c">本次授权已终止</p>
                    </div>
                </div>
            </div>
        )
    }
    authored() {
        //授权
    }
}
