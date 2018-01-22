import {RootApi} from '../root-api/root-api'

export class FapiaoUrls {
    // 公司发票信息
    constructor() {
        this.rootApi = new RootApi();
    }
    FapiaoDetail() {
        return `${this.rootApi.getRootUrl()}/user/hr-fapiao-info/`;
    }
    //更新发票信息
    updateFapiao() {
        return `${this.rootApi.getRootUrl()}/user/hr-fapiao-info/update`;
    }
}