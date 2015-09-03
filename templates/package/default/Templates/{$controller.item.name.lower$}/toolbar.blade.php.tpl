{{-- Part of phoenix project. --}}

<button type="button" class="btn btn-success btn-sm" onclick="Phoenix.post();">
    <span class="glyphicon glyphicon-floppy-disk"></span>
    @translate('phoenix.toolbar.save')
</button>

<button type="button" class="btn btn-default btn-sm" onclick="Phoenix.post(null, {task: 'save2close'});">
    <span class="glyphicon glyphicon-ok text-success"></span>
    @translate('phoenix.toolbar.save2close')
</button>

<button type="button" class="btn btn-default btn-sm" onclick="Phoenix.post(null, {task: 'save2copy'});">
    <span class="glyphicon glyphicon-duplicate text-info"></span>
    @translate('phoenix.toolbar.save2copy')
</button>

<button type="button" class="btn btn-default btn-sm" onclick="Phoenix.post(null, {task: 'save2new'});">
    <span class="glyphicon glyphicon-plus text-primary"></span>
    @translate('phoenix.toolbar.save2new')
</button>

<a type="button" class="btn btn-default btn-sm" href="{{ $router->html('{$controller.list.name.lower$}') }}">
    <span class="glyphicon glyphicon-remove text-danger"></span>
    @translate('phoenix.toolbar.cancel')
</a>
