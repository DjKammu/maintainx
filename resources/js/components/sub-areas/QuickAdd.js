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
import { Button, Modal } from 'react-bootstrap';

function New(props) {

    const [properties, setProperties] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isQuickLoading, setIsQuickLoading] = useState(true);
    const [selectedPropertyOption, setSelectedPropertyOption]  = useState(props.dropdowns.property ? 
        props.dropdowns.property : null ); 
    const [selectedAreaOption, setSelectedAreaOption]  = useState(props.dropdowns.area ? 
        props.dropdowns.area : null);
    let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
    let areaNullArr = [{'label' : 'Select Area' , 'value' : null}];
    
    const [quickModal, setQuickModal] = useState(false);
   
    const handleClose = () => setQuickModal(false);
    const handleShow = () => {
          setQuickModal(true);
          loadData();
          setState({
            ...state,
            property_id: props.dropdowns.property ? props.dropdowns.property.id : null,
            area_id: props.dropdowns.area ? props.dropdowns.area.id : null,
        });
        setSelectedPropertyOption(props.dropdowns.property ? 
        props.dropdowns.property : null );
        setSelectedAreaOption(props.dropdowns.area ? 
        props.dropdowns.area : null );
    }


    const [state, setState] = useState({
        name: "",
        property_id: props.dropdowns.property ? props.dropdowns.property.id : null,
        area_id: props.dropdowns.area ? props.dropdowns.area.id : null,
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
    //loadData();
    });

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
    
    const handleSelectPropertyChange = (selectedOption) => {
         setState(state => ({
              ...state,
              property_id: selectedOption.value,
              area_id   : null
          }));

        setAreas([]);
        setSelectedAreaOption([]);
        setIsQuickLoading(true);
         axios.get('/api/v1/sub-areas/areas',{
            params: {
                api_token: authUser.api_token,
                property : selectedOption.value
             }
            })
          .then(response => {
            setIsQuickLoading(false);
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
          }));
         setSelectedAreaOption(selectedOption);
     }

    const loadData = () => {
            setIsQuickLoading(true);
            axios.get('/api/v1/areas/properties',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsQuickLoading(false);
                setProperties(response.data.message.properties)  
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
            });
        };

    const onQuickSubmitHandle = (e) =>{

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
              '/api/v1/sub-areas',formData,{
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
                    setQuickModal(false)
                    props.fn();
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

                  <button type="button"
                      onClick={handleShow}
                      className="btn btn-gradient-primary btn-md mr-2">
                      Quick Add
                    </button>
             
           
             {/* delete account confirmation modal */}
              <Modal size="md" show={quickModal} >
                <div    className="card animated fadeIn">
                <div  onClick={e=>e.stopPropagation()} className="card-body">
                    <div className="row justify-content-center">
                        <div className="col-md-12 ">
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
                                <form className="new-lead-form border">
                                    <input type="hidden" name="api_token" value={state.authUser.api_token} />
                                    <div className="form-group">
                                        <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                            <li className="nav-item">
                                                <span className="nav-link btn btn-gradient-primary btn-block active">NEW SUB AREA/SUITE</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="name" name="name" placeholder="Name" 
                                            value={state.name} onChange={onChangeHandle}/>
                                        </div>
                                        {simpleValidator.current.message('name', state.name, 'required')}
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
                            <button type="submit" onClick={onQuickSubmitHandle} className="btn btn-gradient-primary btn-md mr-2">Save</button>
                            <button type="button" onClick={handleClose} className="btn btn-inverse-secondary btn-md">Cancel</button>
                        </div>
                                </form>
                            </LoadingOverlay>
                        </div>
                    </div>
                </div>
            </div>
              </Modal>

            
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