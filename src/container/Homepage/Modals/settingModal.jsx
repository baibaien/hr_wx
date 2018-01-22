import React from 'react'
import {Link} from 'react-router-dom'
import {showModal} from '../../../utils/modal'

export class SettingModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div className="bg-grey">
                <p className="p-t-sm p-b-sm grey t-sm t-c bg-white">请选择需要管理和设置的项目</p>
                <ul>
                    <li className="t-c bg-white b-t p-t p-b"><Link to="/Settings/SignInfo">签约信息</Link>
                    </li>
                    <li className="t-c bg-white b-t p-t p-b"><Link to="/Settings/Fapiao">发票信息</Link>
                    </li>
                    <li className="t-c bg-white b-t p-t p-b"><Link to="/Settings/Contact">联系人信息</Link>
                    </li>
                    <li className="t-c bg-white b-t p-t p-b"><Link to="/Settings/Address">邮寄地址</Link>
                    </li>
                    <li className="t-c m-b-sm bg-white b-t error p-t p-b"
                    onClick={showModal.bind(this.props.parent_this, 'unbind', 'alert')}>解除账号绑定</li>
                    <li className="t-c bg-white p-t p-b" onClick={this.props.cancelClick}>取消</li>
                </ul>
            </div>
        )
    }

}