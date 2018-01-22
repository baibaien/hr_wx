import {RootApi} from '../root-api/root-api'

export class CommercialUrls {
    constructor() {
        this.rootApi = new RootApi()
    }
    // 商保列表
    getCommercial() {
        return `${this.rootApi.getRootUrl()}/pay/commercial/index`;
    }
    //设置员工商保
    setCommercial() {
        return `${this.rootApi.getRootUrl()}/pay/commercial/set`;
    }
    //购买商保
    buyCommercial() {
        return `${this.rootApi.getRootUrl()}/pay/commercial/buy`;
    }
   // 生成账单
    createBill() {
        // type = 1,2,3,4 工资， 社保公各积金，补缴，商保
        // query type, month=>current_month
        return `${this.rootApi.getRootUrl()}/pay/pay/createBill`
    }
}