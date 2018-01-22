import React from 'react'
import {Link} from 'react-router-dom'
import {changeUnNecValue} from '../../utils/form'

export class Search extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.setting = this.props.setting;
        this.parent_this = this.props.setting.parent_this;
        this.state = {
            search_data: {
                search: ''
            },
            show_search: false,
        }
    }

    render() {
        const search_style = {
            height: '0.5rem',
        }
        return (
            <div className="">
                <div className={`${this.state.show_search ? 'hide' : ''} `}
                     style={search_style}>
                    <span className="cursor" onClick={this.props.goBack.bind(this.props.setting.parent_this)}>
                        <i className="icon_left_triangle grey v-m"></i>返回</span>
                    <span className="pull-right cursor" onClick={this.showSearch.bind(this)}>
                        <i className="icon_search v-m " style={{color: '#adadad'}}></i>点击搜索</span>
                </div>
                <div className={`${this.state.show_search ? '' : 'hide'}`}
                     style={search_style}>
                    <span className="pull-left b-r p-t p-b p-r cursor"
                          style={{lineHeight: '.2rem'}}
                          onClick={this.cancelSearch.bind(this)}
                    ><i className="icon_close"></i></span>
                    <div className="" style={{marginLeft: '.3rem'}}>
                        <input type="text"
                               placeholder={this.setting.placeholder}
                               value={this.state.search_data.search}
                               className="v-m full-w"
                               style={{marginRight: '-.7rem', paddingRight: '0', boxSizing: 'border-box'}}
                               onChange={changeUnNecValue.bind(this, ['search_data', 'search'])}
                        />
                        <button className="btn btn-sm v-m cursor" style={{width: '.6rem'}} onClick={this.search.bind(this)}>搜索
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    showSearch() {
        this.setState({
            show_search: true
        });
        this.props.setting.reset_data.forEach((item) => {
            this.parent_this.setState({
                [item]: []
            })
        })
    }

    search() {
        this.props.onSearch(this.parent_this, this.state.search_data.search, true);
    }

    cancelSearch() {
        // let url = this.props.setting.refresh_url;
        this.setState({
            show_search: false,
            search_data: {
                search: ''
            }
        });
        this.props.onRefreshPage(this.parent_this, '', true);
    }
    toggleEdit() {
        this.edit = !this.edit;
    }
}