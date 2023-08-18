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
import QuickAdd from '../sub-areas/QuickAdd';

function New(props) {

    const [properties, setProperties] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const selectedPropertyTypeOption = null;
    const selectedAssetTypeOption = null;
    const [selectedAreaOption, setSelectedAreaOption]  = useState([]);
    const [selectedPropertyOption, setSelectedPropertyOption]  = useState([]);
    const [selectedSubAreaOption, setSelectedSubAreaOption]  = useState([]);
    let assetTypeNullArr = [{'label' : 'Select Asset Type' , 'value' : null}];
    let propertyTypeNullArr = [{'label' : 'Select Property Type' , 'value' : null}];
    let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
    let areaNullArr = [{'label' : 'Select Area' , 'value' : null}];
    let subAreaNullArr = [{'label' : 'Select Sub Area' , 'value' : null}];

    const [state, setState] = useState({
        name: "",
        account_number: "",
        asset_type_id: "",
        property_type_id: "",
        property_id: "",
        area_id: "",
        sub_area_id: "",
        serial_number: '',
        files: '',
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
        document.title = 'New Asset';
        props.setActiveComponentProp('New');
        loadData();
        loadAssetTypes();
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

    const handleSelectPropertyTypeChange = (selectedOption) => {
         setState(state => ({
              ...state,
              property_type_id: selectedOption.value,
              property_id   : null
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
      }

     const handleSelectAssetTypeChange = (selectedOption) => {
         setState(state => ({
              ...state,
              asset_type_id: selectedOption.value
          }));
      }


      const handleSelectPropertyChange = (selectedOption) => {
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
         setState(state => ({
              ...state,
              area_id: selectedOption.value,
              sub_area_id   : null
          }));
        setSelectedAreaOption(selectedOption);
          
        setSubAreas([]);
        setSelectedSubAreaOption([]);
        setIsLoading(true);

         axios.get('/api/v1/tenants/sub-area',{
            params: {
                api_token: authUser.api_token,
                area_id : selectedOption.value
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
         setState(state => ({
              ...state,
              sub_area_id: selectedOption.value,
          }));
         setSelectedSubAreaOption(selectedOption);
     }

     const loadSubarea = () => {
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

     }


     const loadData = () => {
            setIsLoading(true);
            axios.get('/api/v1/properties/property-types',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                setPropertyTypes(response.data.message.propertyTypes);
                
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
            });
        }; 


         const loadAssetTypes = () => {
            setIsLoading(true);
            axios.get('/api/v1/asset-model/asset-types',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                setAssetTypes(response.data.message.assetTypes);
                
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : error.response.data.message
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
            formData.append('account_number', state.account_number);
            formData.append('asset_type_id', state.asset_type_id);
            formData.append('property_type_id', state.property_type_id);
            formData.append('property_id', state.property_id);
            formData.append('area_id', state.area_id);
            formData.append('sub_area_id', state.sub_area_id);
            formData.append('serial_number', state.serial_number);
            if(state.files.length > 0){
               state.files.map((file) => {
                     formData.append('files[]', file);
                });  
            }
            
            axios.post(
              '/api/v1/asset-model',formData,{
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
                    history.push('/asset-model')
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
                                                <span className="nav-link btn btn-gradient-primary btn-block active">NEW ASSET</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="form-group">
                                        <label>Asset Name</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="name" name="name" placeholder="Asset Name" 
                                            value={state.name} onChange={onChangeHandle}/>
                                        </div>
                                        {simpleValidator.current.message('name', state.name, 'required')}
                                    </div>

                                     


                                           {/* property */}
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
                                        options={ (assetTypes.length > 0) ? [...assetTypeNullArr, ...assetTypes] : []}
                                      />  
                                    </div>
                                    </div>   

                                       {/* property */}
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
                                        options={ (propertyTypes.length > 0) ? [...propertyTypeNullArr, ...propertyTypes] : []}
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
                                        onChange={handleSelectPropertyChange}
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
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedAreaOption}
                                        onChange={handleSelectAreaChange}
                                        options={ (areas.length > 0) ? [...areaNullArr, ...areas] : []}
                                      />  
                                    </div>
                                    </div>
                                   {/* sub_area */}
                                    <div className="form-group">
                                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                                        <span>Sub Area</span>
                                      </label>
                                       <div className="input-group input-group-sm">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-gradient-success text-white">
                                                <i className="mdi mdi-home-outline"></i>
                                            </span>
                                        </div>
                                        <Select
                                        value={selectedSubAreaOption}
                                        onChange={handleSelectSubAreaChange}

                                        options={ (subAreas.length > 0) ? [...subAreaNullArr, ...subAreas] : []}
                                      />  
                                      <QuickAdd fn={loadSubarea} />
                                    </div>
                                      
                                    </div>
                                    
                                    {/* account_number */}
                                        <div className="form-group">
                                          <label>
                                            <span>Model Number</span>
                                          </label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-circle-edit-outline"></i>
                                                </span>
                                            </div>
                                        <input type="text" name="account_number" placeholder="Model Number"
                                        value={state.account_number}
                                        onChange={onChangeHandle}
                                        className="form-control form-control-sm"/>
                                        </div>
                                       
                                          </div> 

                                           {/* serial_number */}
                                         <div className="form-group">
                                          <label>
                                            <span>Serial Number</span>
                                          </label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-circle-edit-outline"></i>
                                                </span>
                                            </div>
                                            <input type="text" name="serial_number" placeholder="Serial Number"
                                        value={state.serial_number}
                                        onChange={onChangeHandle}
                                        className="form-control form-control-sm"/>
                                        </div>
                                       
                                          </div> 


                                           <div className="form-group">
                                              <label>
                                                <span>Attachments</span>
                                              </label>
                                            <div className="input-group input-group-sm">
                                                
                                                 <input type="file" multiple name="files" 
                                                  onChange={handleFileChange} 
                                              />
                                            </div>
                                            </div>


                   
                      

                       <div className="form-group text-center">
                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Save</button>
                            <Link to='/asset-model' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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