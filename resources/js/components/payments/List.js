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
import { Link } from "react-router-dom";
import Mail from './Mail';

function List(props) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [properties, setProperties] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setsubAreas] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [isTrashed, setIsTrashed] = useState(false); 


    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

  
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
       area:'',
       subArea:'',
       tenant:'',
       workType:'',
       grandTotal : 0
    });

    //get reducer
    const authUser = useSelector(state => state.authUserReducer);

    //get authUser/reducer alternative
    //const authUser = props.authUserProp;
    
    useEffect(() => {
        document.title = 'All Payments';
        props.setActiveComponentProp('List');
        loadPropertyTypes();
        loadAttributes();
    }, []);

    useEffect(() => {
         loadData();

         if ((state.propertyType  == '' && (state.property == '') ) ||  (state.propertyType && (state.property == '') )) {
          // loadProperty();
       // } 
        //if (state.propertyType && (state.property == '')) {
           loadProperty();
           // console.log('property');
        }
        if (/*state.propertyType && */state.property && (state.area == '')) {
           loadArea();
           // console.log('areaa');
        }
        if (/*state.propertyType &&*/ state.property && state.area && (state.subArea == '')) {
           loadSubArea();
           // console.log('subarea');
        }
    }, [state.currentPage, state.resetCurrentPage, state.perPage, state.sortBy, state.sortType,state.propertyType,
    state.property,state.area, state.subArea,state.tenant, state.workType,isTrashed]);

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

       const emptyAreas = () => {
            setAreas([]);
            setState({
                ...state,
                area: ''
            });
       }

       const emptySubAreas = () => {
            setsubAreas([]);
            setState({
                ...state,
                subArea: ''
            });
       }

       const loadAttributes = () => {
          setIsLoading(true);
          axios.get('/api/v1/payments/attributes',{
              params: {
                  api_token: authUser.api_token
              }
          })
          .then(response => {
               setIsLoading(false); 
               setTenants(response.data.message.allTenants)  
               setWorkTypes(response.data.message.workTypes)  
          })
          .catch((error) => {
              showSznNotification({
                  type : 'error',
                  message : 'Error! '
              });
          });
      };  

       const loadPropertyTypes = () => {
            emptyProperties();
            emptyAreas();
            emptySubAreas();
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


     const loadProperty  = (e) => {
        emptyProperties();
        emptyAreas();
        emptySubAreas();
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

    const loadArea  = (e) => {
        emptyAreas();
        emptySubAreas();
        setIsLoading(true);
         axios.get('/api/v1/payments/area',{
            params: {
                api_token: authUser.api_token,
                property :state.property
             }
            })
          .then(response => {
            setIsLoading(false);
            setAreas(response.data.message.area)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });
    
    };   

     const loadSubArea  = (e) => {
        emptySubAreas();
        setIsLoading(true);

         axios.get('/api/v1/payments/sub-area',{
            params: {
                api_token: authUser.api_token,
                area : state.area
             }
            })
          .then(response => {
            setIsLoading(false);
            setsubAreas(response.data.message.sub_area)
          })
          .catch(error => {
                 showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
          });

    }; 

    const onChangePropertyHandle  = (e) => {
        let value = !e.target ? (e.id ? e.id : e ) : e.target.value
        setState({
            ...state,
            property: value
        });
    };

    const onChangeAreaHandle  = (e) => {
        let value = !e.target ? (e.id ? e.id : e ) : e.target.value
        setState({
            ...state,
            area: value
        });
    };
     const onChangeSubAreaHandle  = (e) => {
        let value = !e.target ? (e.id ? e.id : e ) : e.target.value
        setState({
            ...state,
            subArea: value
        });
    };
    const onChangeTenantHandle  = (e) => {
        let value = !e.target ? (e.id ? e.id : e ) : e.target.value
        setState({
            ...state,
            tenant: value
        });
    };
    const onChangeWorkTypeHandle  = (e) => {
        let value = !e.target ? (e.id ? e.id : e ) : e.target.value
        setState({
            ...state,
            workType: value
        });
    };

    const loadData = () => {
        setIsLoading(true);
        let trashUrl = (isTrashed) ? '/trashed' : '';
        axios.get('/api/v1/payments'+trashUrl+'?page='+state.currentPage, {
            params: {
                api_token: authUser.api_token,
                per_page: state.perPage,
                query: state.query,
                sort_by: state.sortBy,
                sort_type: state.sortType,
                property_type: state.propertyType,
                property: state.property,
                area: state.area,
                sub_area: state.subArea,
                tenant: state.tenant,
                work_type: state.workType,
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
                grandTotal: response.data.grandTotal,
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
     
    const onChangePropertyTypeHandle  = (e) => {
            let value = !e.target ? (e.id ? e.id : e ) : e.target.value
            setState({
                ...state,
                property: '',
                propertyType: value
            });     
    }

    const handlePageChange = (pageNumber) => {
        setState({
            ...state,
            currentPage: pageNumber 
        });
    }

    const onChangeQueryHandle = (e) => {
        setState({
            ...state,
            query: e.target.value
        });
    };

    const onClickTrashed = (e) => {
        setIsTrashed(!isTrashed);
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

    const onClickDeleteHandler = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/payments/destroy', {
                            api_token: authUser.api_token,
                            id: id
                        })
                        .then(response => {
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
                                loadData();
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
                           <table className="responsive-table w-full">
                           <thead><tr className="bg-gray-100">
                           <th className="px-4 py-2">Asset Type</th>
                           <th className="px-4 py-2">Asset Name</th>
                           <th className="px-4 py-2">Property</th>
                           <th className="px-4 py-2">Area </th>
                           <th className="px-4 py-2">Sub Area </th>
                           <th className="px-4 py-2">Vendor  </th>
                           <th className="px-4 py-2">Contractor </th>
                           <th className="px-4 py-2">Tenant </th>
                           <th className="px-4 py-2">Work Type </th>
                           <th className="px-4 py-2">Payment </th>
                           <th className="px-4 py-2">Payment Date </th>
                           <th className="px-4 py-2"> <img className="ext-img-sm" src={`/public/images/paper.png`} /> </th>
                           <th className="px-4 py-2">Action</th>
                           </tr></thead><tbody>
                           { data.map((dt, i) => { return <Item 
                            isTrashed={isTrashed}
                            loadData={loadData} 
                            action={ isTrashed ? RestoreForm : onClickDeleteHandler }  
                            obj={dt} key={i} />; }) }
                           </tbody></table>);
    }
    return (
        <React.Fragment>

        
            <div className="card animated fadeIn">
                <div className="card-body">
                <div className="pt-4 float-right">
                   <div className="">
                        <a
                          className="btn btn-gradient-primary mr-3"
                          href={`/api/v1/payments/download?page=${state.currentPage}&api_token=${authUser.api_token}&per_page=${state.perPage}&query=${state.query}&sort_by=${state.sortBy}&sort_type=${state.sortType}&property_type=${state.propertyType}&property=${state.property}&area=${state.area}&sub_area=${state.subArea}&tenant=${state.tenant}&work_type=${state.workType}
                       `} >
                         Download
                        </a>
                      <Mail params= {{
                                query: state.query,
                                sort_by: state.sortBy,
                                sort_type: state.sortType,
                                property_type: state.propertyType,
                                property: state.property,
                                area: state.area,
                                sub_area: state.subArea,
                                tenant: state.tenant,
                                work_type: state.workType,
                            }}
                        />
                      </div>
                  </div>  
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
                        area={state.area} 
                        areas={areas} 
                        onChangeAreaHandle={onChangeAreaHandle}
                        subArea={state.subArea} 
                        subAreas={subAreas} 
                        onChangeSubAreaHandle={onChangeSubAreaHandle}
                        tenant={state.tenant} 
                        tenants={tenants} 
                        onChangeTenantHandle={onChangeTenantHandle}
                        workType={state.workType} 
                        workTypes={workTypes} 
                        onChangeWorkTypeHandle={onChangeWorkTypeHandle}
                        sortBy={state.sortBy}
                        sortType={state.sortType}
                        onChangeSortByHandle={onChangeSortByHandle}
                        onClickSortTypeHandle={onClickSortTypeHandle}
                        onSubmitQueryHandle={onSubmitQueryHandle}
                        onChangeQueryHandle={onChangeQueryHandle}
                        onClickTrashed={onClickTrashed}
                        options={state.options}
                        authUser={authUser}
                        query={state.query}
                    />
                    <div className='szn-list-wrapper bg-gradient-light table-outer'>
                            {dataTable()}
                    </div>
                    <div className="pt-3 pb-3">
                        <div className="">
                        <div className="float-right">
                              <b>  Total :  ${state.grandTotal} </b>
                        </div>
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