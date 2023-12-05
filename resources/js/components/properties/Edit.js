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
import QuickAddPropertyType from '../property-types/QuickAdd';

function Edit(props) {
    
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectedPropertyTypeOption  =  props.location.state.property_type ? props.location.state.property_type : null; 
   
    let propertyTypeNullArr = [{'label' : 'Select Property Type' , 'value' : null}];

   
    const [state, setState] = useState({
        id: props.location.state.id ? props.location.state.id : '',
         property_type_id: props.location.state.property_type ? props.location.state.property_type.id : null,
        name: props.location.state.name ? props.location.state.name : '',
        address: props.location.state.address ? props.location.state.address : '',
        city: props.location.state.city ? props.location.state.city : '',
        state: props.location.state.state ? props.location.state.state : '',
        zip: props.location.state.zip ? props.location.state.zip : '',
        phone_number: props.location.state.phone_number ? props.location.state.phone_number : '',
        notes: props.location.state.notes ? props.location.state.notes : '',
        layout_attachment: props.location.state.layout_attachment ? props.location.state.layout_attachment : '',
        extra_attachment: props.location.state.extra_attachment ? props.location.state.extra_attachment : '',
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
        document.title = 'Edit Property';
        props.setActiveComponentProp('Edit');
         loadPropertyTypes();
    }, []);

    const handleSelectPropertyTypeChange = (selectedOption) => {
         setState(state => ({
              ...state,
              property_type_id: selectedOption.value,
          }));
    }

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

    const loadPropertyTypes = () => {
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
            formData.append('address', state.address);
            formData.append('city', state.city);
            formData.append('state', state.state);
            formData.append('zip', state.zip);
            formData.append('phone_number', state.phone_number);
            formData.append('layout_attachment', state.layout_attachment);
            formData.append('extra_attachment', state.extra_attachment);
            formData.append('property_type_id', state.property_type_id);
            formData.append('notes', state.notes);
          

            axios.post('/api/v1/properties/update', formData,{
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
                    history.push('/properties')
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
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">EDIT PROPERTY</span>
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
                                      <QuickAddPropertyType fn={loadPropertyTypes} />
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

                                          {state.layout_attachment && state.layout_attachment.file && 
                                          <a href={state.layout_attachment.file} target="_blank" >
                                          <img className="ext-img" src={`/public/images/${state.layout_attachment.ext}.png`} />
                                          </a>}

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

                                           {state.extra_attachment && state.extra_attachment.file && 
                                          <a href={state.extra_attachment.file} target="_blank" >
                                          <img className="ext-img" src={`/public/images/${state.extra_attachment.ext}.png`} />
                                          </a>}


                                        </div>
                                       
                                          </div>

                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Update</button>
                                            <Link to='/properties' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Edit)