import {RootApi} from '../root-api/root-api'
export class SettingsUrls {
    constructor() {
        this.rootApi = new RootApi();
    }
    getSignInfo() {
        return `${this.rootApi.getRootUrl()}/user/users/show-sign-all`;
    }
    updateSignInfo() {
        return `${this.rootApi.getRootUrl()}/user/users/update-sign-info`
    }
    updateAddress(id) {
        return `${this.rootApi.getRootUrl()}/user/hr-address/${id}/update`
    }
    addAddress() {
        return `${this.rootApi.getRootUrl()}/user/hr-address/store`
    }
    getHrAddress() {
        return `${this.rootApi.getRootUrl()}/user/hr-address/`;
    }
    getFapiao() {
        return `${this.rootApi.getRootUrl()}/user/hr-fapiao-info/`;
    }
    updateFapiao() {
        return `${this.rootApi.getRootUrl()}/user/hr-fapiao-info/update`
    }
    getContact() {
        return `${this.rootApi.getRootUrl()}/user/hr-contact-info/show`
    }
    updateContact() {
        return `${this.rootApi.getRootUrl()}/user/hr-contact-info/update`
    }

    // 设置页全部信息
    getSettings() {
        return `${this.rootApi.getRootUrl()}/user/hr-fapiao-info/`
    }
    //
    getPosition() {
        return `${this.rootApi.getRootUrl()}/user/hr-gs-zhiwei/`
    }
}