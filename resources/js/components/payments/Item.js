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
              {this.props.columns.asset_type_id && 
                   <td className="border px-4 py-3">{ this.props.obj.asset_type_name }</td>
              }
              {this.props.columns.asset_model_id && 
                   <td className="border px-4 py-3">{ this.props.obj.asset_model_name }</td>
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
              {this.props.columns.vendor_id && 
                  <td className="border px-4 py-3">{ this.props.obj.vendor_name }</td>
               }

              {this.props.columns.contractor_id && 
                  <td className="border px-4 py-3">{ this.props.obj.contractor_name }</td>
              }
              {this.props.columns.tenant_id && 
                  <td className="border px-4 py-3">{ this.props.obj.tenant_name }</td>
              }
              {this.props.columns.work_type_id && 
                  <td className="border px-4 py-3">{ this.props.obj.work_type_name }</td>
              }
              {this.props.columns.payment && 
                   <td className="border px-4 py-3">${ this.props.obj.payment }</td>
              }
              {this.props.columns.payment_date && 
                   <td className="border px-2 py-3 text-center">{ this.props.obj.payment_date }</td>
              }

              {this.props.columns.notes && 
                   <td className="border px-2 py-3 text-center">{ this.props.obj.notes }</td>
              }
             {/* {this.props.columns.brand && 
                   <td className="border px-2 py-3 text-center">{ this.props.obj.brand }</td>
              } */}
              {this.props.columns.description && 
                   <td className="border px-2 py-3 text-center">{ this.props.obj.description }</td>
              }{this.props.columns.non_asset && 
                   <td className="border px-2 py-3 text-center">{ this.props.obj.non_asset }</td>
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
                  pathname: `/view/payments/${this.props.obj.id}`,
                  state: this.props.obj
              }} type="button" className="btn btn-outline-primary btn-sm btn-upper">View</Link>&nbsp; 
              <Link to={{
                  pathname: `/payments/${this.props.obj.id}`,
                  state: this.props.obj
              }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;

               { this.props.isTrashed ? (
                  <this.props.action fn={this.props.loadData} id={this.props.obj.id}
               url={'/api/v1/payments'}/>
                ) : (
                   <button type="button" className="btn btn-danger btn-sm btn-upper" onClick={() => this.props.action(this.props.obj.id)}>Delete {this.props.isTrashed}</button>
                )}
              </div>
              </td>
                </tr>

            </React.Fragment>
        )
    }
}

export default Item