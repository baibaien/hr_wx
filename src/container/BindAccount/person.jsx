import React from 'react'
import {Link} from 'react-router-dom'
import {postData} from '../../fetch/httpRequest'
import {StaffsUrls} from '../../service/staffs/staffsUrl'

export class Person extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.staffsUrls = new StaffsUrls();
    }

    render() {
        return (
            <div className="bg-grey t-c full-h">
                <div className="p-t-xxl">
                    <img src="/src/assets/image/invalid-name.png" alt="" className="m-t" style={{width: '50%'}}/>
                </div>
                <div className=" p-t t-c">
                    <p className="t-c t-md">您是个人用户，请关注“蚂蚁社保”</p>
                    <p className="grey t-sm t-c">“蚂蚁HR”公众号只针对企业用户提供服务</p>
                </div>
            </div>
        )
    }


}