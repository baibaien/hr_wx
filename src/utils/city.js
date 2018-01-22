import {getData} from '../fetch/httpRequest'
import {CommonUrls} from '../service/commonUrl'

export function selectProvince() {
    const commonUrls = new CommonUrls();
    return getData(commonUrls.getProvinces())
        .then(res => {
            this.setState({
                    provinces: res.data,
                    cities: [],
                    district: []
                }
            )
        });
}

export function selectCity(province_id, is_reset = false) {
    const commonUrls = new CommonUrls();
    return getData(commonUrls.getCities(province_id))
        .then(res => {
            this.setState({
                    cities: res.data,
                    districts: []
                }
            )
        });
}

export function selectDistrict(city_id, is_reset = false) {
    const commonUrls = new CommonUrls();
    return getData(commonUrls.getDistricts(city_id))
        .then(res => {
            this.setState({
                    districts: res.data
                }
            )
        });
}

function saveDistrict(event) {
    this.addr_name.district_name = event.target.selectedOptions[0].innerHTML;
}
