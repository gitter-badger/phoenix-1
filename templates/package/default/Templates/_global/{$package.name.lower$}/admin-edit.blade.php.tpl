{{-- Part of phoenix project. --}}

@extends('_global.{$package.name.lower$}.admin')

@section('admin-area')
    <div class="col-md-12">

        @section('message')
            {!! \Windwalker\Core\Widget\WidgetHelper::render('windwalker.message.default', array('flashes' => $flashes)) !!}
        @show

        @yield('admin-body', 'Body')
    </div>
@stop
