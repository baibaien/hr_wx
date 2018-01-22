import React from 'react'
import {cancelModal, setAlert} from "../../utils/modal"

export class AlertModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show_modal: '',
            modal_in: '',
            modal_name: '',
            data_string: '',
            data_array: []
        };
        setAlert(this);
    }

    render() {
        return (
            <div >
                <div id="alert" className={`pos-f full-w modal alert ${this.state.show_modal}`}>
                    <div className="modal-mask pos-f"
                         onClick={cancelModal.bind(this)}></div>
                    <div className={`wrapper setting pos-a p-a bg-white b-radius  ${this.state.modal_in}`}>
                        <div className="m-b">
                            {
                                this.state.data_string
                            }
                            {
                                this.state.data_array.map((item, index) => {
                                    return (
                                        <div key={index} className="alert-list">
                                            {item}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="btn-group t-c">
                            <button className="btn btn-sm" onClick={cancelModal.bind(this)}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}