require('../app');
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import LeadList from '../components/SznList/LeadList'
import NewLead from '../components/SznList/NewLead'
import EditLead from '../components/SznList/EditLead'
import '../variables'
import {createStore} from 'redux';
import rootReducer from '../redux/reducers/index'
import { Provider, useDispatch, useSelector } from 'react-redux'
import rootAction from '../redux/actions/index'

//create reducer
const myStore = createStore(
	rootReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);



function App() {
	//set reducer
	const myDispatch = useDispatch();
	myDispatch(rootAction.setAuthUser(authUser)); //authUser is from blade file

	//get reducer
    const activeComponent = useSelector(state => state.activeComponentReducer);
	
	return (
		<React.Fragment>
			<BrowserRouter>
			<div className="page-header">
				<h3 className="page-title">
					<span className="page-title-icon bg-gradient-primary text-white mr-2">
						<i className="mdi mdi-settings"></i>
					</span>Set Up
				</h3>
				
			</div>
			<div className="row">
				<div className="col-lg-12 stretch-card">
						<div className="form-group text-center">
						 <a className="btn btn-gradient-primary btn-md mr-2" href="/roles">Roles</a>
						 <a className="btn btn-gradient-primary btn-md mr-2" href="/users">Users</a>
						</div>
				</div>

				<div className="col-lg-12 stretch-card">
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/properties">Properties</a>
					</div>
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/order-statuses">Order Statuses</a>
					</div>
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/priorities">Priorities</a>
					</div>
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/document-types">Document Types</a>
					</div>
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/order-types">Order Types</a>
					</div>
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/asset-works">Asset Works</a>
					</div>
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/asset-types">Asset Types</a>
					</div>
				</div>

				<div className="col-lg-12 stretch-card">
					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/areas">Areas</a>
					</div>

					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/contractors">Contractors</a>
					</div>

					<div className="form-group text-center">
					 <a className="btn btn-gradient-primary btn-md mr-2" href="/vendors">Vendors</a>
					</div>
				</div>
			</div>
			</BrowserRouter>
		</React.Fragment>
	);
}

ReactDOM.render(
	<Provider store={myStore}>
		<App />
	</Provider>
, document.getElementById('app'))