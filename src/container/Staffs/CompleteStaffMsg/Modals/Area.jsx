import React from 'react'
import {selectedList} from '../../../../utils/selectOptions'

export class AreaModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            area: this.props.data.selected_area,
        }
    }

    render() {
        return (
            <div className="bg-grey">
                <ul style={{maxHeight:'4rem',overflow: 'auto'}}>
                    {
                        this.props.data.areas.map((item, index) => {
                            return (
                                <li className="t-l bg-white b-t p-a" key={index}>
                                    <label className="ui-check full-w">
                                        <input type="checkbox"
                                               value={item.id}
                                               onChange={this.changeValue.bind(this, this.state.area, item.id)}
                                               checked={this.state.area.indexOf(item.id) >= 0}/>
                                        <i className="icon_ui v-m"></i>
                                        <span className="v-m t">{item.name}</span>
                                    </label>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="t-c bg-white p-t p-b m-t-sm" >
                    <span onClick={this.props.cancelClick}
                    className="v-m m-r">取消</span>
                    <span className="btn btn-sm v-m"
                          onClick={this.props.saveClick.bind(this, 'area_id',  this.state.area)}>确定</span>
                </div>
            </div>
        )
    }

    changeValue(list, id) {
        const area = selectedList( list, id);
        this.setState({
            area: area
        })
    }
}