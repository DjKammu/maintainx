import React, { useState } from 'react'

function TopControl(props) {
        
    return (
        <React.Fragment>
            <div className="pt-3 pb-3">
                <div className="d-flex flex-column flex-md-row justify-content-md-between">
                    <div className="d-flex flex-row">
                        <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Display</span>
                                </div>
                                <select className="form-control form-control-sm btn btn-primary" disabled={props.isLoading ? true : false} defaultValue={props.perPage} onChange={props.onChangePerPageHandle}>
                                    <option value="10">10</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="500">500</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Sort By</span>
                                </div>
                                <select className="form-control form-control-sm btn btn-success" disabled={props.isLoading ? true : false} defaultValue={props.sortBy} onChange={props.onChangeSortByHandle}>
                                    <option value="created_at">Created</option>
                                    <option value="payment">Payment</option>
                                </select>
                                <div className="input-group-append">
                                    <button disabled={props.isLoading ? true : false} className="bg-light btn btn-sm text-success" type="button" onClick={props.onClickSortTypeHandle}>
                                        { props.sortType == 'asc' ?  <i className="mdi mdi-arrow-down"></i> : <i className="mdi mdi-arrow-up"></i>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Tenant</span>
                                </div>
                               
                                <select className="form-control form-control-sm btn btn-success"
                                defaultValue={props.tenant}
                                onChange={props.onChangeTenantHandle}>
                                <option value=""> Select </option>
                                
                                     {props.tenants.map(({ value, label }, index) => <option key={value} value={value} >{label}</option>)}
                                
                                </select>
                            </div>
                        </div>

                         <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Work Type</span>
                                </div>
                               
                                <select className="form-control form-control-sm btn btn-success"
                                defaultValue={props.workType}
                                onChange={props.onChangeWorkTypeHandle}>
                                <option value=""> Select </option>
                                
                                     {props.workTypes.map(({ value, label }, index) => <option key={value} value={value} >{label}</option>)}
                                
                                </select>
                            </div>
                        </div>
                    </div>
                    </div>

           <div className="d-flex flex-column flex-md-row justify-content-md-between">
                   <div className="d-flex flex-row">
                        <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Property Type</span>
                                </div>
                                {props.propertyTypes.length > 0 &&
                                <select className="form-control form-control-sm btn btn-success"
                                defaultValue={props.propertyType}
                                onChange={props.onChangePropertyTypeHandle}>
                                <option value=""> Select </option>
                                 {props.propertyTypes.map(({ value, label }, index) => <option key={value} value={value} >{label}</option>)}
                                </select>
                               }
                            </div>
                        </div>

                        <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Property</span>
                                </div>
                               
                                <select className="form-control form-control-sm btn btn-success"
                                defaultValue={props.property}
                                onChange={props.onChangePropertyHandle}>
                                <option value=""> Select </option>
                                
                                     {props.properties.map(({ value, label }, index) => <option key={value} value={value} >{label}</option>)}
                                
                                </select>
                            </div>
                        </div>

                         <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Area</span>
                                </div>
                               
                                <select className="form-control form-control-sm btn btn-success"
                                defaultValue={props.area}
                                onChange={props.onChangeAreaHandle}>
                                <option value=""> Select </option>
                                
                                     {props.areas.map(({ value, label }, index) => <option key={value} value={value} >{label}</option>)}
                                
                                </select>
                            </div>
                        </div>

                        <div className="p-2">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Sub Area</span>
                                </div>
                               
                                <select className="form-control form-control-sm btn btn-success"
                                defaultValue={props.subArea}
                                onChange={props.onChangeSubAreaHandle}>
                                <option value=""> Select </option>
                                
                                     {props.subAreas.map(({ value, label }, index) => <option key={value} value={value} >{label}</option>)}
                                
                                </select>
                            </div>
                        </div>
                         <div className="p-2">
                            <div className="input-group input-group-sm">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> All / Trashed </span>
                            </div>
                                <div className="input-group-append">
                                <button className="btn btn-sm btn-gradient-primary" onClick={props.onClickTrashed} type="button">
                                {props.isTrashed ? 'All' :  'Trashed' } 
                                </button>
                                </div>
                          </div>
                     </div>
                    </div>
                </div>
                    <form className="p-2 col-md-4" onSubmit={props.onSubmitQueryHandle}>
                        <div className="input-group">
                            <input type="search" className="form-control form-control-sm" placeholder="Search Here" value={props.query} onChange={props.onChangeQueryHandle}/>
                            <div className="input-group-append">
                                <button className="btn btn-sm btn-gradient-primary" disabled={props.isLoading ? true : false} type="submit">Search</button>
                            </div>
                        </div>
                    </form>
            </div>
        </React.Fragment>
    );
}

export default TopControl