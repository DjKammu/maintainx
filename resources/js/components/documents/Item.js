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
              {this.props.columns.document_type_id && 
                   <td className="border px-4 py-3">{ this.props.obj.document_type_name }</td>
              }
              {this.props.columns.asset_type_id && 
                   <td className="border px-4 py-3">{ this.props.obj.asset_type_name }</td>
              }
              {this.props.columns.brand && 
                  <td className="border px-4 py-3">{ this.props.obj.brand }</td>
               }
               {this.props.columns.serial_number && 
                   <td className="border px-4 py-3">{ this.props.obj.serial_number }</td>
              }
              {this.props.columns.model_number && 
                   <td className="border px-4 py-3">{ this.props.obj.model_number }</td>
              }
              {this.props.columns.registration_date && 
                   <td className="border px-4 py-3">{ this.props.obj.registration_date }</td>
              }
              {this.props.columns.manufactare_date && 
                  <td className="border px-4 py-3">{ this.props.obj.manufactare_date }</td>
               }
               {this.props.columns.coverage_term && 
                   <td className="border px-4 py-3">{ this.props.obj.coverage_term }</td>
              }
              {this.props.columns.coverage_type && 
                   <td className="border px-4 py-3">{ this.props.obj.coverage_type }</td>
              }
              {this.props.columns.start_date && 
                  <td className="border px-4 py-3">{ this.props.obj.start_date }</td>
               }
               {this.props.columns.end_date && 
                   <td className="border px-4 py-3">{ this.props.obj.end_date }</td>
              }
              {this.props.columns.dealer_name && 
                  <td className="border px-4 py-3">{ this.props.obj.dealer_name }</td>
               }
               {this.props.columns.property_type_id && 
                   <td className="border px-4 py-3">{ this.props.obj.property_type_name }</td>
               }

               {this.props.columns.property_id && 
                  <td className="border px-4 py-3">{ this.props.obj.property_name }</td>
               }
              {this.props.columns.area_id && 
                   <td className="border px-4 py-3">{ this.props.obj.area_name }</td>
              }
              {this.props.columns.sub_area_id && 
                   <td className="border px-4 py-3">{ this.props.obj.sub_area_name }</td>
               }
            
              {this.props.columns.tenant_id && 
                  <td className="border px-4 py-3">{ this.props.obj.tenant_name }</td>
              }
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
              <div className="input-group-prepend szn-widget__action">
              <Link to={{
                  pathname: `/documents/${this.props.obj.id}`,
                  state: this.props.obj
              }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
              <this.props.action fn={this.props.loadData} id={this.props.obj.id}
               url={'/api/v1/documents'}/>
              </div>
              </td>
                </tr>

            </React.Fragment>
        )
    }
}

export default Item