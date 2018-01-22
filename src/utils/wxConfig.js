import {postData} from '../fetch/httpRequest'
import {CommonUrls} from '../service/commonUrl'
import {showModal} from '../utils/modal'

let WX_CONFIG_URL = '';
export function getConfig(url) {
    let commonUrls = new CommonUrls();
    return postData(commonUrls.getPicConfig(), {url: url})
        .then(res => {
            // this.fail_msg = `appId:${res.signPackage.appId};
            // current_url:${window.location.href.split('#')[0]};
            // url: ${url};
            // timestamp:${res.signPackage.timestamp};
            // signatur: ${res.signPackage.signature};
            // nonceStr: ${res.signPackage.nonceStr}`;
            // showModal.call(this, 'fail', 'alert');
            wx.config({
                debug: false,
                appId: res.signPackage.appId,
                timestamp: res.signPackage.timestamp,
                nonceStr: res.signPackage.nonceStr,
                signature: res.signPackage.signature,
                jsApiList: res.signPackage.jsApiList
            });
        });
}
