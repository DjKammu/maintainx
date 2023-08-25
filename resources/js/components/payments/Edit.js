import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import QuickAddTenant from '../tenants/QuickAdd';
import QuickAddAsset from '../asset-model/QuickAdd';

function Edit(props) {

    const [properties, setProperties] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);


    const [isLoading, setIsLoading] = useState(true);
    const selectedAssetModelOption  =  props.location.state.asset_model ? props.location.state.asset_model : null; 
    const selectedVendorOption  =  props.location.state.vendor ? props.location.state.vendor : null; 
    const selectedContractorOption  =  props.location.state.contractor ? props.location.state.contractor : null; 
    const selectedWorkTypeOption  =  props.location.state.work_type ? props.location.state.work_type : null; 
    const selectedAssetTypeOption  =  props.location.state.asset_type ? props.location.state.asset_type : null; 
    const [selectedPropertyOption, setSelectedPropertyOption]  =  useState(props.location.state.property ? props.location.state.property : null); 
    const [selectedAreaOption, setSelectedAreaOption]  = useState(props.location.state.area ? 
        props.location.state.area : null ); 
    const [selectedSubAreaOption, setSelectedSubAreaOption]  = useState(props.location.state.sub_area ? 
        props.location.state.sub_area : null );

    const [selectedPropertyTypeOption, setSelectedPropertyTypeOption]  = useState(props.location.state.property_type ? 
        props.location.state.property_type : null );
    const [selectedTenantOption, setSelectedTenantOption]  = useState(props.location.state.tenant ? 
        props.location.state.tenant : null );

    let assetTypesNullArr = [{'label' : 'Select Asset Type' , 'value' : null}];
    let assetModelsNullArr = [{'label' : 'Select Asset' , 'value' : null}];
    let propertyTypesNullArr = [{'label' : 'Select Property Type' , 'value' : null}];
    let vendorsNullArr = [{'label' : 'Select Vendor' , 'value' : null}];
    let contractorsNullArr = [{'label' : 'Select Contractor' , 'value' : null}];
    let tenantsNullArr = [{'label' : 'Select Tenant' , 'value' : null}];
    let workTypesNullArr = [{'label' : 'Select Work Type' , 'value' : null}];
    let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
    let areaNullArr = [{'label' : 'Select Area' , 'value' : null}];
    let subAreaNullArr = [{'label' : 'Select Sub Area' , 'value' : null}];


    const [state, setState] = useState({
        id: props.location.state.id ? props.location.state.id : '',
        name: props.location.state.name ? props.location.state.name : '',
        notes: props.location.state.notes ? props.location.state.notes : '',
        property_id: props.location.state.property ? props.location.state.property.id : null,
        asset_type_id: props.location.state.asset_type ? props.location.state.asset_type.id : null,
        asset_model_id: props.location.state.asset_model ? props.location.state.asset_model.id : null,
        property_type_id: props.location.state.property_type ? props.location.state.property_type.id : null,
        area_id: props.location.state.area ? props.location.state.area.id : null,
        sub_area_id: props.location.state.sub_area ? props.location.state.sub_area.id : null,
        area_id: props.location.state.area ? props.location.state.area.id : null,
        vendor_id: props.location.state.vendor ? props.location.state.vendor.id : null,
        contractor_id: props.location.state.contractor ? props.location.state.contractor.id : null,
        tenant_id: props.location.state.tenant ? props.location.state.tenant.id : null,
        work_type_id: props.location.state.work_type ? props.location.state.work_type.id : null,
        media: props.location.state.media ? props.location.state.media : '',
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
        document.title = 'Edit Sub Area';
        props.setActiveComponentProp('Edit');
        loadData();
    }, []);

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

 const handleFileChange = (e) => {
         e.persist();
         const { name  } = e.target;
         setState(state => ({
              ...state,
              [name]:  Array.from(e.target.files)
          }));  
     }

    const handleSelectAssetTypeChange = (option) => {
         setState(state => ({
              ...state,
              asset_type_id: option.value
          }));

        setAssetModels([]);
        setIsLoading(true);

        axios.get('/api/v1/payments/assets',{
            params: {
                api_token: authUser.api_token,
                asset_type : option.value
             }
            })
          .then(response => {
            setIsLoading(false);
            setAssetModels(response.data.message.assets)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });

      }

      const handleSelectAssetModelChange = (option) => {
         setState(state => ({
              ...state,
              asset_model_id: option.value,
          }));

        setPropertyTypes([]);
        setSelectedPropertyTypeOption((state.asset_model_id == option.value)  ? (props.location.state.property_type ? 
        props.location.state.property_type : null) : []);
        setProperties([]);
        setSelectedPropertyOption((state.asset_model_id == option.value)  ? (props.location.state.property ? 
        props.location.state.property : null) : []);
        setAreas([]);
        setSelectedAreaOption((state.asset_model_id == option.value)  ? (props.location.state.area ? 
        props.location.state.area : null) : []);
        setSubAreas([]);
        setTenants([]);
        setSelectedSubAreaOption((state.asset_model_id == option.value)  ? (props.location.state.sub_area ? 
        props.location.state.sub_area : null) : []);
        setSelectedTenantOption((state.asset_model_id == option.value)  ? (props.location.state.tenant ? 
        props.location.state.tenant : null) : []);

        setIsLoading(true);

        axios.get('/api/v1/payments/asset-selection',{
            params: {
                api_token: authUser.api_token,
                asset : option.value
             }
            })
          .then(response => {
             setIsLoading(false);
            setSelectedPropertyTypeOption(response.data.message.asset.property_type)
            setSelectedPropertyOption(response.data.message.asset.property)
            setSelectedAreaOption(response.data.message.asset.area)
            setSelectedSubAreaOption(response.data.message.asset.sub_area)
            setTenants(response.data.message.tenants)  

             setState(state => ({
              ...state,
              asset_model_id: option.value,
              property_type_id: response.data.message.asset.property_type_id,
              property_id: response.data.message.asset.property_id,
              area_id: response.data.message.asset.area_id,
              sub_area_id: response.data.message.asset.sub_area_id
          }));

          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });


      }  

      const handleSelectVendorChange = (option) => {
         setState(state => ({
              ...state,
              vendor_id: option.value,
          }));
      }

      const handleSelectContractorChange = (option) => {
         setState(state => ({
              ...state,
              contractor_id: option.value,
          }));
      }

     const handleSelectTenantChange = (option) => {
         setState(state => ({
              ...state,
              tenant_id: option.value,
          }));

         setSelectedTenantOption(option)
      }
      
      const handleSelectWorkTypeChange = (option) => {
         setState(state => ({
              ...state,
              work_type_id: option.value,
          }));
      }


     const loadData = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/attributes',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                setAssetTypes(response.data.message.assetTypes)  
                // setPropertyTypes(response.data.message.propertyTypes)  
                // setAssetModels(response.data.message.assetModels)  
                setVendors(response.data.message.vendors)  
                setContractors(response.data.message.contractors)  
                // setTenants(response.data.message.tenants)  
                setWorkTypes(response.data.message.workTypes)  
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
                });
            });
        };

    const onSubmitHandle = (e) =>{
        e.preventDefault();
        
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            var formData = new FormData();
            formData.append('asset_type_id', state.asset_type_id);
            formData.append('asset_model_id', state.asset_model_id);
            formData.append('property_type_id', state.property_type_id);
            formData.append('property_id', state.property_id);
            formData.append('area_id', state.area_id);
            formData.append('sub_area_id', state.sub_area_id);
            formData.append('vendor_id', state.vendor_id);
            formData.append('contractor_id', state.contractor_id);
            formData.append('tenant_id', state.tenant_id);
            formData.append('work_type_id', state.work_type_id);
            formData.append('notes', state.notes);
            if(state.files && state.files.length > 0){
               state.files.map((file) => {
                     formData.append('files[]', file);
                });  
            }

            axios.post('/api/v1/payments/update', formData,{
                params: {
                    api_token: authUser.api_token,
                    id: state.id
                }
            }).then(response => {
                setState({
                    ...state,
                    loading: false
                });
                if (response.data.status == 'validation-error') {
                    var errorArray = response.data.message;
                    $.each( errorArray, function( key, errors ) {
                        $.each( errors, function( key, errorMessage ) {
                            showSznNotification({
                                type : 'error',
                                message : errorMessage
                            });
                        });
                    });
                } else if (response.data.status == 'error') {
                        showSznNotification({
                            type : 'error',
                            message : response.data.message
                        });
                } else if (response.data.status == 'success') {
                    showSznNotification({
                        type : 'success',
                        message : response.data.message
                    });
                    history.push('/payments')
                }
            })
            .catch((error) => {
                console.log(error);
                
                setState({
                    ...state,
                    loading: false
                });
                if (error.response.data.status == 'validation-error') {
                    var errorArray = error.response.data.message;
                    $.each( errorArray, function( key, errors ) {
                        $.each( errors, function( key, errorMessage ) {
                            showSznNotification({
                                type : 'error',
                                message : errorMessage
                            });
                        });
                    });
                } else if (error.response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
                } 
            });
        } else {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        }

    }

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
                                    <form className="edit-lead-form border" onSubmit={onSubmitHandle}>
                                        <input type="hidden" name="api_token" value={state.authUser.api_token} />
                                        <input type="hidden" name="id" value={state.id} />
                                        <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">EDIT SUB AREA</span>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* asset Type */}
                                    <div className="form-group">
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
                                        defaultValue={selectedAssetTypeOption}
                                        onChange={handleSelectAssetTypeChange}
                                        options={ (assetTypes.length > 0) ? [...assetTypesNullArr, ...assetTypes] : []}
                                      />  
                                    </div>
                                    </div> 

                                     {/* asset Type */}
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
                                        defaultValue={selectedAssetModelOption}
                                        onChange={handleSelectAssetModelChange}
                                        options={ (assetModels.length > 0) ? [...assetModelsNullArr, ...assetModels] : []}
                                      />  
                                      <QuickAddAsset/>
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
                                        options={ (propertyTypes.length > 0) ? propertyTypes : []}
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
                                        options={ (properties.length > 0) ? [...propertyNullArr, ...properties] : []}
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
                                        options={ (areas.length > 0) ? areas : []}
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
                                        options={ (areas.length > 0) ? sub_areas : []}
                                      />  
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
                                        defaultValue={selectedVendorOption}
                                        onChange={handleSelectVendorChange}
                                        options={ (vendors.length > 0) ? [...vendorsNullArr, ...vendors] : []}
                                      />  
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
                                        defaultValue={selectedContractorOption}
                                        onChange={handleSelectContractorChange}
                                        options={ (contractors.length > 0) ? [...contractorsNullArr, ...contractors] : []}
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
                                        onChange={handleSelectTenantChange}
                                        options={ (tenants.length > 0) ? [...tenantsNullArr, ...tenants] : []}
                                      /> 
                                      <QuickAddTenant/>
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
                                        defaultValue={selectedWorkTypeOption}
                                        onChange={handleSelectWorkTypeChange}
                                        options={ (workTypes.length > 0) ? [...workTypesNullArr, ...workTypes] : []}
                                      />  
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
                                        onChange={onChangeHandle}
                                        value={state.notes}
                                        className="form-control form-control-sm"></textarea>
                                        </div>
                                       
                                          </div>

                                        <div className="form-group">
                                                <label>
                                                  <span>Invoice Attachmennts</span>
                                                </label>
                                              <div className="input-group input-group-sm">

                                               <input type="file" multiple name="files" 
                                                  onChange={handleFileChange}
                                                />
                                              </div>
                                             
                                        </div> 
                 
                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Update</button>
                                            <Link to='/sub-areas' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                                        </div>
                                    </form>

                                    <div className="col-span-12 sm:col-span-12">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="file">
                                        <span>Attached Invoices</span>
                                      </label>
                                    </div>

                                     {state.media && state.media.length > 0 && 
                                                       
                                           state.media.map((element, index) => (
                                             <a key={index} className="col-span-3 sm:col-span-3 delete-file" href={element.file} target="_new">
                                               <img className="ext-img" src={`/images/${element.ext}.png`} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Edit)