import React, {  useState, useEffect } from 'react'
import Item from './Item'
import Pagination from "react-js-pagination";
import { useSelector, connect } from 'react-redux';
import rootAction from '../../redux/actions/index'
import ContentLoader from "react-content-loader" 
import { fadeIn } from 'animate.css'
import { showSznNotification} from '../../Helpers'
import TopControl from './TopControl'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DeleteWithForm from "../../models/DeleteWithForm";
import RestoreForm from "../../models/RestoreForm";

function List(props) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrashed, setIsTrashed] = useState(false); 

    const [propertyTypes, setPropertyTypes] = useState([]);
    const [properties, setProperties] = useState([]);
    
    const [state, setState] = useState({
       pageRangeDisplayed: 5,
       currentPage: 1, 
       total: 0,
       lastPageUrl: null,
       nextPageUrl: null,
       firstPageUrl: null,
       prevPageUrl: null,
       perPage: 10,
       query: '',
       sortBy: 'created_at',
       sortType: 'desc',
       resetCurrentPage: false,
       propertyType:'',
       property:'',
    });

    //get reducer
    const authUser = useSelector(state => state.authUserReducer);

    //get authUser/reducer alternative
    //const authUser = props.authUserProp;
    
    useEffect(() => {
        document.title = 'All Tenants';
        props.setActiveComponentProp('List');
        loadPropertyTypes();
    }, []);

    useEffect(() => {
        loadData();
        if (state.propertyType && (state.property == '')) {
           loadProperty();
        }

    }, [state.currentPage, state.resetCurrentPage, state.perPage, state.sortBy, state.sortType,state.propertyType,
    state.property,isTrashed]);

    // useEffect(() => {
    //     { state.propertyType && 
    //             loadProperty();
    //         }
    // }, [state.propertyType]);
    
    const skeletonLoader = () => {
        return <div className="content-loader-wrapper">
                    <ContentLoader 
                        speed={2}
                        viewBox="0 0 945 500"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#dad8d8"
                    >
                        <rect x="33" y="36" rx="0" ry="0" width="92" height="90" /> 
                        <rect x="144" y="41" rx="0" ry="0" width="196" height="15" /> 
                        <rect x="144" y="69" rx="0" ry="0" width="353" height="12" /> 
                        <rect x="143" y="92" rx="0" ry="0" width="399" height="18" /> 
                        <rect x="143" y="116" rx="0" ry="0" width="51" height="14" /> 
                        <rect x="205" y="118" rx="0" ry="0" width="298" height="12" /> 
                        <rect x="517" y="116" rx="0" ry="0" width="26" height="15" /> 
                        <rect x="0" y="10" rx="0" ry="0" width="13" height="487" /> 
                        <rect x="-29" y="2" rx="0" ry="0" width="1001" height="11" /> 
                        <rect x="930" y="7" rx="0" ry="0" width="66" height="490" /> 
                        <rect x="6" y="358" rx="0" ry="0" width="2" height="15" /> 
                        <rect x="5" y="484" rx="0" ry="0" width="935" height="13" /> 
                        <rect x="797" y="32" rx="0" ry="0" width="44" height="28" /> 
                        <rect x="854" y="32" rx="0" ry="0" width="56" height="28" /> 
                        <rect x="43" y="186" rx="0" ry="0" width="100" height="47" /> 
                        <rect x="255" y="186" rx="0" ry="0" width="100" height="47" /> 
                        <rect x="476" y="185" rx="0" ry="0" width="100" height="47" /> 
                        <rect x="693" y="184" rx="0" ry="0" width="100" height="47" /> 
                        <rect x="7" y="242" rx="0" ry="0" width="952" height="17" /> 
                        <rect x="33" y="281" rx="0" ry="0" width="92" height="90" /> 
                        <rect x="144" y="286" rx="0" ry="0" width="196" height="15" /> 
                        <rect x="144" y="314" rx="0" ry="0" width="353" height="12" /> 
                        <rect x="143" y="337" rx="0" ry="0" width="399" height="18" /> 
                        <rect x="143" y="361" rx="0" ry="0" width="51" height="14" /> 
                        <rect x="205" y="363" rx="0" ry="0" width="298" height="12" /> 
                        <rect x="517" y="361" rx="0" ry="0" width="26" height="15" /> 
                        <rect x="797" y="277" rx="0" ry="0" width="44" height="28" /> 
                        <rect x="854" y="277" rx="0" ry="0" width="56" height="29" /> 
                        <rect x="43" y="431" rx="0" ry="0" width="100" height="47" /> 
                        <rect x="255" y="431" rx="0" ry="0" width="100" height="47" /> 
                        <rect x="476" y="430" rx="0" ry="0" width="100" height="47" /> 
                        <rect x="693" y="429" rx="0" ry="0" width="100" height="47" />
                    </ContentLoader>
                </div>
    };
      
       const emptyProperties = () => {
            setProperties([]);
            setState({
                ...state,
                property: ''
            });
       }
       const loadPropertyTypes = () => {
            emptyProperties();
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
                    message : error.response.data.message
                });
            });
    };

    const loadData = () => {
        setIsLoading(true);
        let trashUrl = (isTrashed) ? '/trashed' : '';
        axios.get('/api/v1/tenants'+trashUrl+'?page='+state.currentPage, {
            params: {
                api_token: authUser.api_token,
                per_page: state.perPage,
                query: state.query,
                sort_by: state.sortBy,
                sort_type: state.sortType,
                property_type: state.propertyType,
                property: state.property,
            }
        })
        .then(response => {
            setIsLoading(false);
            setData(response.data.message.data);
            setState({
                ...state,
                currentPage: response.data.message.current_page,
                firstPageUrl: response.data.message.first_page_url,
                lastPageUrl: response.data.message.last_page_url,
                nextPageUrl: response.data.message.next_page_url,
                prevPageUrl: response.data.message.prev_page_url,
                perPage: parseInt(response.data.message.per_page),
                total: response.data.message.total,
            })
        })
        .catch((error) => {
            showSznNotification({
                type : 'error',
                message : error.response.data.message
            });
        });
    };

    const handlePageChange = (pageNumber) => {
        setState({
            ...state,
            currentPage: pageNumber 
        });
    }

     const onClickTrashed = (e) => {
        setIsTrashed(!isTrashed);
    };

    const onChangeQueryHandle = (e) => {
        setState({
            ...state,
            query: e.target.value
        });
    };

    const onChangePerPageHandle = (e) => {
        setState({
            ...state,
            perPage: parseInt(e.target.value)
        });
    };

    const onChangeSortByHandle = (e) => {
        setState({
            ...state,
            sortBy: e.target.value
        });
    }; 

    const onChangePropertyTypeHandle  = (e) => {
            setState({
                ...state,
                property: '',
                propertyType: e.target.value
            });     
    }

     const loadProperty  = (e) => {
        emptyProperties();
        // setAreas([]);
        // setSelectedAreaOption([]);
        // setSubAreas([]);
        // setSelectedSubAreaOption([]);

        setIsLoading(true);

         axios.get('/api/v1/payments/property',{
            params: {
                api_token: authUser.api_token,
                property_type :state.propertyType
             }
            })
          .then(response => {
            setIsLoading(false);
            setProperties(response.data.message.property)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });
    }; 

    const onChangePropertyHandle  = (e) => {
        setState({
            ...state,
            property: e.target.value
        });
    };


    const onClickSortTypeHandle = (e) => {
        if (state.sortType == 'asc') {
            setState({
                ...state,
                sortType: 'desc'
            });
        } else {
            setState({
                ...state,
                sortType: 'asc'
            });
        }
    };
    
    const onSubmitQueryHandle = (e) => {
        e.preventDefault();
        setState({
            ...state,
            currentPage: 1,
            resetCurrentPage: !state.resetCurrentPage 
        });
    };

    const dataTable = () => {
        return isLoading ? skeletonLoader() : 
        (data.length == 0 ? <div className="text-center text-gray">
                                <div className="p-3 font-weight-bold">No Data Available</div>
                            </div> : 
                            <table className="table-fixed w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    
                                    <th className="px-4 py-2">Name
                                    </th> 
                                    <th className="px-4 py-2">Active
                                    </th>
                                    <th className="px-4 py-2">Account Number</th>
                                    <th className="px-4 py-2">Property Type</th>
                                    <th className="px-4 py-2">Property</th>
                           <th className="px-4 py-2">Area </th>
                           <th className="px-4 py-2">Sub Area </th>

                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead> <tbody>{
                                   data.map((dt, i) => {
                                    return  <Item 
                                    loadData={loadData} 
                                    action={ isTrashed ? RestoreForm : DeleteWithForm } 
                                    obj={dt} key={i} />;
                                })  
                            } </tbody>
                           </table>);
    }

    return (
        <React.Fragment>
            <div className="card animated fadeIn">
                <div className="card-body">
                    <TopControl 
                        isLoading={isLoading}
                        isTrashed={isTrashed} 
                        perPage={state.perPage} 
                        onChangePerPageHandle={onChangePerPageHandle}
                        propertyType={state.propertyType} 
                        propertyTypes={propertyTypes} 
                        onChangePropertyTypeHandle={onChangePropertyTypeHandle}
                        property={state.property} 
                        properties={properties} 
                        onChangePropertyHandle={onChangePropertyHandle}
                        sortBy={state.sortBy}
                        sortType={state.sortType}
                        onChangeSortByHandle={onChangeSortByHandle}
                        onClickSortTypeHandle={onClickSortTypeHandle}
                        onClickTrashed={onClickTrashed}
                        onSubmitQueryHandle={onSubmitQueryHandle}
                        onChangeQueryHandle={onChangeQueryHandle}
                        query={state.query}
                    />
                    <div className='szn-list-wrapper bg-gradient-light'>
                            {dataTable()}
                    </div>
                    <div className="pt-3 pb-3">
                        <div className="">
                            <div className="d-flex justify-content-center">
                                <div className="p-2">
                                    <Pagination
                                        activePage={state.currentPage}
                                        itemsCountPerPage={state.perPage}
                                        itemClass={isLoading ? 'page-item disabled' : 'page-item'}
                                        linkClass={isLoading ? 'page-link disabled' : 'page-link'}
                                        totalItemsCount={state.total}
                                        pageRangeDisplayed={state.pageRangeDisplayed}
                                        onChange={isLoading ?  (e) => {e.preventDefault();} : handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


//redux state can be accessed as props in this component(Optional)
const mapStateToProps = (state) => {
	return {
		authUserProp: state.authUserReducer,
		activeComponentProp: state.activeComponentReducer,
	}
}

/**
 * redux state can be change by calling 'props.setAuthUserProp('demo user');' when 
 * applicable(Optional to )
 * 
 */
const mapDispatchToProps = (dispatch) => {
    return {
        setAuthUserProp: (user) => dispatch(rootAction.setAuthUser(user)),
        setActiveComponentProp: (component) => dispatch(rootAction.setActiveComponent(component))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(List)