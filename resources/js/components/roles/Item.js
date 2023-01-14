import React, { Component } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <React.Fragment>
                <div className="szn-portlet">
                    <div className="szn-portlet__body">
                        <div className="szn-widget szn-widget--user-profile-3">
                            <div className="szn-widget__top">
                              <div className="szn-widget__content">
                                    <div className="szn-widget__head">
                                        <Link to={{
                                            pathname: `/roles/${this.props.obj.id}`,
                                            state: {
                                                lead: this.props.obj
                                            }
                                        }} className="szn-widget__username">
                                            {this.props.obj.name}
                                            { this.props.obj.status == 0 ? <i className="mdi mdi-close-circle-outline szn-font-danger"></i> 
                                            : <i className="mdi mdi-checkbox-marked-circle szn-font-success"></i> }
                                        </Link>
                                        <div className="szn-widget__action">
                                            <Link to={{
                                                pathname: `/roles/${this.props.obj.id}`,
                                                state: {
                                                    lead: this.props.obj
                                                }
                                            }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
                                            <button type="button" className="btn btn-danger btn-sm btn-upper" onClick={() => this.props.onClickDeleteHandler(this.props.obj.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Item