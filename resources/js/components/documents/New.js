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
import QuickAddAssetType from '../asset-types/QuickAdd';
import QuickAddPropertyType from '../property-types/QuickAdd';
import QuickAddProperty from '../properties/QuickAdd';
import QuickAddArea from '../areas/QuickAdd';
import QuickAddSubArea from '../sub-areas/QuickAdd';
import QuickAddContractor from '../contractors/QuickAdd';
import QuickAddVendor from '../vendors/QuickAdd';
import QuickAddWorkType from '../work-types/QuickAdd';

function New(props) {
    
    const [properties, setProperties] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [areas, setAreas] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectedVendorOption = null;
    const [selectedAssetModelOption, setSelectedAssetModelOption]  = useState([]);
    const [selectedDocumentTypeOption, setSelectedDocumentTypeOption]  = useState([]);
    const [selectedAssetTypeOption, setSelectedAssetTypeOption]  = useState([]);
    const [selectedTenantOption, setSelectedTenantOption]  = useState([]);
    const [selectedAreaOption, setSelectedAreaOption]  = useState([]);
    const [selectedSubAreaOption, setSelectedSubAreaOption]  = useState([]);
    const [selectedPropertyOption, setSelectedPropertyOption]  = useState([]);
    const [selectedPropertyTypeOption, setSelectedPropertyTypeOption]  = useState([]);
    let assetModelsNullArr = [{'label' : 'Select Asset' , 'value' : null}];
    let assetTypesNullArr = [{'label' : 'Select Asset Type' , 'value' : null}];
    let vendorsNullArr = [{'label' : 'Select Vendor' , 'value' : null}];
    let documentTypesNullArr = [{'label' : 'Select Document Type' , 'value' : null}];
    let propertyTypesNullArr = [{'label' : 'Select Property Type' , 'value' : null}];
    let tenantsNullArr = [{'label' : 'Select Tenant' , 'value' : null}];
    let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
    let areaNullArr = [{'label' : 'Select Area' , 'value' : null}];
    let subAreaNullArr = [{'label' : 'Select Sub Area' , 'value' : null}];

    const [state, setState] = useState({
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
        document.title = 'New Document';
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
              [name]:  Array.from(e.target.files)
          }));  
     }

     const handleSelectAssetModelChange = (option) => {
         setState(state => ({
              ...state,
              asset_model_id: option.value,
          }));

        // setPropertyTypes([]);
        // setSelectedPropertyTypeOption([]);
        // setProperties([]);
        // setSelectedPropertyOption([]);
        // setAreas([]);
        // setSelectedAreaOption([]);
        // setSubAreas([]);
        // setTenants([]);
        // setSelectedSubAreaOption([]);
        // setSelectedTenantOption([]);

        setIsLoading(true);

        axios.get('/api/v1/payments/asset-selection',{
            params: {
                api_token: authUser.api_token,
                asset : option.value
             }
            })
          .then(response => {
            setIsLoading(false);
          //   setSelectedPropertyTypeOption(response.data.message.asset.property_type)
          //   setSelectedPropertyOption(response.data.message.asset.property)
          //   setSelectedAreaOption(response.data.message.asset.area)
          //   setSelectedSubAreaOption(response.data.message.asset.sub_area)
          //   setTenants(response.data.message.tenants)  

          //    setState(state => ({
          //     ...state,
          //     asset_model_id: option.value,
          //     property_type_id: response.data.message.asset.property_type_id,
          //     property_id: response.data.message.asset.property_id,
          //     area_id: response.data.message.asset.area_id,
          //     sub_area_id: response.data.message.asset.sub_area_id
          // }));

          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });


      }  

    
      const handleSelectAssetTypeChange = (option) => {
         setState(state => ({
              ...state,
              asset_type_id: option.value
          }));  
        setSelectedAssetTypeOption(option);
        return;

        setIsLoading(true);

        axios.get('/api/v1/payments/assets',{
            params: {
                api_token: authUser.api_token,
                asset_type : option.value
             }
            })
          .then(response => {
            setIsLoading(false);
            // setAssetModels(response.data.message.assets)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });

      }
      
      const handleSelectDocumentTypeChange = (option) => {
         setState(state => ({
              ...state,
              document_type_id: option.value
          }));  
        setSelectedDocumentTypeOption(option);
      }

     const handleSelectTenantChange = (option) => {
         setState(state => ({
              ...state,
              tenant_id: option.value,
          }));
          setSelectedTenantOption(option)
      }

      const handleSelectVendorChange = (option) => {
         setState(state => ({
              ...state,
              vendor_id: option.value,
          }));
      }
      

    const onDateHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

  const handleSelectPropertyTypeChange = (selectedOption) => {

         // if(state.non_asset === '0'){
         //    return ;
         // }
         setState(state => ({
              ...state,
              property_type_id: selectedOption.value,
              property_id: null 
          }));

        setProperties([]);
        setSelectedPropertyOption([]);
        setAreas([]);
        setSelectedAreaOption([]);
        setSubAreas([]);
        setSelectedSubAreaOption([]);

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
          setSelectedPropertyTypeOption(selectedOption)
    }
    
      const handleSelectPropertyChange = (selectedOption) => {
        // if(state.non_asset === '0'){
        //     return ;
        //  }
         setState(state => ({
              ...state,
              property_id: selectedOption.value,
              area_id   : null
          }));
        setSelectedPropertyOption(selectedOption);
        setAreas([]);
         setSelectedAreaOption([]);
        setIsLoading(true);

         axios.get('/api/v1/sub-areas/areas',{
            params: {
                api_token: authUser.api_token,
                property : selectedOption.value
             }
            })
          .then(response => {
            setIsLoading(false);
            setAreas(response.data.message.area)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });
     } 

     const handleSelectAreaChange = (selectedOption) => {
        // if(state.non_asset === '0'){
        //     return ;
        //  }
         setState(state => ({
              ...state,
              area_id: selectedOption.value,
              sub_area_id   : null
          }));
        setSelectedAreaOption(selectedOption);
          
        setSubAreas([]);
        setSelectedSubAreaOption([]);
         setAssetModels([]);
        setIsLoading(true);

         axios.get('/api/v1/tenants/sub-area',{
            params: {
                api_token: authUser.api_token,
                area_id : selectedOption.value,
                asset_type : state.asset_type_id
             }
            })
          .then(response => {
            setIsLoading(false);
            setSubAreas(response.data.message.subArea)
            setAssetModels(response.data.message.assets)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });
     }
       
    const handleSelectSubAreaChange = (selectedOption) => {
      // if(state.non_asset === '0'){
      //       return ;
      //    }
         setState(state => ({
              ...state,
              sub_area_id: selectedOption.value,
          }));
          setSelectedSubAreaOption(selectedOption);

          setTenants([]);
          setAssetModels([]);
          setSelectedTenantOption([]);
          setIsLoading(true);

          axios.get('/api/v1/payments/tenant',{
            params: {
                api_token: authUser.api_token,
                sub_area_id : selectedOption.value,
                asset_type : state.asset_type_id
             }
            })
          .then(response => {
            setIsLoading(false);
            setTenants(response.data.message.tenants)
            setAssetModels(response.data.message.assets)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });

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
                //setPropertyTypes2(response.data.message.propertyTypes)  
                setPropertyTypes(response.data.message.propertyTypes)  
                setDocumentTypes(response.data.message.documentTypes)  
                // setAssetModels(response.data.message.assetModels)  
                setVendors(response.data.message.vendors)  
                // setContractors(response.data.message.contractors)  
                // setTenants(response.data.message.tenants)  
                // setWorkTypes(response.data.message.workTypes)  
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
                });
            });
        };

      const loadAssetTypes = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/attributes',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                setAssetTypes(response.data.message.assetTypes)  
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
                });
            });
        };

     const loadProperty = () => {

         // if(state.non_asset === '0'){
         //    return ;
         // }
       
        setProperties([]);
        setIsLoading(true);

         axios.get('/api/v1/payments/property',{
            params: {
                api_token: authUser.api_token,
                property_type : state.property_type_id
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
        };

        const loadAssets = () => {

        setAssetModels([]);
        setIsLoading(true);

         axios.get('/api/v1/payments/assets',{
            params: {
                api_token: authUser.api_token,
                asset_type : state.asset_type_id,
                area_id : state.area_id,
                sub_area_id : state.sub_area_id
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

        };


        const loadArea = () => {
        // if(state.non_asset === '0'){
        //     return ;
        //  }
        setAreas([]);
        setIsLoading(true);
         axios.get('/api/v1/sub-areas/areas',{
            params: {
                api_token: authUser.api_token,
                property : state.property_id
             }
            })
          .then(response => {
            setIsLoading(false);
            setAreas(response.data.message.area)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });

        };

        const loadSubarea = () => {
        // if(state.non_asset === '0'){
        //     return ;
        //  }

         setSubAreas([]);
        setSelectedSubAreaOption([]);
        setIsLoading(true);

        axios.get('/api/v1/tenants/sub-area',{
            params: {
                api_token: authUser.api_token,
                area_id : selectedAreaOption.value
             }
            })
          .then(response => {
            setIsLoading(false);
            setSubAreas(response.data.message.subArea)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });
        };

       const  loadPropertyTypes = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/attributes',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                // if(state.non_asset ===  "0" ){
                //    setPropertyTypes2(response.data.message.propertyTypes)  
                // }else{
                   setPropertyTypes(response.data.message.propertyTypes)  
                //}
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
                });
            });
        }; 

  
      const loadTenants = () => {
      // if(state.non_asset === '0'){
      //     return ;
      //  }
        setTenants([]);
        setSelectedTenantOption([]);
        setIsLoading(true);

          axios.get('/api/v1/payments/tenant',{
            params: {
                api_token: authUser.api_token,
                sub_area_id : selectedSubAreaOption.value
             }
            })
          .then(response => {
            setIsLoading(false);
            setTenants(response.data.message.tenants)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });

      };


      const  loadVendors = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/attributes',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                setVendors(response.data.message.vendors)  
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

        if (state.non_asset === '0' && !simpleValidator.current.allValid()) {
            simpleValidator.current.showMessages();
            forceUpdate(1);
            return;
          }
            setState({
                ...state,
                loading: true
            });

            var formData = new FormData();
            formData.append('document_type_id', state.document_type_id);
            formData.append('asset_type_id', state.asset_type_id);
            formData.append('brand', state.brand);
            formData.append('serial_number', state.serial_number);
            formData.append('model_number', state.model_number);
            formData.append('description', state.description);
            formData.append('install_date', state.install_date);
            formData.append('registration_date', state.registration_date);
            formData.append('manufactare_date', state.manufactare_date);
            formData.append('coverage_term', state.coverage_term);
            formData.append('coverage_type', state.coverage_type);
            formData.append('start_date', state.start_date);
            formData.append('end_date', state.end_date);
            formData.append('dealer_name', state.dealer_name);
            formData.append('property_type_id', state.property_type_id);
            formData.append('property_id', state.property_id);
            formData.append('area_id', state.area_id);
            formData.append('sub_area_id', state.sub_area_id);
            formData.append('tenant_id', state.tenant_id);
            formData.append('vendor_id', state.vendor_id);
            if(state.files && state.files.length > 0){
               state.files.map((file) => {
                     formData.append('files[]', file);
                });  
            }
          
            axios.post(
              '/api/v1/documents',formData,{
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
                    history.push('/documents')
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
        // } else {
        //     simpleValidator.current.showMessages();
        //     forceUpdate(1);
        // }

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
                                                <span className="nav-link btn btn-gradient-primary btn-block active">NEW DOCUMENT</span>
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
                                        onChange={handleSelectDocumentTypeChange}
                                        options={ (documentTypes.length > 0) ? [...documentTypesNullArr, ...documentTypes] : []}
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
                                        onChange={handleSelectAssetTypeChange}
                                        options={ (assetTypes.length > 0) ? [...assetTypesNullArr, ...assetTypes] : []}
                                      />  
                                      <QuickAddAssetType fn={loadAssetTypes} />
                                    </div>
                                    </div>

                                     {/* asset_model */}
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
                                       <QuickAddAsset fn={loadAssets} dropdowns={
                                          { 
                                              asset_type : selectedAssetTypeOption,
                                              area : selectedAreaOption , 
                                              sub_area : selectedSubAreaOption ,
                                              property : selectedPropertyOption ,
                                              property_type : selectedPropertyTypeOption 
                                         }
                                      }/>
                                    </div>
                                    {simpleValidator.current.message('Asset', state.asset_model_id, 'required')}
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
                                            value={state.coverage_term} onChange={onChangeHandle}/>
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
                                            value={state.coverage_type} onChange={onChangeHandle}/>
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
                                              onChange={onChangeHandle}
                                              value={state.description}
                                              className="form-control form-control-sm"></textarea>
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
                                            onChange={onDateHandle} 
                                            className="form-control form-control-sm"
                                            type="date" />

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
                                            onChange={onDateHandle} 
                                            className="form-control form-control-sm"
                                            type="date" />

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
                                            onChange={onDateHandle} 
                                            className="form-control form-control-sm"
                                            type="date" />

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
                                            onChange={onDateHandle} 
                                            className="form-control form-control-sm"
                                            type="date" />

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
                                            onChange={onDateHandle} 
                                            className="form-control form-control-sm"
                                            type="date" />

                                        </div>
                                    </div>

                                 {/* dealer_name */}
                                    {/* <div className="form-group">
                                      <label>Dealer Name</label>
                                      <div className="input-group input-group-sm">
                                          <div className="input-group-prepend">
                                              <span className="input-group-text bg-gradient-success text-white">
                                                  <i className="mdi mdi-account"></i>
                                              </span>
                                          </div>
                                          <input type="text" className="form-control form-control-sm" id="dealer_name" name="dealer_name" placeholder="Dealer Name" 
                                          value={state.dealer_name} onChange={onChangeHandle}/>
                                      </div>
                                  </div> */}
                                
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
                                      <QuickAddVendor fn={loadVendors} />
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
                                        onChange={handleSelectPropertyTypeChange}
                                        options={ (propertyTypes.length > 0) ? propertyTypes : []}
                                      />  
                                       <QuickAddPropertyType fn={loadPropertyTypes} />
                                      
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
                                        onChange={handleSelectPropertyChange}
                                        options={ (properties.length > 0) ? [...propertyNullArr, ...properties] : []}
                                      />  
                                       <QuickAddProperty fn={loadProperty} 
                                       dropdowns={
                                            {
                                             property_type : selectedPropertyTypeOption 
                                           }
                                        }
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
                                        options={ (areas.length > 0) ? areas : []}
                                      />  
                                      <QuickAddArea fn={loadArea} 
                                       dropdowns={
                                            {
                                             property : selectedPropertyOption 
                                           }
                                        }
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
                                        onChange={handleSelectSubAreaChange}
                                        options={ (subAreas.length > 0) ? subAreas : []}
                                      />
                                      <QuickAddSubArea fn={loadSubarea} 
                                       dropdowns={
                                            { area : selectedAreaOption , 
                                             property : selectedPropertyOption 
                                           }
                                        }
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
                                      <QuickAddTenant fn={loadTenants} dropdowns={
                                            { area : selectedAreaOption , 
                                             sub_area : selectedSubAreaOption ,
                                             property : selectedPropertyOption ,
                                             property_type : selectedPropertyTypeOption 
                                           }
                                        }
                                        />
                                    </div>
                                    </div>

                               
                                  <div className="form-group">
                                         <label>
                                           <span>Document Attachmennts</span>
                                         </label>
                                       <div className="input-group input-group-sm">

                                        <input type="file" multiple name="files" 
                                           onChange={handleFileChange}
                                         />
                                       </div>
                                      
                                  </div> 
                 
                       <div className="form-group text-center">
                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Save</button>
                            <Link to='/documents' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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