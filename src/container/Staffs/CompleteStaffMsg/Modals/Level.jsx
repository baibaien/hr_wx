import React from 'react'
import {Link} from 'react-router-dom'
import {getData, postData} from '../../../../fetch/httpRequest'
import {StaffsUrls} from '../../../../service/staffs/staffsUrl'
import {selectedList} from '../../../../utils/selectOptions'

export class LevelModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log(this.props.data);
        this.state = {
            level: this.props.data.selected_level
        }
    }

    render() {
        return (
            <div className="bg-grey">
                <ul style={{maxHeight: '4rem', overflow: 'auto'}}>
                    {
                        this.props.data.levels.map((item, index) => {
                            return (
                                <li className="t-l bg-white b-t p-a" key={index}>
                                    <label className="ui-check full-w">
                                        <input type="checkbox"
                                               value={item.id}
                                               onChange={this.changeValue.bind(this, this.state.level, item.id)}
                                               checked={this.state.level.indexOf(item.id) >= 0}/>
                                        <i className="icon_ui v-m"></i>
                                        <span className="t v-m">{item.name}</span>
                                    </label>
                                </li>
                            )
                        })
                    }
                    {/*<li className="t-l bg-white b-t p-a">*/}
                        {/*<label className="ui-check full-w">*/}
                            {/*<input type="checkbox"*/}
                                   {/*value={99}*/}
                                   {/*onChange={this.changeValue.bind(this, this.state.level, 99)}*/}
                                   {/*checked={this.state.level.indexOf(99) >= 0}/>*/}
                            {/*<i className="icon_ui v-m"></i>*/}
                            {/*<span className="t v-m">社区医院</span>*/}
                        {/*</label>*/}
                    {/*</li>*/}
                </ul>
                <div className="t-c bg-white p-t p-b m-t-sm">
                    <span onClick={this.props.cancelClick}
                          className="v-m m-r p-l p-r">取消</span>
                    <span className="btn btn-sm v-m"
                          onClick={this.props.saveClick.bind(this, 'level', this.state.level)}>确定</span>
                </div>
            </div>
        )
    }

    changeValue(list, id) {
        const level = selectedList(list, id);
        this.setState({
            level: level
        })
    }
}