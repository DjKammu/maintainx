@section('title')
Sub Areas
@endsection

@section('styles')
<link rel="stylesheet" href="{{ asset('css/Leads.css') }}">
<style>
    
</style>
@endsection

@extends('layout.master')

@section('container')
<div id="app"></div>
@endsection

@section('scripts')
<script>
    var authUser = @json(Auth::user());
</script>

<script src="{{ asset('js/views/SubAreas.js') }}"></script>
@endsection