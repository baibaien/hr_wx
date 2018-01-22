import React from 'react'
import {Link} from 'react-router-dom'
import {getData, postData} from '../../../../fetch/httpRequest'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {selectedList, } from '../../../../utils/selectOptions'

export class SelectModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log(this.props.data);
    }

    render() {
        return (
            <div className="bg-grey">
                <ul style={{maxHeight:'4rem',overflow: 'auto'}}>
                    <li className="b-t bg-white p-a">
                        已选中
                        <span className={this.props.data.map(item => item.type).indexOf(2) >= 0 ? 'hide' : 'm-l grey'}>请选择至少一家社区医院</span>
                        <span className="pull-right">
                        <span className="label success">
                            {this.props.data.length}
                        </span>
                        <i className="icon_angle_dow"></i>
                    </span>
                    </li>
                    {
                        this.props.data.map((item, index) => {
                            return (
                                <li className="t-l bg-white b-t p-a" key={index}>
                                    <span className="">{item.name}</span>
                                    <span className="pull-right" onClick={this.props.deleteClick.bind(this, item.id)}><i className="icon_trash"></i><i className="icon_close"></i></span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }


}