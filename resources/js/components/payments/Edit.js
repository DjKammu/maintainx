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

function Edit(props) {
    
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
        document.title = 'Edit Payment';
        props.setActiveComponentProp('Edit');
        loadPageData();
        loadData();
    }, []);

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }  

    const onDateHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            payment_date : value
        });
    }

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

    const loadPropertyTypes = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/attributes',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                if(state.non_asset ===  "0" ){
                   setPropertyTypes2(response.data.message.propertyTypes)  
                }else{
                   setPropertyTypes1(response.data.message.propertyTypes)  
                }
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
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

        const  loadWorkTypes = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/attributes',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false)
                setWorkTypes(response.data.message.workTypes) 
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
                });
            });
        }; 

        const  loadContractors = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/attributes',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                setContractors(response.data.message.contractors) 
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
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

    const onNonAssetHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value,
            asset_type_id: (value === '0' )  ? props.location.state.asset_type_id : "",
            asset_model_id: (value === '0' )  ? props.location.state.asset_model_id : "",
            // property_type_id: "",
            // property_id: "",
            // area_id: "",
            // sub_area_id: "",
            // tenant_id: ""
        });
       
        setAssetModels([]);
        setPropertyTypes([]);
        setProperties([]);
        setAreas([]);
        setSubAreas([]);
        setTenants([]);
        setSelectedAssetModelOption((value === '0' && props.location.state.asset_model) ? 
        props.location.state.asset_model : []);
        setSelectedAssetTypeOption((value === '0' && props.location.state.asset_type)  ? 
        props.location.state.asset_type : []);
        setSelectedPropertyTypeOption(( props.location.state.property_type) ? 
        props.location.state.property_type :  []);
        setSelectedPropertyOption(( props.location.state.property) ?  
        props.location.state.property : []);
        setSelectedAreaOption(( props.location.state.area) ?  
        props.location.state.area :  []);
        setSelectedSubAreaOption(( props.location.state.sub_area) ?  
        props.location.state.sub_area :  []);
        setSelectedTenantOption((props.location.state.tenant) ? 
        props.location.state.tenant : []);

        if(value === "1"){
          setPropertyTypes(propertyTypes2);
        }

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

        setSelectedAssetTypeOption(option);
        // setAssetModels([]);
        setIsLoading(true);

        setPropertyTypes([]);
        setSelectedAssetModelOption((props.location.state.asset_type_id == option.value)  ? (props.location.state.asset_model ? 
        props.location.state.asset_model : null) : []);

        setSelectedPropertyTypeOption((props.location.state.asset_type_id == option.value)  ? (props.location.state.property_type ? 
        props.location.state.property_type : null) : []);
        setProperties([]);
        setSelectedPropertyOption((props.location.state.asset_type_id == option.value)  ? (props.location.state.property ? 
        props.location.state.property : null) : []);
        setAreas([]);
        setSelectedAreaOption((props.location.state.asset_type_id == option.value)  ? (props.location.state.area ? 
        props.location.state.area : null) : []);
        setSubAreas([]);
        setTenants([]);
        setSelectedSubAreaOption((props.location.state.asset_type_id == option.value)  ? (props.location.state.sub_area ? 
        props.location.state.sub_area : null) : []);
        setSelectedTenantOption((props.location.state.asset_type_id == option.value)  ? (props.location.state.tenant ? 
        props.location.state.tenant : null) : []);


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

      const handleSelectAssetModelChange = (option) => {
         setState(state => ({
              ...state,
              asset_model_id: option.value,
          }));
        setSelectedAssetModelOption(option);
        // setPropertyTypes([]);
        // setSelectedPropertyTypeOption((props.location.state.asset_model_id == option.value)  ? (props.location.state.property_type ? 
        // props.location.state.property_type : null) : []);
        // setProperties([]);
        // setSelectedPropertyOption((props.location.state.asset_model_id == option.value)  ? (props.location.state.property ? 
        // props.location.state.property : null) : []);
        // setAreas([]);
        // setSelectedAreaOption((props.location.state.asset_model_id == option.value)  ? (props.location.state.area ? 
        // props.location.state.area : null) : []);
        // setSubAreas([]);
        // setTenants([]);
        // setSelectedSubAreaOption((props.location.state.asset_model_id == option.value)  ? (props.location.state.sub_area ? 
        // props.location.state.sub_area : null) : []);
        // setSelectedTenantOption((props.location.state.asset_model_id == option.value)  ? (props.location.state.tenant ? 
        // props.location.state.tenant : null) : []);

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
        setAreas([]);
        setSubAreas([]);

        setSelectedPropertyOption((props.location.state.property_type_id == selectedOption.value)  ? (props.location.state.property ? 
        props.location.state.property : null) : []);
        setSelectedAreaOption((props.location.state.property_type_id == selectedOption.value)  ? (props.location.state.area ? 
        props.location.state.area : null) : []);
        setSelectedSubAreaOption((props.location.state.property_type_id == selectedOption.value)  ? (props.location.state.sub_area ? 
        props.location.state.sub_area : null) : []);

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
        setSubAreas([]);
        setSelectedAreaOption((props.location.state.property_id == selectedOption.value)  ? (props.location.state.area ? 
        props.location.state.area : null) : []);
        setSelectedSubAreaOption((props.location.state.area_id == selectedOption.value)  ? (props.location.state.sub_area ? 
        props.location.state.sub_area : null) : []);

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
        setSelectedSubAreaOption((props.location.state.area_id == selectedOption.value)  ? (props.location.state.sub_area ? 
        props.location.state.sub_area : null) : []);
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
        setSelectedTenantOption((props.location.state.sub_area_id == selectedOption.value)  ? (props.location.state.tenant ? 
        props.location.state.tenant : null) : []);

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
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });

     }

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
                payment_date: props.location.state.payment_date,
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
                      payment_date: _data.payment_date,
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


      const loadData = () => {
          setIsLoading(true);
          axios.get('/api/v1/payments/attributes?id='+id,{
              params: {
                  api_token: authUser.api_token
              }
          })
          .then(response => {
              setIsLoading(false);
              setAssetTypes(response.data.message.assetTypes)  
              //setPropertyTypes2(response.data.message.propertyTypes)  
              setPropertyTypes(response.data.message.propertyTypes)  
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
            formData.append('payment', state.payment);
            formData.append('payment_date', state.payment_date);
            formData.append('brand', state.brand);
            formData.append('description', state.description);
            formData.append('non_asset', state.non_asset);
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
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">EDIT PAYMENT</span>
                                                </li>
                                            </ul>
                                        </div>
                                      <div className="form-group">
                                       <div className="input-group input-group-sm"> 
                                       <input
                                             value="0"
                                              name="non_asset"
                                              type="radio"
                                              onChange={onNonAssetHandle}
                                              checked={state.non_asset ==="0"}
                                            />  
                                           <label  className="mx-1 mr-4 my-1" >
                                                Asset
                                            </label>

                                           <input
                                              value="1"
                                              name="non_asset"
                                              type="radio"
                                              onChange={onNonAssetHandle}
                                              checked={state.non_asset ==="1"}
                                            />
                                            <label  className="mx-1 mr-4 my-1" > Non Asset</label>
                                           </div>
                                          </div>

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
                                              onChange={handleSelectAssetTypeChange}
                                              options={ (assetTypes.length > 0) ? [...assetTypesNullArr, ...assetTypes] : []}
                                            /> 
                                             <QuickAddAssetType fn={loadAssetTypes} /> 
                                          </div>
                                          </div>
                                          }


                                          {state.non_asset ===  "1" &&

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


                                          }


                                    
                                      <div className="form-group">
                                        <label>Brand</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="brand" name="brand" placeholder="Brand Name" 
                                            value={state.brand} onChange={onChangeHandle}/>
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
                                        options={ (properties.length > 0) ? properties : []}
                                      />  
                                       <QuickAddProperty fn={loadProperty} 
                                       dropdowns={
                                            {
                                             property_type : selectedPropertyTypeOption 
                                           }
                                        } />
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
                                             property : selectedPropertyOption ,
                                             property_type : selectedPropertyTypeOption 
                                           }
                                        }
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
                                        value={selectedVendorOption}
                                        onChange={handleSelectVendorChange}
                                        options={ (vendors.length > 0) ? [...vendorsNullArr, ...vendors] : []}
                                      />  
                                     <QuickAddVendor fn={loadVendors} />
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
                                        onChange={handleSelectContractorChange}
                                        options={ (contractors.length > 0) ? [...contractorsNullArr, ...contractors] : []}
                                      />
                                       <QuickAddContractor fn={loadContractors} /> 
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
                                        onChange={handleSelectWorkTypeChange}
                                        options={ (workTypes.length > 0) ? [...workTypesNullArr, ...workTypes] : []}
                                      />  
                                      <QuickAddWorkType fn={loadWorkTypes} />
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
                                            value={state.payment} onChange={onChangeHandle}/>
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
                                            onChange={onDateHandle} 
                                            className="form-control form-control-sm"
                                            type="date" />

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
                                            <Link to='/payments' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Edit)