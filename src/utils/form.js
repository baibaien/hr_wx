import {validateRule} from './validators'

export function changeUnNecValue(target_path, event) {
    const source_data = target_path[0];
    const form_data = this.state[source_data];
    const e_value = event.target.value;
    let temp = form_data;
    //层级关系设置form_data
    target_path.forEach((value, index) => {
        if (index === target_path.length - 1) {
            temp[value] = e_value;
        } else if (index !== 0) {
            temp = temp[value];
        }
    });
    //设置form_data
    this.setState({
        [source_data]: form_data,
    });
}
// 传入上传表单组件名称， 表单元素路径设置表单值并传入校验方法数组
export function changeValue(target_path, validateFns, event) {
    const source_data = target_path[0];

    const form_data = this.state[source_data];
    const e_value = event.target.value;
    const origin_err = this.state[`${source_data}_err`];
    multipleValidate.call(this, origin_err, target_path, validateFns, e_value);
    let temp = form_data;
    //层级关系设置form_data
    target_path.forEach((value, index) => {
        console.log(index,value)
        if (index === target_path.length - 1) {
            console.log(temp);
            temp[value] = e_value;
        } else if (index !== 0) {
            console.log(temp, value);
            temp = temp[value];
        }
    });
    //设置form_data及错误信息
    this.setState({
        [source_data]: form_data,
        // [`${source_data}_err`]: Object.assign(origin_err, errors)
    });
}

export function submitValidate(source_data, target_path, validateFns, e_value) {
    const origin_err = this.state[`${source_data}_err`];
    console.log('err', origin_err, target_path);
    multipleValidate.call(this, origin_err, target_path, validateFns, e_value);
    // 设置错误信息
    // this.setState({
    //     [`${source_data}_err`]: errors
    // });
}

export function createErrorPath (target_path) {
    return {
        //将每个层级合并并以‘/’分隔标识，形成一级校验对照
        [target_path.join('/')] : {}
    }
}
// 校验信息平面校验，暂不删
function validate(origin_err, target_path, validateFns, value) {
    const key = target_path[target_path.length - 1];
    let multi_valid = false;
    validateFns.map((validateFn) => {
        let msg = validateRule(validateFn, value);
        if (msg) {
            origin_err[key] = `${msg}`;
        } else {
            // 多重校验则不删除错误提示
            if (!multi_valid) {
                origin_err[key] ? delete origin_err[key] : '';
            }
        }
        multi_valid = true;
    });
    return origin_err;
}
// 多层级校验
function multipleValidate(origin_err, target_path, validateFns, value) {
    // let temp_err = origin_err;
    // 设置错误校验路径
    let path = target_path.filter ((item, index) => index !== 0 && index !== target_path.length - 1);
    let key = path.join('/');
    let key_word = target_path[target_path.length - 1];
    let multi_valid = false;
    validateFns.map((validateFn) => {
        let msg = validateRule(validateFn, value);
        if (msg) {
            if (key !== '') {
                //判断是否为嵌套数据
                origin_err[key][key_word] = `${msg}`;
            }
            else {
                origin_err[key_word] = `${msg}`;
            }
        } else {
            // 多重校验则不删除错误提示
            if (!multi_valid) {
                //单重校验
                if (key !== '') {
                    origin_err[key][key_word] ? delete origin_err[key][key_word] : '';
                }else if (key === '') {
                    origin_err[key_word] ? delete origin_err[key_word] : '';
                }
            }
        }
        multi_valid = true;
    });
    this.setState({
        [`${target_path[0]}_err`]: origin_err
    })
}
