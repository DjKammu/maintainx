import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import rootAction from '../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Modal } from 'react-bootstrap';


function New(props) {

    const [quickModal, setQuickModal] = useState(false);
    const [url,setUrl] = useState(false);
    const [id,setId] = useState(false);
   
    const handleClose = () => setQuickModal(false);
     const handleShow = () => {
          setQuickModal(true);
          setUrl(props.url ? props.url : null );
          setId(props.id ? props.id : null );
    }

    const [state, setState] = useState({
        password: "",
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

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

    const onQuickSubmitHandle = (e) =>{
        e.preventDefault();
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            var formData = new FormData();
            formData.append('password', state.password);
            formData.append('id', id);

            let URL = url+'/destroy';
            axios.post(
              URL,formData,{
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
                              account_number: "",
                              notes: ''
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
                     className="btn btn-danger btn-sm btn-upper">
                      Delete
                    </button>

             {/* delete account confirmation modal */}
              <Modal size="sm" className="delete-modal" show={quickModal} >

               <div  className="card animated fadeIn">
                <div  onClick={e=>e.stopPropagation()} className="react-confirm-alert">

                  <div className="row justify-content-center">
                        <div className="">
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

                              <form className="react-confirm-alert-body">
                                    <input type="hidden" name="api_token" value={state.authUser.api_token} />
                                    <h1>Confirm to delete</h1>
                                    <p>Are you sure to do this?
                                     Enter user password for delete this.</p>
			        
                                    <div className="form-group">
                                    <input type="password" className="form-control form-control-sm" id="password" name="password" placeholder="Name" 
                                            value={state.password} onChange={onChangeHandle}/>
                                        {simpleValidator.current.message('password', state.password, 'required')}
                                    </div>

                         <div className="react-confirm-alert-button-group text-center">
                        
                           <button type="submit" onClick={onQuickSubmitHandle}>Yes</button>
			             <button type="button" onClick={handleClose}>No</button>
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