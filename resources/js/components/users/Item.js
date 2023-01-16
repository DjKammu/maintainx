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
                            { true ? 
                                <div className="szn-widget__media szn-hidden-">
                                    <img src="/assets/images/faces/face1.jpg" alt="image" />
                                </div> :
                                <div
                                    className="szn-widget__pic szn-widget__pic--danger szn-font-danger szn-font-boldest szn-font-light ">
                                    {this.props.obj.name.split(' ').map(function(str) { return str ? str[0].toUpperCase() : "";}).join('')}
                                </div> }

                              <div className="szn-widget__content">
                                    <div className="szn-widget__head">
                                        <Link to={{
                                            pathname: `/users/${this.props.obj.id}`,
                                            state:  this.props.obj
                                        }} className="szn-widget__username">
                                            {this.props.obj.name}
                                            { this.props.obj.status == 0 ? <i className="mdi mdi-close-circle-outline szn-font-danger"></i> 
                                            : <i className="mdi mdi-checkbox-marked-circle szn-font-success"></i> }
                                        </Link>
                                        <div className="szn-widget__action">
                                            <Link to={{
                                                pathname: `/users/${this.props.obj.id}`,
                                                state: this.props.obj
                                               
                                            }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
                                            <button type="button" className="btn btn-danger btn-sm btn-upper" onClick={() => this.props.onClickDeleteHandler(this.props.obj.id)}>Delete</button>
                                        </div>

                                    </div>
                                    <div className="szn-widget__subhead d-flex flex-column flex-md-row">
                                        <a href={void(0)}><i className="mdi mdi-email"></i>{this.props.obj.email}</a>
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