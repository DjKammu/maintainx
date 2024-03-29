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
                        <td className="border px-4 py-3">{ this.props.obj.property_name }</td>
                        <td className="border px-4 py-3">{ this.props.obj.area_name }</td>
                        <td className="border px-2 py-1">

                         {this.props.obj.photo && this.props.obj.photo.file && 
                                            <a href={this.props.obj.photo.file} target="_blank" >
                                            <img className="ext-img-sm" src={`/public/images/${this.props.obj.photo.ext}.png`} />
                        </a>}

                     
                    
                            </td>
                            <td className="border px-4 py-3 w-auto">
                           <div className="szn-widget__action">
                            <Link to={{
                                pathname: `/sub-areas/${this.props.obj.id}`,
                                state: this.props.obj
                               
                            }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
                             <this.props.action fn={this.props.loadData} id={this.props.obj.id}
                             url={'/api/v1/sub-areas'}/>
                             </div>
                        </td>
                </tr>

            </React.Fragment>
        )
    }
}

export default Item