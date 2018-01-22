import {RootApi} from '../root-api/root-api'

export class BillManageUrls {
    constructor() {
        this.rootApi = new RootApi()
    }

    // 待支付订单
    orderUnpaid() {
        return `${this.rootApi.getRootUrl()}/pay/order/unpaid`;
    }

    // 已支付订单
    orderPaid(op_status = '', date_type = '') {
        return `${this.rootApi.getRootUrl()}/pay/order/paid${op_status ? `?op_status=${op_status}` : ''}${date_type ? `${op_status ? `&` : `?`}date_type=${date_type}` : ''}`;
    }

    // 创建订单
    createOrder() {
        return `${this.rootApi.getRootUrl()}/pay/order/create`;
    }

    // 生成账单
    createBill() {
        // type = 1,2,3,4 工资， 社保公各积金，补缴，商保
        // query type, month=>current_month
        return `${this.rootApi.getRootUrl()}/pay/pay/createBill`
    }

    // 支付页详情
    getOrder(order_id) {
        return `${this.rootApi.getRootUrl()}/pay/order/to-pay/${order_id}`
    }

    // 上传凭证
    uploadPics() {
        console.log(1)
        return `${this.rootApi.getRootUrl()}/wechat/order/get-order-voucher-from-wechat`;
    }

    // 删除凭证
    delPics(order_id, voucher_id) {
        return `${this.rootApi.getRootUrl()}/pay/order/remove-payment-voucher/${order_id}/${voucher_id}`
    }

    // 未下单账单列表
    orderIndex() {
        return `${this.rootApi.getRootUrl()}/pay/order/index`;
    }

    // 待开票订单列表
    unFapiaoBill() {
        return `${this.rootApi.getRootUrl()}/invoice/uninvoiced/`;
    }

    // 开票中订单列表
    FapiaoBill() {
        return `${this.rootApi.getRootUrl()}/invoice/wait/`;
    }

    //删除账单
    deleteOrder(id) {
        return `${this.rootApi.getRootUrl()}/pay/order/delete-bill/${id}`;
    }

    // 账单明细
    getOrderDetail(id) {
        return `${this.rootApi.getRootUrl()}/pay/order/detail/${id}`;
    }

    // 订单明细
    getBillDetail(id) {
        return `${this.rootApi.getRootUrl()}/pay/order/order-detail/${id}`;
    }

    // 办理进度
    getBillProcess(order_id) {
        return `${this.rootApi.getRootUrl()}/pay/order/order-status-detail`;
    }

    // 五险一金操作状态
    getSocialState() {
        return `${this.rootApi.getRootUrl()}/pay/pay-progress`;
        // http://saas-api.mayitest.cn/pay/pay-progress?is_all_display=0&page=1&status=1
    }

    // 五险一金操作状态详情
    getSocialStateDetail(yg_id) {
        return `${this.rootApi.getRootUrl()}/pay/pay-progress-detail?yg_id=${yg_id}`
    }

    //工资账单列表
    getGzList() {
        return `${this.rootApi.getRootUrl()}/pay/pay?is_all_display=0`;
    }
    getBujiaoList() {
        return `${this.rootApi.getRootUrl()}/pay/pay/index-for-back`
    }

    //关闭员工工资
    closeStaffGz() {
        return `${this.rootApi.getRootUrl()}/pay/pay/change`;
    }

    // 计算工资
    clacGz() {
        return `${this.rootApi.getRootUrl()}/salary/salary/compute`;

    }

    // 工资详情
    gzDetail(id) {
        return `${this.rootApi.getRootUrl()}/salary/salary/show?id=${id}`;

    }

    //保存补缴月
    saveBujiao() {
        return `${this.rootApi.getRootUrl()}/pay/pay/add`;
    }

    //删除补缴月
    deleteBujiao() {
        return `${this.rootApi.getRootUrl()}/pay/pay/delBack`;
    }

    //获取单个员工操作月考勤
    getAttendance(yg_id, op_month) {
        return `${this.rootApi.getRootUrl()}/salary/${op_month}/${yg_id}/attendance-adjust`;
    }

    // 出勤调整
    adjustAttendance() {
        return `${this.rootApi.getRootUrl()}/salary/attendance-adjust`;
    }

    // 浮动工资、通用扣减
    getBonus(pay_month, type) {
        return `${this.rootApi.getRootUrl()}/salary/bonus?pay_month=${pay_month}&type=${type}`;
    }

    // 编辑浮动工资、通用扣减
    editBonus() {
        return `${this.rootApi.getRootUrl()}/salary/bonus/editBonus`;
    }

    // 申请开票
    applyFapiao() {
        return `${this.rootApi.getRootUrl()}/invoice/apply`;
    }

    // 局部发票修改
    editPartFapiao(order_id) {
        return `${this.rootApi.getRootUrl()}/pay/order/${order_id}/invoice`
    }

    // 账单个人状态调整
    updateBillOp() {
        return `${this.rootApi.getRootUrl()}/pay/pay/change`
    }
    // 账单中五险一金详情
    getSocialDetail() {
        return `${this.rootApi.getRootUrl()}/social/detail`
    }
    //查看付款凭证接口
    getFukuanPic(order_id) {
        return `${this.rootApi.getRootUrl()}/pay/order/show-payment-voucher/${order_id}`
    }
    //删除待支付账单
    deleteUnpaiedBill(order_id) {
        return `${this.rootApi.getRootUrl()}/pay/order/delete-order/${order_id}`
    }
    //微信支付
    payWx(order_id) {
        return `${this.rootApi.getRootUrl()}/wechat/wechat/unifiedorder/${order_id}`
    }
    //第三方支付
    payThird(order_id) {
        return `${this.rootApi.getRootUrl()}/third-platform/third-platform/payment`
    }

}