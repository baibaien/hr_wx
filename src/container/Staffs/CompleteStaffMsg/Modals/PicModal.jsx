import React from 'react'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'

export class PicModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.staffsUrls = new StaffsUrls();
    }

    render() {
        return (
            <div className="bg-white p-b">
                <div className="p-a t-c">
                    {
                        this.props.url == ''
                            ? ''
                            : <img src={this.props.url} alt="" className="full-w"/>
                    }

                    <p className="t-c">请确保图片中的证件完整、边缘无遮挡;<br/>文字与图像清晰可见</p>
                </div>
                <div className="t-c">
                    <button className="btn" onClick={this.props.onUpload.bind(this.props.parent_this, this.props.type)}>
                        我了解了，继续上传
                    </button>
                </div>
            </div>
        )
    }
}