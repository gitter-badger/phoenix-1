<?php
/**
 * Part of phoenix project. 
 *
 * @copyright  Copyright (C) 2015 {ORGANIZATION}. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace {$package.namespace$}{$package.name.cap$}\View\{$controller.list.name.cap$};

use Phoenix\Script\BootstrapScript;
use Phoenix\Script\PhoenixScript;
use Phoenix\View\GridView;

/**
 * The {$controller.list.name.cap$}HtmlView class.
 * 
 * @since  {DEPLOY_VERSION}
 */
class {$controller.list.name.cap$}HtmlView extends GridView
{
	/**
	 * Property name.
	 *
	 * @var  string
	 */
	protected $name = '{$controller.list.name.lower$}';

	/**
	 * The fields mapper.
	 *
	 * @var  array
	 */
	protected $fields = array(
		'pk'          => 'id',
		'title'       => 'title',
		'alias'       => 'alias',
		'state'       => 'state',
		'ordering'    => 'ordering',
		'author'      => 'created_by',
		'author_name' => 'user_name',
		'created'     => 'created',
		'language'    => 'language',
		'lang_title'  => 'lang_title'
	);

	/**
	 * The grid config.
	 *
	 * @var  array
	 */
	protected $gridConfig = array(
		'order_column' => '{$controller.item.name.lower$}.ordering'
	);

	/**
	 * prepareData
	 *
	 * @param \Windwalker\Data\Data $data
	 *
	 * @return  void
	 */
	protected function prepareData($data)
	{
		$this->prepareScripts();
	}

	/**
	 * prepareDocument
	 *
	 * @return  void
	 */
	protected function prepareScripts()
	{
		PhoenixScript::core();
		PhoenixScript::grid();
		PhoenixScript::chosen();
		PhoenixScript::multiSelect('#admin-form table', array('duration' => 100));
		BootstrapScript::checkbox(BootstrapScript::GLYPHICONS);
		BootstrapScript::tooltip();
	}

	/**
	 * setTitle
	 *
	 * @param string $title
	 *
	 * @return  static
	 */
	public function setTitle($title = null)
	{
		return parent::setTitle($title);
	}
}
