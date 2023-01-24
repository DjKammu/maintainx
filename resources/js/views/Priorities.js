require('../app');
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import List from '../components/priorities/List'
import New from '../components/priorities/New'
import Edit from '../components/priorities/Edit'
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
						{ activeComponent && activeComponent == 'List' ?  
						<i className="mdi mdi-account-multiple"></i> : (activeComponent && activeComponent == 'New' ? <i className="mdi mdi-account-plus"></i> : 
						(activeComponent && activeComponent == 'Edit' ? <i className="mdi mdi-folder-account"></i> : '' ) )
					}
					</span>
				 	{ activeComponent && activeComponent == 'List' ?  
						'All Priorities' : (activeComponent && activeComponent == 'New' ? 'New Priority' : 
						(activeComponent && activeComponent == 'Edit' ? 'Edit Order Status' : '' ) )
					}
				</h3>
				<nav aria-label="breadcrumb">
					{ activeComponent && activeComponent != 'List' ?  
						<Link to='/priorities' className="btn btn-social-icon-text btn-linkedin"><i className="mdi mdi-arrow-left-bold btn-icon-prepend"></i>&nbsp; Back</Link> : <Link to='/priorities/create' className="btn btn-social-icon-text btn-linkedin"><i className="mdi mdi-account-plus btn-icon-prepend"></i>&nbsp; New</Link>
					}
				</nav>
				
			</div>
			<div className="row">
				<div className="col-lg-12 grid-margin stretch-card">
						   <Switch>
							<Route exact path='/priorities'  > <List /> </Route>
							<Route path='/priorities/create' > <New /> </Route>
							<Route path='/priorities/:id' component={Edit} /> 
						</Switch>

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