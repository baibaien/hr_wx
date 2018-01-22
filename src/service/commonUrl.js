import {RootApi} from './root-api/root-api'


export class CommonUrls {
    constructor() {
        this.rootApi = new RootApi()
    }
    getProvinces() {
        return `${this.rootApi.getRootUrl()}/user/city/get-provinces`;
    }
    getCities (province_id) {
        return `${this.rootApi.getRootUrl()}/user/city/${province_id}/get-cities`;
    }
    getDistricts (city_id) {
        return `${this.rootApi.getRootUrl()}/user/city/${city_id}/get-areas`;
    }
    //银行
    getBank() {
        return `${this.rootApi.getRootUrl()}/staff/tl-bank-code/`
    }
    //银行支行
    getSubBank() {
        return `${this.rootApi.getRootUrl()}/staff/open-bank-code/`
    }
    //上传图片前配置信息
    getPicConfig() {
        return `${this.rootApi.getRootUrl()}/wechat/qy/wechat-js-upolad-config`
    }
    getHome() {
        return `${window.location.protocol}//${window.location.host}/Index`
    }
}