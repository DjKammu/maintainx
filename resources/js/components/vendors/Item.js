import React, { Component } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <React.Fragment>

               <tr>
                       <td className="border px-4 py-3">{ this.props.obj.name }</td>
                        <td className="border px-4 py-3">{ this.props.obj.address }</td>
                        <td className="border px-4 py-3">{ this.props.obj.city }</td>
                        <td className="border px-4 py-3 w-auto">{ this.props.obj.state }</td>
                        <td className="border px-4 py-3 w-auto">{ this.props.obj.zip }</td>
                        <td className="border px-4 py-3">{ this.props.obj.phone_number }</td>
                        <td className="border px-4 py-3 w-auto">
                         <div className="szn-widget__action">
                            <Link to={{
                                pathname: `/vendors/${this.props.obj.id}`,
                                state: this.props.obj
                               
                            }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
                            <button type="button" className="btn btn-danger btn-sm btn-upper" onClick={() => this.props.onClickDeleteHandler(this.props.obj.id)}>Delete</button>
                        </div>
                        </td>
                
                </tr>

            </React.Fragment>
        )
    }
}

export default Item