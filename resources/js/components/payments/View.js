import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory, useParams} from 'react-router-dom';
import Select from 'react-select';

function View(props) {
    const [properties, setProperties] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
     const [propertyTypes2, setPropertyTypes2] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [selectedAssetTypeOption, setSelectedAssetTypeOption]  = useState([]);
    const [selectedAssetModelOption, setSelectedAssetModelOption]  = useState([]);
    const [selectedVendorOption, setSelectedVendorOption]  = useState([]);
    const [selectedContractorOption, setSelectedContractorOption]  = useState([]);
    const [selectedWorkTypeOption, setSelectedWorkTypeOption]  = useState([]);
    const [selectedTenantOption, setSelectedTenantOption]  = useState([]);
    const [selectedAreaOption, setSelectedAreaOption]  = useState([]);
    const [selectedSubAreaOption, setSelectedSubAreaOption]  = useState([]);
    const [selectedPropertyOption, setSelectedPropertyOption]  = useState([]);
    const [selectedPropertyTypeOption, setSelectedPropertyTypeOption]  = useState([]);


    let { id } = useParams();


    const [state, setState] = useState({
        id: id,
        asset_type_id: "",
        asset_model_id: "",
        property_type_id: "",
        property_id: "",
        area_id: "",
        sub_area_id: "",
        vendor_id: "",
        contractor_id: "",
        tenant_id: "",
        work_type_id: "",
        notes: "",
        payment:'',
        payment_date:'',
        media: "",
        brand: "",
        non_asset: "0",
        description: "",
        loading: false,
        authUser: props.authUserProp
    });
    
    let history = useHistory();
    
    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
            autoForceUpdate: {forceUpdate: forceUpdate},
            className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    useEffect(() => {
        document.title = 'View Payment';
        props.setActiveComponentProp('View');
        loadPageData();
    }, []);

     const loadPageData = () => {

          setIsLoading(true);

          if(props.location.state){

            setState(state => ({
            ...state,
                name: props.location.state.name,
                notes: props.location.state.notes,
                payment: props.location.state.payment,
                brand: props.location.state.brand,
                description: props.location.state.description,
                non_asset: props.location.state.non_asset,
                payment_date: props.location.state.payment_date ? new Date(props.location.state.payment_date).toLocaleDateString('en-CA') : null,
                property_id: props.location.state.property ? props.location.state.property.id : null, 
                asset_type_id:props.location.state.asset_type ? props.location.state.asset_type.id : null,   
                asset_model_id: props.location.state.asset_model ? props.location.state.asset_model.id : null, 
                property_type_id: props.location.state.property_type ? props.location.state.property_type.id : null, 
                area_id: props.location.state.area ? props.location.state.area.id : null, 
                sub_area_id: props.location.state.sub_area ? props.location.state.sub_area.id : null,
                vendor_id: props.location.state.vendor ? props.location.state.vendor.id : null, 
                contractor_id: props.location.state.contractor ? props.location.state.contractor.id : null, 
                tenant_id: props.location.state.tenant ? props.location.state.tenant.id : null, 
                work_type_id: props.location.state.work_type ? props.location.state.work_type.id : null,
                media: props.location.state.media
            }));

            // setState("payment_date", ConvertDateToString(props.location.state.payment_date));


            setSelectedAssetTypeOption((props.location.state.asset_type ? props.location.state.asset_type : null)); 
            setSelectedAssetModelOption((props.location.state.asset_model ? props.location.state.asset_model : null)); 
            setSelectedVendorOption((props.location.state.vendor ? props.location.state.vendor : null)); 
            setSelectedContractorOption((props.location.state.contractor ? props.location.state.contractor : null)); 
            setSelectedWorkTypeOption((props.location.state.work_type ? props.location.state.work_type : null)); 
            setSelectedPropertyOption((props.location.state.property ? props.location.state.property : null)); 
            setSelectedAreaOption((props.location.state.area ?  props.location.state.area : null )); 
            setSelectedSubAreaOption((props.location.state.sub_area ? props.location.state.sub_area : null ));
            setSelectedPropertyTypeOption((props.location.state.property_type ? props.location.state.property_type : null ));
            setSelectedTenantOption((props.location.state.tenant ? props.location.state.tenant : null ));
            setProperties((props.location.state.property != 'null' ? [props.location.state.property] : null ));
            setPropertyTypes((props.location.state.property_type  != 'null' ? [props.location.state.property_type] : null ));
            setAreas((props.location.state.area != 'null' ? [props.location.state.area] : null ));
            setSubAreas((props.location.state.sub_area  != 'null' ? [props.location.state.sub_area] : null ));

            return;
          }

        
          axios.get('/api/v1/payments?id='+id,{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
               setIsLoading(false);
               var _data = response.data.message ? response.data.message.data[0] : null
               
                if(_data){

                  setState(state => ({
                  ...state,
                      name: _data.name,
                      notes: _data.notes,
                      payment: _data.payment,
                      payment_date: _data.payment_date ? new Date(_data.payment_date).toLocaleDateString('en-CA') : null,
                      brand: _data.brand,
                      description: _data.description,
                      non_asset: _data.non_asset,
                      property_id: _data.property ? _data.property.id : null, 
                      asset_type_id:_data.asset_type ? _data.asset_type.id : null,   
                      asset_model_id: _data.asset_model ? _data.asset_model.id : null, 
                      property_type_id: _data.property_type ? _data.property_type.id : null, 
                      area_id: _data.area ? _data.area.id : null, 
                      sub_area_id: _data.sub_area ? _data.sub_area.id : null,
                      vendor_id: _data.vendor ? _data.vendor.id : null, 
                      contractor_id: _data.contractor ? _data.contractor.id : null, 
                      tenant_id: _data.tenant ? _data.tenant.id : null, 
                      work_type_id: _data.work_type ? _data.work_type.id : null,
                      media: _data.media,
                  }));

                    setSelectedAssetTypeOption((_data.asset_type ? _data.asset_type : null)); 
                    setSelectedAssetModelOption((_data.asset_model ? _data.asset_model : null)); 
                    setSelectedVendorOption((_data.vendor ? _data.vendor : null)); 
                    setSelectedContractorOption((_data.contractor ? _data.contractor : null)); 
                    setSelectedWorkTypeOption((_data.work_type ? _data.work_type : null)); 
                    setSelectedPropertyOption((_data.property ? _data.property : null)); 
                    setSelectedAreaOption((_data.area ?  _data.area : null )); 
                    setSelectedSubAreaOption((_data.sub_area ? _data.sub_area : null ));
                    setSelectedPropertyTypeOption((_data.property_type ? _data.property_type : null ));
                    setSelectedTenantOption((_data.tenant ? _data.tenant : null ));
                    setProperties((_data.property != 'null' ? [_data.property] : null ));
                    setPropertyTypes((_data.property_type != 'null' ? [_data.property_type] : null ));
                    setAreas((_data.area != 'null'? [_data.area] : null ));
                    setSubAreas((_data.sub_area != 'null' ? [_data.sub_area] : null ));
                    props.location.state = _data;
                }

            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
                });
            });


      }; 
  
     const deleteFunc = (e) => {
      e.preventDefault();
    if(!confirm('Are you sure?')){
      return;
    }

    setIsLoading(true);

    axios.post('/api/v1/payments/delete-attachment', {
        api_token: authUser.api_token,
        id: state.id,
        file:e.target.id
    })
    .then(response => {
        setIsLoading(false);
        if (response.data.status == 'error') {
                showSznNotification({
                    type : 'error',
                    message : response.data.message
                });
        } else if (response.data.status == 'success') {
            showSznNotification({
                type : 'success',
                message : response.data.message
            });
             setState({
                    ...state,
                    media : response.data.media
                });
        }
    })
    .catch((error) => {
        setIsLoading(false);
        if (error.response.data.status == 'error') {
            showSznNotification({
                type : 'error',
                message : error.response.data.message
            });
        } 
    });
  }


    return (
        <React.Fragment>
            
                <div className="card animated fadeIn">
                    <div className="card-body">
                        <div className="row new-lead-wrapper d-flex justify-content-center">
                            <div className="col-md-8 ">
                                <LoadingOverlay
                                    active={state.loading}
                                    spinner={<BeatLoader />}
                                    styles={{
                                        overlay: (base) => ({
                                            ...base,
                                            opacity: '0.5',
                                            filter: 'alpha(opacity=50)',
                                            background: 'white'
                                        })
                                    }}
                                >
                                      <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">VIEW PAYMENT</span>
                                                </li>
                                            </ul>
                                        </div>
                                      <div className="form-group">
                                       <div className="input-group input-group-sm"> 
                                       <input
                                              name="non_asset"
                                              type="radio"
                                              checked
                                            />  
                                           <label  className="mx-1 mr-4 my-1" >
                                                {state.non_asset ===  "0" && 
                                                  'Non'
                                                } Asset</label>
                                           </div>
                                          </div>


                                         {/*  {state.non_asset ===  "1" && */}

                                          <div className="form-group">
                                          <label>
                                            <span>Description</span>
                                          </label>
                                          <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-circle-edit-outline"></i>
                                                </span>
                                            </div>
                                            <textarea  name="description" placeholder="Description"
                                              value={state.description}
                                              className="form-control form-control-sm" 
                                              readOnly></textarea>
                                              </div>
                                       
                                          </div>


                                        {/*  } */}

                                         {state.non_asset ===  "0" &&
                                          <div className="form-group" >
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                              <span>Asset Type</span>
                                            </label>
                                             <div className="input-group input-group-sm">
                                              <div className="input-group-prepend">
                                                  <span className="input-group-text bg-gradient-success text-white">
                                                      <i className="mdi mdi-home-outline"></i>
                                                  </span>
                                              </div>
                                              <Select
                                              value={selectedAssetTypeOption}
                                              options={ (selectedAssetTypeOption.length > 0) ? [selectedAssetTypeOption] : []}
                                            readOnly/> 
                                          </div>
                                          </div>
                                          }



                                    

                                {/* property_type */}
                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Property Type</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedPropertyTypeOption}
                                        options={ (selectedPropertyTypeOption && selectedPropertyTypeOption.length > 0) ? [selectedPropertyTypeOption] : []}
                                      readOnly/>  
                                      
                                    </div>
                                    </div> 


                                {/* property */}
                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Property</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedPropertyOption}
                                        options={ (selectedPropertyOption && selectedPropertyOption.length > 0) ? [selectedPropertyOption] : []}
                                      readOnly/>  
                                      
                                    </div>
                                    </div>


                                     {/* area */}
                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Area</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-variant"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedAreaOption}
                                        options={ (selectedAreaOption && selectedAreaOption.length > 0) ? [selectedAreaOption] : []}
                                      readOnly/>  
                                      
                                    </div>
                                    </div>
                                       

                                    {/* sub_area */}

                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="sub_area">
                                        <span>Sub Area</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-variant"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedSubAreaOption}
                                         options={ (selectedSubAreaOption && selectedSubAreaOption.length > 0) ? [selectedSubAreaOption] : []}
                                     readOnly />  
                                     
                                    </div>
                                    </div>
                                      
                                      {/* vendor_id */}
                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Vendor</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedVendorOption}
                                        options={ (selectedVendorOption && selectedVendorOption.length > 0) ? [selectedVendorOption] : []}
                                      readOnly/>  
                                     
                                    </div>
                                    </div>  


                                     {/* contractor_id */}

                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Contractor</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedContractorOption}
                                        options={ (selectedContractorOption && selectedContractorOption.length > 0) ? [selectedContractorOption] : []}
                                      readOnly/>
                                       
                                    </div>
                                    </div>


                                     {/* tenant_id */}
                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Tenant</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedTenantOption}
                                        options={ (selectedTenantOption && selectedTenantOption.length > 0) ? [selectedTenantOption] : []}
                                      readOnly/> 
                                     
                                    </div>
                                    </div>

                                {/* work_type_id */}
                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Work Type </span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedWorkTypeOption}
                                        options={ (selectedWorkTypeOption && selectedWorkTypeOption.length > 0) ? [selectedWorkTypeOption] : []}
                                      readOnly/>  
                                      
                                    </div>
                                    </div>
                                         
                                      <div className="form-group">
                                        <label>Payment</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="payment" name="payment" placeholder="Payment" 
                                            value={state.payment} readOnly/>
                                        </div>
                                    </div> 
                                      
                                      {state.non_asset ===  "0" &&
                                                                            
                                              <div className="form-group">
                                                    <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                                      <span>Asset</span>
                                                    </label>
                                                     <div className="input-group input-group-sm">
                                                      <div className="input-group-prepend">
                                                          <span className="input-group-text bg-gradient-success text-white">
                                                              <i className="mdi mdi-home-outline"></i>
                                                          </span>
                                                      </div>
                                                      <Select
                                                      value={selectedAssetModelOption}
                                                      options={ (selectedAssetModelOption && selectedAssetModelOption.length > 0) ? [selectedAssetModelOption] : []}
                                                    readOnly/>  
                                                    
                                                  </div>
                                                  {simpleValidator.current.message('Asset', state.asset_model_id, 'required')}
                                              </div>
                                          }

                                     <div className="form-group">
                                        <label>Payment Date</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-calendar"></i>
                                                </span>
                                            </div>
                                           <input  
                                            name="payment_date"
                                            value={state.payment_date}
                                            className="form-control form-control-sm"
                                            type="text" readOnly/>

                                        </div>
                                    </div>


                                      <div className="form-group">
                                          <label>
                                            <span>Notes</span>
                                          </label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-circle-edit-outline"></i>
                                                </span>
                                            </div>
                                        <textarea  name="notes" placeholder="Notes"
                                        value={state.notes}
                                        className="form-control form-control-sm" readOnly></textarea>
                                        </div>
                                        </div>

                                        
                
                                    <div className="col-span-12 sm:col-span-12">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="file">
                                        <span>Attached Invoices</span>
                                      </label>
                                    </div>

                                     {state.media && state.media.length > 0 && 
                                                       
                                           state.media.map((element, index) => (
                                             <a key={index} className="col-span-3 sm:col-span-3 delete-file" href={element.file} target="_new">
                                               <img className="ext-img" src={`/public/images/${element.ext}.png`} />
                                                <span className="cross">
                                                 <form onSubmit={deleteFunc} id={element.file}>
                                                        <button
                                                          className="text-white"
                                                          type="submit"
                                                        >
                                                        <i className="mdi mdi-delete-circle"></i>
                                                        </button>
                                                  </form>
                                               </span>
                                             </a>
                                          ))
                                        }
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </div>
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    return {
        authUserProp: state.authUserReducer,
        activeComponentProp: state.activeComponentReducer,
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setAuthUserProp: (user) => dispatch(setAuthUser(user)),
        setActiveComponentProp: (component) => dispatch(rootAction.setActiveComponent(component))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(View)