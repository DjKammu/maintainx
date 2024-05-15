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
import Autocomplete from '../Autocomplete';
import AutocompleteMulti from '../AutocompleteMulti';

function New(props) {

    const [properties, setProperties] = useState([]);
    const [areas, setAreas] = useState([]);
    const [rcs, setRcs] = useState([]);
    const [ccs, setCcs] = useState([]);
    const [bccs, setBccs] = useState([]);
    const [isQuickLoading, setIsQuickLoading] = useState(true);
     const [isLoading, setIsLoading] = useState(true);
    const [selectedPropertyOption, setSelectedPropertyOption]  = useState((props.dropdowns && props.dropdowns.property) ? 
        props.dropdowns.property : null ); 
    let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
    
    const [quickModal, setQuickModal] = useState(false);
   
    const handleClose = () => setQuickModal(false);
    const handleShow = () => {
          setQuickModal(true);
          loadMails();
          setState({
            ...state,
                query: props.params.query ? props.params.query : '',
                sort_by: props.params.sort_by ? props.params.sort_by : '',
                sort_type: props.params.sort_type ? props.params.sort_type : '',
                property_type: props.params.property_type ? props.params.property_type : '',
                property: props.params.property ? props.params.property : '',
                area: props.params.area ? props.params.area : '',
                sub_area: props.params.sub_area ? props.params.sub_area : '',
                tenant: props.params.tenant ? props.params.tenant : '',
                work_type: props.params.work_type ? props.params.work_type : '',
                columns: props.params.columns ? props.params.columns : ''
     });
    }

    const [state, setState] = useState({
        recipient: '',
        subject: '',
        message: '',
        cc: '',
        bcc: '',
        query: props.params.query ? props.params.query : '',
        sort_by: props.params.sort_by ? props.params.sort_by : '',
        sort_type: props.params.sort_type ? props.params.sort_type : '',
        property_type: props.params.property_type ? props.params.property_type : '',
        property: props.params.property ? props.params.property : '',
        area: props.params.area ? props.params.area : '',
        sub_area: props.params.sub_area ? props.params.sub_area : '',
        tenant: props.params.tenant ? props.params.tenant : '',
        work_type: props.params.work_type ? props.params.work_type : '',
        columns: props.params.columns ? props.params.columns : '',
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


    const onChangeRecipientHandle = (e) =>{
        let value = !e.target ? (e.email ? e.email : e ) : e.target.value
        setState({
            ...state,
            recipient : value
        });
    } 

     const onChangeCCHandle = (e) =>{
        let validEmail = true;
        let value = '';
         e.map((email) => {
            if(validateEmail(email.name)){
                value = value+(value ? ',' : '')+email.name;
            } else{
              validEmail = false;    
            }
         }); 
       if(!validEmail) {
          showSznNotification({
             type : 'error',
             message : "Enter Valid Email"
           });
       }
        setState({
            ...state,
            cc : value
        });
    }
     const onChangeBCCHandle = (e) =>{
        let validEmail = true;
        let value = '';
         e.map((email) => {
            if(validateEmail(email.name)){
                value = value+(value ? ',' : '')+email.name;
            } else{
              validEmail = false;    
            }
         }); 

        if(!validEmail) {
          showSznNotification({
             type : 'error',
             message : "Enter Valid Email"
           });
       }
       

        setState({
            ...state,
            bcc : value
        });
    }

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const loadMails = () => {
            setIsLoading(true);
            axios.get('/api/v1/payments/mails',{
                params: {
                    api_token: authUser.api_token
                }
            })
            .then(response => {
                setIsLoading(false);
                setRcs(response.data.message.rcs);
                setCcs(response.data.message.ccs);
                setBccs(response.data.message.bccs);
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
            formData.append('recipient', state.recipient);
            formData.append('subject', state.subject);
            formData.append('message', state.message);
            formData.append('cc', state.cc);
            formData.append('bcc', state.bcc);
            formData.append('query', state.query);
            formData.append('sort_by', state.sort_by);
            formData.append('sort_type', state.sort_type);
            formData.append('property_type', state.property_type);
            formData.append('property', state.property);
            formData.append('area', state.area);
            formData.append('sub_area', state.sub_area);
            formData.append('tenant', state.tenant);
            formData.append('work_type', state.work_type);
            formData.append('columns', state.columns);
          
            axios.post(
              '/api/v1/payments/mail',formData,{
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
                            recipient: "",
                            subject: "",
                            message: "",
                            cc: "",
                            bcc: "",
                    });
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
                      Mail
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
                                <form className="new-lead-form border mail-outer">
                                    <input type="hidden" name="api_token" value={state.authUser.api_token} />
                                    <div className="form-group">
                                        <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                            <li className="nav-item">
                                                <span className="nav-link btn btn-gradient-primary btn-block active">SEND MAIL</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="form-group">
                                        <label>Recipient </label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                               <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                            <Autocomplete options={rcs} placeholder={'Type'} text={true} fn={onChangeRecipientHandle} />
                                            {/*<input type="text" className="form-control form-control-sm" id="recipient" name="recipient" placeholder="Name" 
                                                                                        value={state.recipient} onChange={onChangeHandle}/>*/}
                                        </div>
                                        {simpleValidator.current.message('recipient', state.recipient, 'required|email')}
                                    </div>

                                    <div className="form-group">
                                        <label>CC: <span>email with comma seperated</span></label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                               <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                             <AutocompleteMulti options={ccs} placeholder={'Type'} text={true} fn={onChangeCCHandle} />
                                            {/*<input type="text" className="form-control form-control-sm" id="cc" name="cc" placeholder="CC" 
                                                                                        value={state.cc} onChange={onChangeHandle}/>*/}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>BCC: <span>email with comma seperated</span></label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                               <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                            </div>
                                             <AutocompleteMulti options={bccs} placeholder={'Type'} text={true} fn={onChangeBCCHandle} />
                                            {/*<input type="text" className="form-control form-control-sm" id="bcc" name="bcc" placeholder="CC" 
                                                                                        value={state.bcc} onChange={onChangeHandle}/>*/}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Subject</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-calendar"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control form-control-sm" id="subject" name="subject" placeholder="Name" 
                                            value={state.subject} onChange={onChangeHandle}/>
                                        </div>
                                        {simpleValidator.current.message('subject', state.subject, 'required')}
                                    </div>

                                    <div className="form-group">
                                        <label>Message</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-gradient-success text-white">
                                                    <i className="mdi mdi-circle-edit-outline"></i>
                                                </span>
                                            </div>
                                            <textarea  name="message" placeholder="Notes"
                                        onChange={onChangeHandle}
                                        value={state.message}
                                        className="form-control form-control-sm"></textarea>
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