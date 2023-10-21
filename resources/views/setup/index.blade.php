@section('title')
Set Up
@endsection

@section('styles')
<link rel="stylesheet" href="{{ asset('css/Leads.css') }}">
<style>
    
</style>
@endsection

@extends('layout.master')

@section('container')
  <div class="page-header">
    <h3 class="page-title">
      <span class="page-title-icon bg-gradient-primary text-white mr-2">
        <i class="mdi mdi-settings"></i>
      </span>Set Up
    </h3>
  </div>
  <div class="row">
    <div class="col-lg-12 stretch-card">
      <div class="form-group text-center">
      	
       @can('add_users')
        <a class="btn btn-gradient-primary btn-md mr-2" href="/roles">Roles</a>
        @endcan
       @can('add_users')
        <a class="btn btn-gradient-primary btn-md mr-2" href="/users">Users</a>
        @endcan
      </div>
    </div>
    <div class="col-lg-12 stretch-card">
    	 
       @can('administrator') 
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/order-statuses">Order Statuses</a>
      </div>
      @endcan
       @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/priorities">Priorities</a>
      </div>
      @endcan
       @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/document-types">Document Types</a>
      </div>
      @endcan
       @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/order-types">Order Types</a>
      </div>
      @endcan
       @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/asset-works">Asset Works</a>
      </div>
      @endcan
       @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/asset-types">Asset Types</a>
      </div>
      @endcan
      @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/work-types">Work Types</a>
      </div>
      @endcan
    </div>
    <div class="col-lg-12 stretch-card">
       @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/property-types">Property Types</a>
      </div>
      @endcan
      @can('view')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/properties">Properties</a>
      </div>
       @endcan

       @can('view')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/areas">Areas</a>
      </div>
      @endcan
       @can('view')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/sub-areas">Sub Areas</a>
      </div>
      @endcan
     
       @can('view')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/asset-model">Assets</a>
      </div>
      @endcan
       @can('view')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/tenants"> Tenants</a>
      </div>
      @endcan

      @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/contractors">Contractors</a>
      </div>
      @endcan
       @can('administrator')
      <div class="form-group text-center">
        <a class="btn btn-gradient-primary btn-md mr-2" href="/vendors">Vendors</a>
      </div>
      @endcan
    
    </div>
  </div>
@endsection