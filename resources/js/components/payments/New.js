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

function New(props) {
    
    const [properties, setProperties] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectedAssetTypeOption = null;
    const selectedPropertyTypeOption = null;
    const selectedAssetModelOption = null;
    const selectedVendorOption = null;
    const selectedContractorOption = null;
    const selectedTenantOption = null;
    const selectedWorkTypeOption = null;
    const [selectedAreaOption, setSelectedAreaOption]  = useState([]);
    const [selectedPropertyOption, setSelectedPropertyOption]  = useState([]);
    let assetTypesNullArr = [{'label' : 'Select Asset Type' , 'value' : null}];
    let assetModelsNullArr = [{'label' : 'Select Asset Model' , 'value' : null}];
    let propertyTypesNullArr = [{'label' : 'Select Property Type' , 'value' : null}];
    let vendorsNullArr = [{'label' : 'Select Vendor' , 'value' : null}];
    let contractorsNullArr = [{'label' : 'Select Contractor' , 'value' : null}];
    let tenantsNullArr = [{'label' : 'Select Tenant' , 'value' : null}];
    let workTypesNullArr = [{'label' : 'Select Work Type' , 'value' : null}];
    let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
    let areaNullArr = [{'label' : 'Select Area' , 'value' : null}];

    const [state, setState] = useState({
        name: "",
        property_id: "",
        area_id: "",
        notes: "",
        photo: "",
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
        document.title = 'New Payment';
        props.setActiveComponentProp('New');
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
              [name]:  e.target.files[0]
          }));  
     }
    
      const handleSelectAssetTypeChange = (option) => {
         setState(state => ({
              ...state,
              asset_type_id: option.value,
          }));
      }

      const handleSelectAssetModelChange = (option) => {
         setState(state => ({
              ...state,
              asset_model_id: option.value,
          }));
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
      }
      
      const handleSelectWorkTypeChange = (option) => {
         setState(state => ({
              ...state,
              work_type_id: option.value,
          }));
      }


    const handleSelectPropertyTypeChange = (selectedOption ) => {
         setState(state => ({
              ...state,
              property_type_id: selectedOption.value,
              property_id   : null
          }));

        setProperties([]);
        setSelectedPropertyOption([]);
        // setAreas([]);
        // setSelectedAreaOption([]);
   
        console.log(properties)
        console.log(selectedPropertyOption)
        
        setIsLoading(true);

         axios.get('/api/v1/payments/property',{
            params: {
                api_token: authUser.api_token,
                property_type : selectedOption.value
             }
            })
          .then(response => {
            setIsLoading(false);
            setProperties(response.data.message.property)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });
      }
     

    const handleSelectPropertyChange = (selectedOption) => {
        //  setState(state => ({
        //       ...state,
        //       property_id: selectedOption.value,
        //       area_id   : null
        //   }));

        // setAreas([]);
        // setSelectedAreaOption([]);
        // setIsLoading(true);

        //  axios.get('/api/v1/sub-areas/areas',{
        //     params: {
        //         api_token: authUser.api_token,
        //         property : selectedOption.value
        //      }
        //     })
        //   .then(response => {
        //     setIsLoading(false);
        //     setAreas(response.data.message.area)
        //   })
        //   .catch(error => {
        //          showSznNotification({
        //             type : 'error',
        //             message : error.response.data.message
        //         });
        //   });
     } 

     const handleSelectAreaChange = (selectedOption) => {
         setState(state => ({
              ...state,
              area_id: selectedOption.value,
          }));
         setSelectedAreaOption(selectedOption);
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
                setPropertyTypes(response.data.message.propertyTypes)  
                setAssetModels(response.data.message.assetModels)  
                setVendors(response.data.message.vendors)  
                setContractors(response.data.message.contractors)  
                setTenants(response.data.message.tenants)  
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
            formData.append('name', state.name);
            formData.append('property_id', state.property_id);
            formData.append('area_id', state.area_id);
            formData.append('notes', state.notes);
            formData.append('photo', state.photo);
          
            axios.post(
              '/api/v1/payments',formData,{
              params: {
                   api_token: authUser.api_token
              }
            })
            .then(response => {
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
                                <form className="new-lead-form border" onSubmit={onSubmitHandle}>
                                    <input type="hidden" name="api_token" value={state.authUser.api_token} />
                                    <div className="form-group">
                                        <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                            <li className="nav-item">
                                                <span className="nav-link btn btn-gradient-primary btn-block active">NEW SUB AREA</span>
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
                                        <span>Asset Model</span>
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
                                        options={ (assetModels.length > 0) ? [...assetModelsNullArr, ...assetTypes] : []}
                                      />  
                                    </div>
                                    </div>


                                    <div className="form-group">
                                        <label>Asset Serial Number</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="asset_serial_number" name="asset_serial_number" placeholder="Asset Serial Number" 
                                            value={state.asset_serial_number} onChange={onChangeHandle}/>
                                        </div>
                                        {simpleValidator.current.message('asset_serial_number', state.asset_serial_number, 'required')}
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
                                        defaultValue={selectedPropertyTypeOption}
                                        onChange={handleSelectPropertyTypeChange}
                                        options={ (propertyTypes.length > 0) ? [...propertyTypesNullArr, ...propertyTypes] : []}
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
                                        defaultValue={selectedPropertyOption}
                                        //onChange={handleSelectPropertyChange}
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
                                        onChange={handleSelectAreaChange}
                                        options={ (areas.length > 0) ? [...areaNullArr, ...areas] : []}
                                      />  
                                    </div>
                                    </div>
                                       

                                        <div className="form-group">
                                        <label>Suit Number</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="suit_number" name="suit_number" placeholder="Suit Number" 
                                            value={state.suit_number} onChange={onChangeHandle}/>
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
                                        defaultValue={selectedTenantOption}
                                        onChange={handleSelectTenantChange}
                                        options={ (tenants.length > 0) ? [...tenantsNullArr, ...tenants] : []}
                                      />  
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
                                                    <span>Photo</span>
                                                  </label>
                                                <div className="input-group input-group-sm">
                                                    
                                                     <input type="file" name="photo" 
                                                      onChange={handleFileChange} 
                                                  />
                                                </div>
                                               
                                          </div> 
                   
                      

                       <div className="form-group text-center">
                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Save</button>
                            <Link to='/payments' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                        </div>
                                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(New)