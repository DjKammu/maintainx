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
                        <td className="border px-4 py-3">{ this.props.obj.brand }</td>
                        <td className="border px-4 py-3">{ this.props.obj.asset_type_name }</td>
                        <td className="border px-4 py-3">{ this.props.obj.property_type_name }</td>
                        <td className="border px-4 py-3">{ this.props.obj.property_name }</td>
                        <td className="border px-4 py-3">{ this.props.obj.area_name }</td>
                        <td className="border px-4 py-3">{ this.props.obj.sub_area_name }</td>
                        <td className="border px-4 py-3"> { this.props.obj.account_number }</td>
                        <td className="border px-4 py-3">{ this.props.obj.serial_number }</td>
                        <td className="border px-2 py-1">
                        {this.props.obj.media && this.props.obj.media.length > 0 && 
                                                       
                           this.props.obj.media.map((element, index) => (
                             <a key={index} className="col-span-3 sm:col-span-3 delete-file" href={element.file} target="_new">
                               <img className="ext-img-sm" src={`/public/images/${element.ext}.png`} />
                             </a>
                          ))
                        }
                    
                            </td>
                            <td className="border px-4 py-3 w-auto">
                         <div className="szn-widget__action input-group-prepend">
                            <Link to={{
                                pathname: `/asset-model/${this.props.obj.id}`,
                                state: this.props.obj
                               
                            }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
                            <this.props.action fn={this.props.loadData} id={this.props.obj.id}
                             url={'/api/v1/asset-model'}/>
                        </div>
                        </td>
                
                </tr>

            </React.Fragment>
        )
    }
}

export default Item