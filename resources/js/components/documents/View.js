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
    const [documentTypes, setDocumentTypes] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVendorOption, setSelectedVendorOption]  = useState([]);
    const [selectedDocumentTypeOption, setSelectedDocumentTypeOption]  = useState([]);
    const [selectedAssetTypeOption, setSelectedAssetTypeOption]  = useState([]);
    const [selectedTenantOption, setSelectedTenantOption]  = useState([]);
    const [selectedAreaOption, setSelectedAreaOption]  = useState([]);
    const [selectedSubAreaOption, setSelectedSubAreaOption]  = useState([]);
    const [selectedPropertyOption, setSelectedPropertyOption]  = useState([]);
    const [selectedPropertyTypeOption, setSelectedPropertyTypeOption]  = useState([]);
   

    let { id } = useParams();


      const [state, setState] = useState({
        id: id,
        document_type_id: "",
        asset_type_id: "",
        brand: "",
        serial_number: "",
        model_number: "",
        description: "",
        install_date: "",
        registration_date: "",
        manufactare_date: "",
        coverage_term: "",
        coverage_type: "",
        start_date: "",
        end_date: "",
        dealer_name: "",
        property_type_id: "",
        property_id: "",
        area_id: "",
        sub_area_id: "",
        tenant_id: "",
        vendor_id: "",
        photos: "",
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
        document.title = 'View Document';
        props.setActiveComponentProp('View');
        loadPageData();
    }, []);

 
     const loadPageData = () => {

          setIsLoading(true);

          if(props.location.state){

            setState(state => ({
            ...state,
                coverage_term: props.location.state.coverage_term,
                coverage_type: props.location.state.coverage_type,
                dealer_name: props.location.state.dealer_name,
                brand: props.location.state.brand,
                description: props.location.state.description,
                serial_number: props.location.state.serial_number,
                model_number: props.location.state.model_number,
                install_date: props.location.state.install_date ? new Date(props.location.state.install_date).toLocaleDateString('en-CA') : null,
                registration_date: props.location.state.registration_date ? new Date(props.location.state.registration_date).toLocaleDateString('en-CA') : null,
                manufactare_date: props.location.state.manufactare_date ? new Date(props.location.state.manufactare_date).toLocaleDateString('en-CA') : null,
                start_date: props.location.state.start_date ? new Date(props.location.state.start_date).toLocaleDateString('en-CA') : null,
                end_date: props.location.state.end_date ? new Date(props.location.state.end_date).toLocaleDateString('en-CA') : null,
                property_id: props.location.state.property ? props.location.state.property.id : null, 
                asset_type_id:props.location.state.asset_type ? props.location.state.asset_type.id : null,   
                document_type_id: props.location.state.document_type ? props.location.state.document_type.id : null, 
                property_type_id: props.location.state.property_type ? props.location.state.property_type.id : null, 
                area_id: props.location.state.area ? props.location.state.area.id : null, 
                sub_area_id: props.location.state.sub_area ? props.location.state.sub_area.id : null,
                tenant_id: props.location.state.tenant ? props.location.state.tenant.id : null, 
                vendor_id: props.location.state.vendor ? props.location.state.vendor.id : null, 
                media: props.location.state.media
            }));

            // setState("payment_date", ConvertDateToString(props.location.state.payment_date));


            setSelectedAssetTypeOption((props.location.state.asset_type ? props.location.state.asset_type : null)); 
            setSelectedDocumentTypeOption((props.location.state.document_type ? props.location.state.document_type : null)); 
            setSelectedPropertyOption((props.location.state.property ? props.location.state.property : null)); 
            setSelectedAreaOption((props.location.state.area ?  props.location.state.area : null )); 
            setSelectedSubAreaOption((props.location.state.sub_area ? props.location.state.sub_area : null ));
            setSelectedPropertyTypeOption((props.location.state.property_type ? props.location.state.property_type : null ));
            setSelectedTenantOption((props.location.state.tenant ? props.location.state.tenant : null ));
            setProperties((props.location.state.property != 'null' ? [props.location.state.property] : null ));
            setPropertyTypes((props.location.state.property_type  != 'null' ? [props.location.state.property_type] : null ));
            setAreas((props.location.state.area != 'null' ? [props.location.state.area] : null ));
            setSubAreas((props.location.state.sub_area  != 'null' ? [props.location.state.sub_area] : null ));
            setSelectedVendorOption((props.location.state.vendor ? props.location.state.vendor : null)); 
            return;
          }

        
          axios.get('/api/v1/documents?id='+id,{
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
                      coverage_term: _data.coverage_term,
                      coverage_type: _data.coverage_type,
                      dealer_name: _data.dealer_name,
                      install_date: _data.install_date ? new Date(_data.install_date).toLocaleDateString('en-CA') : null,
                      registration_date: _data.registration_date ? new Date(_data.registration_date).toLocaleDateString('en-CA') : null,
                      manufactare_date: _data.manufactare_date ? new Date(_data.manufactare_date).toLocaleDateString('en-CA') : null,
                      start_date: _data.start_date ? new Date(_data.start_date).toLocaleDateString('en-CA') : null,
                      end_date: _data.end_date ? new Date(_data.end_date).toLocaleDateString('en-CA') : null,
                      brand: _data.brand,
                      description: _data.description,
                      serial_number: _data.serial_number,
                      model_number: _data.model_number,
                      property_id: _data.property ? _data.property.id : null, 
                      asset_type_id:_data.asset_type ? _data.asset_type.id : null,   
                      document_type_id: _data.document_type ? _data.document_type.id : null, 
                      property_type_id: _data.property_type ? _data.property_type.id : null, 
                      area_id: _data.area ? _data.area.id : null, 
                      sub_area_id: _data.sub_area ? _data.sub_area.id : null,
                      tenant_id: _data.tenant ? _data.tenant.id : null, 
                      vendor_id: _data.vendor ? _data.vendor.id : null, 
                      media: _data.media,
                  }));

                    setSelectedAssetTypeOption((_data.asset_type ? _data.asset_type : null)); 
                    setSelectedDocumentTypeOption((_data.document_type ? _data.document_type : null)); 
                    setSelectedPropertyOption((_data.property ? _data.property : null)); 
                    setSelectedAreaOption((_data.area ?  _data.area : null )); 
                    setSelectedSubAreaOption((_data.sub_area ? _data.sub_area : null ));
                    setSelectedPropertyTypeOption((_data.property_type ? _data.property_type : null ));
                    setSelectedTenantOption((_data.tenant ? _data.tenant : null ));
                    setSelectedVendorOption((_data.vendor ? _data.vendor : null)); 
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

    axios.post('/api/v1/documents/delete-attachment', {
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
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">VIEW DOCUMENT</span>
                                                </li>
                                            </ul>
                                        </div>
                                       {/* asset_type */}

                                    <div className="form-group" >
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="document Type">
                                        <span>Document Type</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedDocumentTypeOption}
                                        options={ (selectedDocumentTypeOption && selectedDocumentTypeOption.length > 0) ? [selectedDocumentTypeOption] : []}
                                      />  
                                    </div>
                                    </div> 

                                  {/* asset_type */}

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
                                        options={ (selectedAssetTypeOption && selectedAssetTypeOption.length > 0) ? [selectedAssetTypeOption] : []}
                                      />  
                                     
                                    </div>
                                    </div>
                
                                        {/* brand */}
                                      <div className="form-group">
                                        <label>Brand</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="brand" name="brand" placeholder="Brand Name" 
                                            value={state.brand} readOnly/>
                                        </div>
                                    </div>

                                    {/* serial_number */}
                                    <div className="form-group">
                                        <label>Serial Number</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="serial_number" name="serial_number" placeholder="Serial Number" 
                                            value={state.serial_number} readOnly/>
                                        </div>
                                    </div>

                                    {/* model_number */}
                                    <div className="form-group">
                                        <label>Model Number</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="model_number" name="model_number" placeholder="Model Number" 
                                            value={state.model_number} readOnly/>
                                        </div>
                                    </div>

                                  {/* coverage_term */}
                                    <div className="form-group">
                                        <label>Coverage Term</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="coverage_term" name="coverage_term" placeholder="Coverage Term" 
                                            value={state.coverage_term}  readOnly/>
                                        </div>
                                    </div>


                                  {/* coverage_type */}
                                    <div className="form-group">
                                        <label>Coverage Type</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="coverage_type" name="coverage_type" placeholder="Coverage Type" 
                                            value={state.coverage_type} readOnly/>
                                        </div>
                                    </div>

                                 

                                           {/* description */}
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
                                              className="form-control form-control-sm" readOnly></textarea>
                                              </div>
                                          </div>




                                {/* install_date */}

                                <div className="form-group">
                                        <label>Install Date</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-calendar"></i>
                                                </span>
                                            </div>
                                           <input  
                                            name="install_date"
                                            value={state.install_date}
                                            className="form-control form-control-sm"
                                            type="text" readOnly/>

                                        </div>
                                    </div>

                                  {/* registration_date */}

                                <div className="form-group">
                                        <label>Registration Date</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-calendar"></i>
                                                </span>
                                            </div>
                                           <input  
                                            name="registration_date"
                                            value={state.registration_date}
                                            className="form-control form-control-sm"
                                            type="text" readOnly/>

                                        </div>
                                    </div>


                                  {/* manufactare_date */}

                                <div className="form-group">
                                        <label>Manufactare Date</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-calendar"></i>
                                                </span>
                                            </div>
                                           <input  
                                            name="manufactare_date"
                                            value={state.manufactare_date}
                                            className="form-control form-control-sm"
                                            type="text"  readOnly/>

                                        </div>
                                    </div>


                                  {/* start_date */}

                                <div className="form-group">
                                        <label>Start Date</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-calendar"></i>
                                                </span>
                                            </div>
                                           <input  
                                            name="start_date"
                                            value={state.start_date}
                                            className="form-control form-control-sm"
                                            type="text" readOnly/>

                                        </div>
                                    </div>

                                  {/* end_date */}

                                <div className="form-group">
                                        <label>End Date</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-calendar"></i>
                                                </span>
                                            </div>
                                           <input  
                                            name="end_date"
                                            value={state.end_date}
                                            className="form-control form-control-sm"
                                            type="text" readOnly/>

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
                                      />  
                                      
                                    </div>
                                    </div> 


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
                                      />  
                                     
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
                                      />  
                                      
                                        
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
                                      />  
                                     
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
                                      />
                                    
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
                                      /> 
                                     
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