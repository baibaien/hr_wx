import React from 'react'
import {NoticeUrls} from '../../../service/Notice/noticeUrl'
import {getData} from '../../../fetch/httpRequest'

export class NotDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.noticeUrls = new NoticeUrls();
        this.state = {
            content: '',
            title: '',
            time: ''
        };

    }

    render() {
        return (
            <div className="full-h" style={{paddingTop: '.5rem'}}>
                <div className="p-a m-b-sm bg-white b-b shadow-bottom" style={{marginTop: '-.5rem'}}>
                    <span className="cursor"
                          onClick={() => {
                              this.props.history.goBack()
                          }}><i className="icon_left_triangle grey v-m"></i>返回</span>
                </div>
                <div className="bg-white b-t b-b p-a " style={{minHeight: '100%'}}>
                    <h6 className="t-md bold">{this.state.title}</h6>
                    <p className="t-sm grey">{this.state.time}</p>
                    <div className="m-t-sm" id="content"></div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        document.title = '通知详情';
        getData(this.noticeUrls.getNoticeDetail(this.props.match.params.id))
            .then(res => {
                let content = this.htmlDecodeByRegExp(res.data.content);
                this.setState({
                    content: content,
                    title: res.data.title,
                    time: res.data.create_time
                })
                document.getElementById('content').innerHTML = content;
            })
    }

    htmlDecodeByRegExp(str) {
        let s = '';
        if (str.length == 0) return '';
        s = str.replace(/&amp;/g, '&');
        s = s.replace(/&lt;/g, '<');
        s = s.replace(/&gt;/g, '>');
        s = s.replace(/&nbsp;/g, ' ');
        s = s.replace(/&#39;/g, '\'');
        s = s.replace(/&quot;/g, '\'');
        return s;
    }
}