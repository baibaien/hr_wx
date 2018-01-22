import React from 'react'
import {getData, postData} from '../../../../../fetch/httpRequest'
import {changeUnNecValue, changeValue, createErrorPath} from '../../../../../utils/form'
import {BillManageUrls} from '../../../../../service/billManageApi/billManageUrl'

//如无数据或需要添加一条空白记录（进行出勤调整）时，新建一条空值
class AddAttendance {
    constructor(type, staff_salary_id, salary_id, salary_effective_date) {
        this.duration = '';
        this.show_unit = 1;
        this.rate = 1;
        this.type = type;
        this.staff_salary_id = staff_salary_id;
        this.salary_id = salary_id;
        this.salary_effective_date = salary_effective_date
    }
}

//出勤调整
export class Attendance extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.billManageUrls = new BillManageUrls();
        this.yg_id = this.props.location.state.yg_id;
        this.pay_month = this.props.location.state.pay_month;
        this.sick_holiday = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        this.add_work = [1, 1.5, 2, 3];
        this.validates = {
            duration: [
                {
                    func_name: 'numberValid'
                }
            ]
        };
        this.state = {
            adjust: {},
            system: {
                1: [],
                2: [],
                3: []
            },
            err: '',
            adjust_err: {},
            adjust_data: {},
            title_year: []
        }
        document.title = '出勤调整'
    }

    render() {
        return (
            <div>
                <div className="bg-white clearfix b-b shadow-bottom">
                    <span className="" onClick={() => {
                        this.props.history.goBack()
                    }}><i className="icon_close p-a"></i></span>
                    <span className="pull-right p-a p-t-sm p-b-sm">
                        <span className="btn btn-sm" onClick={this.saveData.bind(this)}>保存</span>
                    </span>
                </div>
                <h6 className="title">系统中已存在</h6>
                <div className="m-b-sm">
                    <ul className="detail bg-grey b-t b-b">
                        <li className="">
                            无薪假
                            <div className="pull-right">
                                {
                                    this.state.system[1].length > 0
                                        ? this.state.system[1].map((system_item, system_index) => {
                                        return (
                                            <p className="grey t-sm"
                                               key={system_index}>{system_item.duration}</p>
                                        )
                                    })
                                        : '0小时'
                                }
                            </div>
                        </li>
                        <li className="">
                            病假
                            <div className="pull-right">
                                {
                                    this.state.system[2].length > 0
                                        ? this.state.system[2].map((system_item, system_index) => {
                                        return (
                                            <p className="grey t-sm"
                                               key={system_index}>
                                                {system_item.duration}{system_item.show_unit === 1 ? '小时' : '天'}
                                            </p>
                                        )
                                    })
                                        : '0小时'
                                }
                            </div>
                        </li>
                        <li className="">
                            加班
                            <div className="pull-right">
                                {
                                    this.state.system[3].length > 0
                                        ? this.state.system[3].map((system_item, system_index) => {
                                        return (
                                            <p className="grey t-sm"
                                               key={system_index}>
                                                {system_item.duration}{system_item.show_unit === 1 ? '小时' : '天'}
                                                @{`${system_item.rate }倍`}
                                            </p>
                                        )
                                    })
                                        : '0小时'
                                }
                            </div>
                        </li>
                    </ul>
                </div>
                {
                    this.state.title_year.map((item, index) => {
                        //根据时间循环多个时间段的调薪记录
                        const salary_effective_date = item;
                        const salary_id = this.state.adjust[item]['salary_id'];
                        const staff_salary_id = this.state.adjust[item]['staff_salary_id'];
                        return (
                            <div key={index} className="m-b-sm">
                                <h6 className="title">{this.state.adjust[item].time}</h6>
                                <h6 className="bg-grey p-a t-sm b-t">无薪假</h6>
                                <div className="bg-white m-b-xs b-b">
                                    <ul className="detail">
                                        <li>
                                            <span>时长</span>
                                            <span className="pull-right">
                                <input type="number"
                                       placeholder="输入时长"
                                       className="t-r"
                                       onChange={changeValue.bind(this,
                                           ['adjust', item, 'data', 1, 0, 'duration'],
                                           this.validates.duration)}
                                       value={this.state.adjust[item]['data'][1][0]['duration']}/>
                                                <p className="t-sm error t-r">{this.state.adjust_err[`${item}/data/1/0`]['duration']}</p>
                            </span>
                                        </li>
                                        <li>
                                            <span>单位</span>
                                            <span className="pull-right">
                                <select name="" id=""
                                        onChange={changeUnNecValue.bind(this,
                                            ['adjust', item, 'data', 1, 0, 'show_unit'],
                                        )}
                                        value={this.state.adjust[item]['data'][1][0]['show_unit'] === 1 ? '1' : '2'}>
                                    <option value="1">小时</option>
                                    <option value="2">日</option>
                                </select>
                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <h6 className="bg-grey p-a t-sm b-t">病假</h6>
                                <div className="bg-white m-b-xs b-b">

                                    {
                                        this.state.adjust[item]['data'][2].map((offline_item, offline_index) => {
                                            return (
                                                <ul className="detail" key={offline_index}>
                                                    <li>
                                                        <span>时长</span>
                                                        <span className="pull-right">
                                <input type="number"
                                       className="t-r"
                                       value={offline_item['duration']}
                                       onChange={changeValue.bind(this,
                                           ['adjust', item, 'data', 2, offline_index, 'duration'],
                                           this.validates.duration)}/>
                                                                <p className="t-sm error t-r">
                                                                    {console.log('text', this.state.adjust_err)}
                                                                    {this.state.adjust_err[`${item}/data/2/${offline_index}`]['duration']}
                                                                </p>
                                                            </span>

                                                    </li>
                                                    <li>
                                                        <span>单位</span>
                                                        <span className="pull-right">
                                <select name="" id=""
                                        onChange={changeUnNecValue.bind(this,
                                            ['adjust', item, 'data', 2, offline_index, 'show_unit'])}
                                        value={offline_item['show_unit'] === 1 ? '1' : '2'}>
                                    <option value="1">小时</option>
                                    <option value="2">日</option>
                                </select>
                            </span>
                                                    </li>
                                                    <li>
                                                        <span>发放比例</span>
                                                        <span className="pull-right">
                                <select name="" id=""
                                        onChange={changeUnNecValue.bind(this,
                                            ['adjust', item, 'data', 2, offline_index, 'rate'])}
                                        value={offline_item['rate']}>
                                    {this.sick_holiday.map((sick, sick_index) => {
                                            return (
                                                <option key={sick_index} value={sick}>
                                                    {`${Number(sick) * 100}%`}
                                                </option>
                                            )
                                        }
                                    )
                                    }
                                </select>
                                                            </span>
                                                    </li>
                                                </ul>
                                            )
                                        })
                                    }
                                </div>
                                <div className="m-b-sm bg-white p-a b-t b-b"
                                     onClick={this.addAttendance.bind(this, item, 2, staff_salary_id, salary_id, salary_effective_date)}>
                                    <i
                                        className="icon_plus m-r-xs v-m" style={{color: '#5b5b5b'}}></i>添加多个病假记录
                                </div>

                                <h6 className="bg-grey p-a t-sm b-t"> 加班</h6>
                                <div className="bg-white m-b-sm b-b">
                                    {
                                        this.state.adjust[item]['data'][3].map((add_item, add_index) => {
                                            return (
                                                <ul className="detail" key={add_index}>
                                                    <li>
                                                        <span>时长</span>
                                                        <span className="pull-right">
                                <input type="number"
                                       placeholder="输入时长"
                                       className="t-r"
                                       onChange={changeValue.bind(this,
                                           ['adjust', item, 'data', 3, add_index, 'duration'],
                                           this.validates['duration'])}
                                       value={add_item['duration']}/>
                                    <p className="t-sm error t-r">
                                        {/*{console.log(this.state.adjust_err[item]['data'])}*/}
                                        {this.state.adjust_err[`${item}/data/3/${add_index}`]['duration']}
                                    </p>
                            </span>
                                                    </li>
                                                    <li>
                                                        <span>单位</span>
                                                        <span className="pull-right">
                                <select name=""
                                        id=""
                                        onChange={changeUnNecValue.bind(this,
                                            ['adjust', item, 'data', 3, add_index, 'show_unit'])}
                                        value={add_item['show_unit'] === 1 ? '1' : '2'}>
                                    <option value="1">小时</option>
                                    <option value="2">日</option>
                                </select>
                            </span>
                                                    </li>
                                                    <li>
                                                        <span>发放比例</span>
                                                        <span className="pull-right">
                                <select name="" id=""
                                        onChange={changeUnNecValue.bind(this,
                                            ['adjust', item, 'data', 3, add_index, 'rate'])}
                                        value={add_item['rate']}>
                                    {this.add_work.map((add, add_index) => {
                                            return (
                                                <option key={add_index} value={add}>
                                                    {`${Number(add) }倍`}
                                                </option>
                                            )
                                        }
                                    )
                                    }
                                </select>
                                                            </span>
                                                    </li>
                                                </ul>
                                            )
                                        })

                                    }

                                </div>
                                <div className="m-b-sm bg-white p-a b-t b-b"
                                     onClick={this.addAttendance.bind(this, item, 3, staff_salary_id, salary_id, salary_effective_date)}>
                                    <i
                                        className="icon_plus m-r-xs v-m" style={{color: '#5b5b5b'}}></i>添加多个加班记录
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    componentDidMount() {
        getData(this.billManageUrls.getAttendance(this.yg_id, `${this.pay_month}`))
            .then(res => {
                const system = res.system;
                let {adjust, title_year} = this.formatData(JSON.parse(JSON.stringify(res.adjust)), Object.keys(res.adjust));
                let adjust_err = this.addErrorPath(adjust, title_year);
                this.setState({
                    adjust: adjust,
                    adjust_err: adjust_err,
                    title_year: title_year,
                    system: system
                });
            })
    }

    // 格式化初始数据
    formatData(adjust, title_year) {
        title_year.map(time => {
            // item => time, type => 类型
            const type = Object.keys(adjust[time].data);
            const staff_salary_id = adjust[time].staff_salary_id;
            const salary_id = adjust[time].salary_id;
            const salary_effective_date = time;
            type.forEach(type_item => {
                adjust = this.IsEmpty(adjust, time, type_item, staff_salary_id, salary_id, salary_effective_date);

            });
        });
        return {
            adjust: adjust,
            title_year: title_year,

        }
    }

    // 判断原始数据是否为空，空则创建空表单填充视图，不为空则格式化数据
    IsEmpty(adjust, time, type, staff_salary_id, salary_id, salary_effective_date) {
        if (adjust[time]['data'][type].length === 0) {
            adjust[time]['data'][type].push(new AddAttendance(type, staff_salary_id, salary_id, salary_effective_date));
        } else {
            adjust[time]['data'][type].map(item => {
                item['staff_salary_id'] = staff_salary_id;
                item['salary_id'] = salary_id;
                item['salary_effective_date'] = salary_effective_date;
            })
        }
        return adjust;
    }

    addErrorPath(adjust, title_year) {
        let adjust_err_arr = [];
        let adjust_err = {};
        title_year.map(time => {
            // item => time, type => 类型
            const type = Object.keys(adjust[time].data);
            let type_err = [];
            type.forEach(type_item => {
                // 生成在当前year 、 当前type 下的所有报错路径数组
                let errs = adjust[time]['data'][type_item].map((item, index) => {
                    return createErrorPath([time, 'data', type_item, index])
                });
                // type_err.concat(errs);
                // 合并当前year下，所有type下所有报错信息
                type_err = type_err.concat(errs);
                // year_err = year_err.concat(this.addErrorPath(adjust_temp, time, type_item));

            });
            // 合并所有报错信息
            adjust_err_arr = adjust_err_arr.concat(type_err);
        });


        adjust_err_arr.forEach(item => Object.assign(adjust_err, item));
        return adjust_err
    }

    addAttendance(time, type, staff_salary_id, salary_id, salary_effective_date) {
        let adjust = this.state.adjust;
        let adjust_err = this.state.adjust_err;
        let length = adjust[time]['data'][type].length;
        adjust[time]['data'][type].push(new AddAttendance(type, staff_salary_id, salary_id, salary_effective_date));
        adjust_err[`${time}/data/${type}/${length}`] = {};
        this.setState({
            adjust: adjust,
            adjust_err: adjust_err
        })
    }

    saveData() {
        console.log(this.state.adjust);
        let adjust = [];
        let submit_data = {
            pay_month: this.pay_month,
            yg_id: this.yg_id,
            adjust_data: []
        };
        this.state.title_year.map(year => {
            const title = Object.keys(this.state.adjust[year]['data']);
            title.forEach(type => {
                adjust = adjust.concat(this.state.adjust[year]['data'][type])
            })
            // this.state.adjust[year]['data'].forEach(value => {
            //     sumit_data.push(value)
            // })
        });
        console.log(adjust);
        submit_data = Object.assign(submit_data, {adjust_data: adjust});
        postData(this.billManageUrls.adjustAttendance(), submit_data)
            .then(res => {
                this.props.history.goBack()
            })
            .catch(err => {
            });
        console.log(submit_data);
    }
}