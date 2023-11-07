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

    const [quickModal, setQuickModal] = useState(false);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPropertyTypeOption, setSelectedPropertyTypeOption]  = useState(props.dropdowns.property_type ? 
        props.dropdowns.property_type : null ); 
    let propertyTypeNullArr = [{'label' : 'Select Property Type' , 'value' : null}];
   
    const handleClose = () => setQuickModal(false);
    const handleShow = () => {
          setQuickModal(true);
          loadData();
          setState({
            ...state,
            property_type_id: props.dropdowns.property_type ? props.dropdowns.property_type.id : null,
        });
        setSelectedPropertyTypeOption(props.dropdowns.property_type ? 
        props.dropdowns.property_type : null );
    }

    const [state, setState] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone_number: '',
        layout_attachment: '',
        extra_attachment: '',
        notes: '',
        property_type_id: "",
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
        document.title = 'New Property';
        props.setActiveComponentProp('New');
    }, []);
    
     const handleSelectPropertyTypeChange = (selectedOption) => {
         setState(state => ({
              ...state,
              property_type_id: selectedOption.value,
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
                setPropertyTypes(response.data.message.propertyTypes)  
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : 'Error! '
                });
            });
        };

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


    const onQuickSubmitHandle = (e) =>{
        e.preventDefault();
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            var formData = new FormData();
            formData.append('name', state.name);
            formData.append('address', state.address);
            formData.append('city', state.city);
            formData.append('state', state.state);
            formData.append('zip', state.zip);
            formData.append('phone_number', state.phone_number);
            formData.append('layout_attachment', state.layout_attachment);
            formData.append('extra_attachment', state.extra_attachment);
            formData.append('property_type_id', state.property_type_id);
            formData.append('notes', state.notes);
          
            axios.post(
              '/api/v1/properties',formData,{
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

                     setState({
                        ...state,
                            name: "",
                            address: "",
                            city: "",
                            state: "",
                            zip: "",
                            phone_number: '',
                            layout_attachment: '',
                            extra_attachment: '',
                            notes: '',
                            property_type_id: ""
                    });
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
                                                <span className="nav-link btn btn-gradient-primary btn-block active">NEW PROPERTY</span>
                                            </li>
                                        </ul>
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

                                     {/* account_number */}
                    <div className="form-group">
                      <label>
                        <span>Addess</span>
                      </label>
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-home-outline"></i>
                            </span>
                        </div>
                        <input type="text" name="address" placeholder="Addess"
                    value={state.address}
                    onChange={onChangeHandle}
                    className="form-control form-control-sm"/>
                    </div>
                   
                      </div> 

                      <div className="form-group">
                      <label>
                        <span>City</span>
                      </label>
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-home"></i>
                            </span>
                        </div>
                        <input type="text" name="city" placeholder="City"
                    value={state.city}
                    onChange={onChangeHandle}
                    className="form-control form-control-sm"/>
                    </div>
                   
                      </div>

                      <div className="form-group">
                      <label>
                        <span>State</span>
                      </label>
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-office-building"></i>
                            </span>
                        </div>
                        <input type="text" name="state" placeholder="State"
                    value={state.state}
                    onChange={onChangeHandle}
                    className="form-control form-control-sm"/>
                    </div>
                   
                      </div> 

                      <div className="form-group">
                      <label>
                        <span>Zip</span>
                      </label>
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-email"></i>
                            </span>
                        </div>
                        <input type="text" name="zip" placeholder="Zip"
                    value={state.zip}
                    onChange={onChangeHandle}
                    className="form-control form-control-sm"/>
                    </div>
                   
                      </div>

                      <div className="form-group">
                      <label>
                        <span>Phone Number</span>
                      </label>
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-cellphone"></i>
                            </span>
                        </div>
                        <input type="text" name="phone_number" placeholder="Phone Number"
                    value={state.phone_number}
                    onChange={onChangeHandle}
                    className="form-control form-control-sm"/>
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
                        <span>Property Layout Attachment</span>
                      </label>
                    <div className="input-group input-group-sm">
                        
                         <input type="file" name="layout_attachment" 
                          onChange={handleFileChange} 
                      />
                    </div>
                   
                      </div> 

                      <div className="form-group">
                      <label>
                        <span>Extra Attachment</span>
                      </label>
                    <div className="input-group input-group-sm">
                        
                         <input type="file" name="extra_attachment" 
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