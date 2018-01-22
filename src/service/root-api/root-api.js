export class RootApi {
    constructor() {
        const url_config = {
            'dev.saas.hr.com': 'http://api.saas.hr.com',
            'www.mayitest.cn': 'https://saas-api.mayitest.cn',
            'localhost:8080': 'https://saas-api.mayitest.cn',
            'gs-3rd.mayitest.cn': 'https://saas-api.mayitest.cn',
            'yg-3rd.mayitest.cn': 'https://saas-api.mayitest.cn',
            'www.mayicrm.com': 'http://saas-api.mayicrm.com',
            'www.mayihr.com': 'https://saas-api.mayihr.com',
            'gs.mayihr.com':'https://saas-api.mayihr.com',
            'yg.mayihr.com': 'https://saas-api.mayihr.com'
        };
        this.tmp = window.location.host;
        this.root_dir = url_config[this.tmp];
    }

    getRootUrl() {
        return this.root_dir;
    }
}

