export function validateRule(validate_obj, val) {
    return ValidateMethod[validate_obj.func_name](val, validate_obj.arg);
}

class ValidateMethod {
    static required(val, arg) {
        let valid = true;
        if (!val || val === '') {
            valid = false;
        }
        return valid ? null : `${arg}`;
    };

    static postcodeValid(val) {
        let valid = true;
        if (val !== '') {
            valid = /^[0-9]\d{5}(?!\d)$/.test(val)
        }
        return valid ? null : `邮政编码为6位数字！`;
    };

    static taxValid(val) {
        let valid = true;
        if (val !== '') {
            valid = /^[a-zA-Z0-9]{15,20}$/.test(val);
        }
        return valid ? null : '纳税人识别号格式不正确!';
    };

    static mobileValid(val) {
        let valid = true;
        if (val != '') {
            valid = /^1[345789]\d{9}$/.test(val);
        }
        return valid ? null : '手机格式不正确!';
    };

    static emailValid(val) {
        let valid = true;
        if (val !== '') {
            valid = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val);
        }
        return valid ? null : '邮箱格式不正确！';
    };

    static phoneValid(val) {
        let valid = true;
        if (val !== '') {
            valid = /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/.test(val);
        }
        return valid ? null : '固定电话格式不正确！';
    };

    static cardValid(val) {
        let valid = true;
        if (val !== '') {
            valid = /^(\d{16}|\d{19})$/.test(val);
        }
        return valid ? null : '银行卡格式不正确！';
    };

    static captchaValid(val) {
        let valid = true;
        if (val !== '') {
            valid = /^\d{4}$/.test(val);
        }
        return valid ? null : '验证码格式不正确！';
    };

    static minLength(val, arg) {
        let valid = true;
        if (val !== '') {
            // val = val.replace(/(^\s*)|(\s*$)/g);
            valid = val.length >= arg
        }
        return valid ? null : `长度不得低于${arg}`
    };

    static passWordValid(val) {
        let valid = true;
        if (val !== '') {
            valid = /^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{8,16}$/.test(val);
        }
        return valid ? null : '密码只能8~16位由数字、字母组成！';
    };

    static nameValid(val) {
        let valid = true;
        if (val != '') {
            // 中英文字符，不限字数
            valid = /^[\u4E00-\u9FA5A-Za-z]+$/.test(val);
        }
        return valid ? null : '联系人姓名只能为中英文字符';
    }

    static numValid(val) {
        // 正整数
        let valid = true;
        if (val !== '') {
            valid = /^[0-9]+$/.test(val);
        }
        return valid ? null : `请填写正整数！`;
    };

    static numberValid(val) {
        //两位正小数
        let valid = true;
        if (val !== '') {
            valid = /^[0-9]+(.[0-9]{1,2})?$/.test(val);
        }
        return valid ? null : '请填写两位正小数！';
    };

}
