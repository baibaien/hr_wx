import React from 'react'
import {cancelModal} from '../../../utils/modal'

export class UnBindModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="bg-white t-c p-a">
                <p className="m-b">解除绑定后您需要重新绑定才能在微信中使用蚂蚁HR服务</p>
                <div className="btn-group p-a t-c">
                    <button className="btn btn-sm disabled" onClick={cancelModal.bind(this.props.parent_this)}>取消</button>
                    <button className="btn btn-sm m-l " onClick={this.props.confirmUnbind.bind(this.props.parent_this)}>确定</button>
                </div>
            </div>
        )
    }

}