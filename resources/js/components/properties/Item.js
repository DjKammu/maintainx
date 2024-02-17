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
                         <td className="border px-2 py-1">
                        {this.props.obj.layout_attachment && this.props.obj.layout_attachment.file && 
                          <a href={this.props.obj.layout_attachment.file} target="_blank" >
                          <img className="ext-img-sm" src={`/public/images/${this.props.obj.layout_attachment.ext}.png`} />
                          </a>}
                    
                            </td>
                             <td className="border px-2 py-1">
                            {this.props.obj.extra_attachment && this.props.obj.extra_attachment.file && 
                          <a href={this.props.obj.extra_attachment.file} target="_blank" >
                          <img className="ext-img-sm" src={`/public/images/${this.props.obj.extra_attachment.ext}.png`} />
                          </a>}
                            </td>

                        <td className="border px-4 py-3 w-auto">
                         <div className="input-group-prepend szn-widget__action">
                            <Link to={{
                                pathname: `/properties/${this.props.obj.id}`,
                                state: this.props.obj
                               
                            }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
                            <this.props.action fn={this.props.loadData} id={this.props.obj.id}
                             url={'/api/v1/properties'}/>
                             </div>
                        </td>
                
                </tr>

            </React.Fragment>
        )
    }
}

export default Item