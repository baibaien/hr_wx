import {RootApi} from "../root-api/root-api";


export class StaffsUrls {
    constructor() {
        this.rootApi = new RootApi()
    }
    // 转正提醒列表
    formalRemind() {
        return `${this.rootApi.getRootUrl()}/wechat/qy/formal-remind`
    }
    // 生日提醒列表
    birthRemind() {
        return `${this.rootApi.getRootUrl()}/wechat/qy/birth-remind`
    }
    // 周年提醒列表
    annualRemind() {
        return `${this.rootApi.getRootUrl()}/wechat/qy/hire-year-remind`
    }
    // 部门直属下员工列表和部门
    staffList() {
        return `${this.rootApi.getRootUrl()}/wechat/staff/`
    }
    // 员工详情
    staffDetail(id) {
        return `${this.rootApi.getRootUrl()}/wechat/staff/show?id=${id}`
    }
    // 待补全员工列表
    getUnCompelteStaffs () {
        // is_all_display=1&page&sort_id&sort&search
        return `${this.rootApi.getRootUrl()}/user/miss-info/index`
    }
    getUnCompeletMsg(yg_id) {
        return `${this.rootApi.getRootUrl()}/user/miss-info/detail?yg_id=${yg_id}`
    }
    updateCompeletMsg() {
        return `${this.rootApi.getRootUrl()}/user/miss-info/update`
    }
    //搜索员工列表
    searchStaff() {
        return `${this.rootApi.getRootUrl()}/wechat/staff`
    }
    //保存社保公积金状态
    saveSocialState() {
        return `${this.rootApi.getRootUrl()}/user/miss-info/store-status`
    }
    //更新员工补全信息
    updateStaffUncompelete() {
        return `${this.rootApi.getRootUrl()}/user/miss-info/update`
    }
    // 医院列表
    getHospitals() {
        return `${this.rootApi.getRootUrl()}/staff/hr-hospital/`
    }
    //员工定点医院更新Form
    getHospitalForm() {
        return `${this.rootApi.getRootUrl()}/staff/hr-yg-hospital/update-form`
    }
    //员工定点医院更新
    updateHospital() {
        return `${this.rootApi.getRootUrl()}/staff/hr-yg-hospital/update`
    }
    // 图片上传
    uploadImage() {
        return `${this.rootApi.getRootUrl()}/wechat/hr-yg-certificate-image/upload-wechat`
    }
}
