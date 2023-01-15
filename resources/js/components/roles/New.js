import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory } from 'react-router-dom';

function New(props) {
    const [permissions, setPermissions] = useState([]);
    const [state, setState] = useState({
        name: "",
        permissions: "",
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
        document.title = 'New Role';

        props.setActiveComponentProp('New');
    }, []);

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

    const handleCheckboxChange = event => {
      let permissionsArray = [...permissions, event.target.id];
      if (permissions.includes(event.target.id)) {
          permissionsArray = permissionsArray.filter(permission => permission !== event.target.id);
       } 
      setPermissions(permissionsArray);
    };


    const onSubmitHandle = (e) =>{
        e.preventDefault();
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/roles', $(e.target).serialize()+'&permissions='+permissions)
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
                    history.push('/roles')
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
                                                <span className="nav-link btn btn-gradient-primary btn-block active">NEW ROLE</span>
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
                                     {/* email */}
                            <div className="form-group">
                              <label>Permissions
                              </label>
                              <div className="input-group input-group-sm">
                              <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="view">
                                <span className="mr-1">View</span>
                                <input type="checkbox" id="view"  
                                   value="view"
                                   onChange={handleCheckboxChange}
                                  />
                              </label>
                              <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="add">
                                <span className="mr-1">Add</span>
                                <input type="checkbox" id="add"  
                                   value="add"
                                   onChange={handleCheckboxChange}
                                  />
                              </label>

                              <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="edit">
                                <span className="mr-1">Edit</span>
                                <input type="checkbox" id="edit"  
                                   value="edit"
                                   onChange={handleCheckboxChange}
                                  />
                              </label>
                              <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="update">
                                <span className="mr-1">Update</span>
                                <input type="checkbox" id="update"  
                                   value="update"
                                   onChange={handleCheckboxChange}
                                  />
                              </label> 

                              <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="delete">
                                <span className="mr-1">Delete</span>
                                <input type="checkbox" id="delete"  
                                   value="delete"
                                   onChange={handleCheckboxChange}
                                  />
                              </label>
                              <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="add_users">
                                <span className="mr-1">Add Users</span>
                                <input type="checkbox" id="add_users"  
                                   value="add_users"
                                   onChange={handleCheckboxChange}
                                  />
                              </label>
                             </div>
                               
                            </div>
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Save</button>
                            <Link to='/roles' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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