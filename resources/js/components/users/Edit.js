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

function Edit(props) {
    const selectedOption  =  props.location.state.roles ? props.location.state.roles : null; 
    const selectedPropertyOption  =  props.location.state.properties ? props.location.state.properties : null; 

    const [properties, setProperties] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
    let roleNullArr = [{'label' : 'Select Role' , 'value' : null}];

    const [state, setState] = useState({
        id: props.location.state.id ? props.location.state.id : '',
        name: props.location.state.name ? props.location.state.name : '',
        email: props.location.state.email ? props.location.state.email : '',
        password: props.location.state.password ? props.location.state.password : '',
        confirm_password: props.location.state.confirm_password ? props.location.state.confirm_password : '',
        role: props.location.state.roles[0] ? props.location.state.roles[0].id : null,
        properties: props.location.state.properties ? props.location.state.properties : [],
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
        document.title = 'Edit User';
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

    const handleSelectChange = (opt) => {
         setState(state => ({
              ...state,
              role: opt.value,
          }));
      }  

      const handleSelectPropertyChange = (opt) => {
        let propertiesArr = opt.map(property =>  property.id)

         setState(state => ({
              ...state,
              properties: propertiesArr,
          }));
      }


    const onSubmitHandle = (e) =>{
        e.preventDefault();
        
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/users/update', state,{
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
                    history.push('/users')
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

        const loadData = () => {
        setIsLoading(true);
        axios.get('/api/v1/users/create',{
            params: {
                api_token: authUser.api_token
            }
        })
        .then(response => {
            setIsLoading(false);
            let rolesArr = response.data.message.roles
            let propertiesArr = response.data.message.properties
            setRoles(rolesArr);
            setProperties(propertiesArr);  
        })
        .catch((error) => {
            showSznNotification({
                type : 'error',
                message : error.response.data.message
            });
        });
    };

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
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">EDIT USER</span>
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
                                                      {/* account_number */}
                    <div className="form-group">
                      <label>
                        <span>Email Addess</span>
                      </label>
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-email"></i>
                            </span>
                        </div>
                        <input type="email" name="email" placeholder="Email Addess"
                    value={state.email}
                    onChange={onChangeHandle}
                    className="form-control form-control-sm"/>
                    </div>
                    {simpleValidator.current.message('email', state.email, 'required')}
                      

                    </div>

                  {/* password */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        <span>Password</span>
                      </label>
                        <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-lock"></i>
                            </span>
                        </div>
                        <input type="password" name="password" placeholder="Password"
                        value={state.password}
                        onChange={onChangeHandle}
                        className="form-control form-control-sm"/>
                        </div>
                      

                    </div>

                  {/* password_confirmation */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="password_confirmation">
                        <span>Confirm Password</span>
                      </label>
                        <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-gradient-success text-white">
                                <i className="mdi mdi-lock"></i>
                            </span>
                        </div>
                        <input type="password" name="password_confirmation" placeholder="Confirm Password"
                        value={state.password_confirmation}
                        onChange={onChangeHandle}
                        className="form-control form-control-sm"/>
                        </div>

                    </div>

                  {/* role */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                        <span>Role</span>
                      </label>
                            <div className="input-group input-group-sm">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-gradient-success text-white">
                                    <i className="mdi mdi-account-multiple"></i>
                                </span>
                            </div>
                            <Select
                             defaultValue={selectedOption}
                            onChange={handleSelectChange}
                            options={ (roles.length > 0) ? [...roleNullArr, ...roles] : []}
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
                        onChange={handleSelectPropertyChange}
                        options={ (properties.length > 0) ? [...propertyNullArr, ...properties] : []}
                        isMulti
                        isClearable
                      />  
                    </div>
                             </div>
                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Update</button>
                                            <Link to='/users' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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