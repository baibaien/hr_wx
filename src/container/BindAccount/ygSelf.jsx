import React from 'react'
import {Link} from 'react-router-dom'

export class YgSelf extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="bg-white t-c full-h full-w p-a" >
                <img src="/src/assets/image/ygself-qrcode.png" alt="" style={{width: '3rem'}}
                className="m-b"/>
                <p className="t-md t-c">扫描或长按识别二维码使用员工自助</p>
                <p className="grey t-c">支付会员企业的员工查看电子档案、薪资待遇和工资条等</p>
                <div className="t-c full-w pos-a p-a" style={{bottom: '.3rem', left: '0'}}>
                    <span className="btn full-w"><Link to="/Bind">返回绑定HR账号</Link></span>
                </div>
            </div>
        )
    }
}