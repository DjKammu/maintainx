import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import rootAction from '../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function New(props) {

    const [isLoading, setIsLoading] = useState(true);

    const onClickRestoreHandler = (id) => {

        confirmAlert({
            title: 'Confirm to restore',
            message: 'Are you sure to do this.',
            buttons: [
                {
                label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        var formData = new FormData();
                        formData.append('id', props.id);

                        let URL = props.url+'/restore';
                        axios.post(
                          URL,formData,{
                          params: {
                               api_token: authUser.api_token
                          }
                        }).then(response => {
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
                                props.fn();
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
                },
                {
                label: 'No',
                    //do nothing
                }
            ]
        });
    };


    return (
        <React.Fragment>
                  <button type="button"
                      onClick={onClickRestoreHandler}
                      className="btn btn-danger btn-sm btn-upper">
                      Restore
                    </button>
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