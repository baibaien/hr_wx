import {RootApi} from '../root-api/root-api'


export class NoticeUrls {
    constructor() {
        this.rootApi = new RootApi()
    }

    getNoticeList() {
        return `${this.rootApi.getRootUrl()}/user/me/notices`
    }

    getUnreadList() {
        return `${this.rootApi.getRootUrl()}/user/me/unread-notice-amount`
    }
    setAllRead() {
        return `${this.rootApi.getRootUrl()}/user/notices/set-readed`
    }
    getNoticeDetail(id) {
        return `${this.rootApi.getRootUrl()}/user/${id}/notice`
    }
}