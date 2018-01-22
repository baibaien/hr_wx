import React from 'react'
import {getData} from '../../../fetch/httpRequest'
import {HomePageUrls} from '../../../service/homepage/homepageUrl'

export class HelpModal extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.homePageUrls = new HomePageUrls();
        this.state = {
            sale_phone: '',
            sales: [{true_name: ''}],
            custom_phone: '',
            custom_services: [{true_name: ''}]
        }
    }

    render() {
        return (
            <div className="bg-grey">
                <p className="p-t-sm p-b-sm grey t-sm t-c bg-white">工作日9:00~18:00</p>
                <ul>

                    <li className="t-c bg-white b-t p-t p-b">
                        <a href="tel:4006869915">{this.state.sale_phone}{this.state.sales.length === 0 ? '' : this.state.sales[0]['crm_id']}</a>
                        {
                            this.state.sales.length === 0
                                ? ''
                                :
                                <span className="grey t-sm d-b full-w t-c">销售: {this.state.sales[0]['true_name']}</span>
                        }
                    </li>

                    <li className="t-c bg-white b-t p-t p-b m-b-sm">
                        <a href="tel:4006869915">{this.state.custom_phone}{this.state.custom_services.length === 0 ? '' :this.state.custom_services[0]['crm_id']}</a>
                        {
                            this.state.custom_services.length === 0
                                ? ''
                                : <span
                                className="grey t-sm d-b full-w t-c">专属客服：{this.state.custom_services[0]['true_name']}</span>
                        }
                    </li>

                    <li className="t-c bg-white p-t p-b" onClick={this.props.cancelClick}>取消</li>
                </ul>
            </div>
        )
    }

    componentDidMount() {
        getData(this.homePageUrls.saasSupport())
            .then(res => {
                this.setState({
                    custom_services: res.custom_services,
                    custom_phone: res.custom_phone,
                    sales: res.sales,
                    sale_phone: res.sale_phone
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}