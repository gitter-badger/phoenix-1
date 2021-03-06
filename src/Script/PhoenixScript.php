<?php
/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2015 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace Phoenix\Script;

use Windwalker\Core\Language\Translator;
use Windwalker\Ioc;
use Windwalker\Language\Language;
use Windwalker\Registry\Format\JsonFormat;

/**
 * The PhoenixScript class.
 *
 * @see  \Phoenix\Script\ScriptManager
 * @see  \Phoenix\Script\Module\ModuleManager
 *
 * @since  1.0
 */
class PhoenixScript extends ScriptManager
{
	/**
	 * core
	 *
	 * @param string $formSelector
	 * @param string $variable
	 * @param array  $options
	 *
	 * @return void
	 */
	public static function core($formSelector = '#admin-form', $variable = 'Phoenix', $options = array())
	{
		$asset = static::getAsset();

		if (!static::inited(__METHOD__))
		{
			JQueryScript::core();

			$asset->addScript(static::phoenixName() . '/js/phoenix/phoenix.js');
		}

		if (!static::inited(__METHOD__, func_get_args()))
		{
			$defaultOptions = array(
				'theme' => 'bootstrap'
			);

			$options = array_merge($defaultOptions, $options);

			if ($options['theme'] == 'bootstrap')
			{
				$asset->addScript(static::phoenixName() . '/js/phoenix/theme/bootstrap.js');
			}

			$options = json_encode((object) $options);

			$js = <<<JS
// Phoenix Core
jQuery(document).ready(function($)
{
	var core = $('$formSelector').phoenix($options);

	window.$variable = window.$variable || {};
	window.$variable = $.extend(window.$variable, core);
});
JS;

			$asset->internalScript($js);
		}
	}

	/**
	 * filterbar
	 *
	 * @param string $selector
	 * @param string $variable
	 * @param array  $options
	 *
	 * @return void
	 */
	public static function grid($selector = '#admin-form', $variable = 'Phoenix' ,$options = array())
	{
		$asset = static::getAsset();

		if (!static::inited(__METHOD__))
		{
			static::core();

			$asset->addScript(static::phoenixName() . '/js/phoenix/grid.js');

			static::translate('phoenix.message.delete.confirm');
			static::translate('phoenix.message.grid.checked');
		}

		if (!static::inited(__METHOD__, func_get_args()))
		{
			$options = json_encode((object) $options);

			$js = <<<JS
// Gird and filter bar
jQuery(document).ready(function($)
{
	var form = $('$selector');
	var grid = form.grid(form.phoenix(), $options);

	window.$variable = window.$variable || {};
	window.$variable.Grid = window.$variable.Grid || grid;
});
JS;

			$asset->internalScript($js);
		}
	}

	/**
	 * chosen
	 *
	 * @param string $selector
	 * @param array  $options
	 *
	 * @return  void
	 */
	public static function chosen($selector = 'select', $options = array())
	{
		$asset = static::getAsset();

		if (!static::inited(__METHOD__))
		{
			JQueryScript::core();

			$asset->addScript(static::phoenixName() . '/js/chosen/chosen.min.js');
			$asset->addStyle(static::phoenixName() . '/css/chosen/bootstrap-chosen.css');
		}

		if (!static::inited(__METHOD__, func_get_args()))
		{
			$defaultOptions = array(
				'allow_single_deselect'     => true,
				'disable_search_threshold'  => 10,
				'placeholder_text_multiple' => Translator::translate('phoenix.chosen.text,multiple'),
				'placeholder_text_single'   => Translator::translate('phoenix.chosen.text.single'),
				'no_results_text'           => Translator::translate('phoenix.chosen.text.noresult')
			);

			$options = json_encode((object) array_merge($defaultOptions, $options), JsonFormat::prettyPrint());

			$js = <<<JS
// Chosen select
jQuery(document).ready(function($)
{
	$('{$selector}').chosen($options);
});
JS;

			$asset->internalScript($js);
		}
	}

	/**
	 * translator
	 *
	 * @return  void
	 */
	public static function translator()
	{
		if (!static::inited(__METHOD__))
		{
			CoreScript::underscoreString(true);

			$asset = static::getAsset();
			$asset->addScript(static::phoenixName() . '/js/phoenix/translator.min.js');
		}
	}

	/**
	 * langKey
	 *
	 * @param   string  $key
	 *
	 * @return  void
	 */
	public static function translate($key)
	{
		static::translator();

		$asset = static::getAsset();

		$text = Translator::translate($key);

		/** @var Language $language */
		$language = Translator::getInstance();
		$handler = $language->getNormalizeHandler();

		$key = call_user_func($handler, $key);

		$asset->internalScript("Phoenix.Translator.addKey('{$key}', '$text')");
	}

	/**
	 * multiSelect
	 *
	 * @param string $selector
	 * @param array  $options
	 */
	public static function multiSelect($selector = '#admin-form table', $options = array())
	{
		$asset = static::getAsset();

		if (!static::inited(__METHOD__))
		{
			JQueryScript::core();

			$asset->addScript(static::phoenixName() . '/js/phoenix/multiselect.min.js');
		}

		if (!static::inited(__METHOD__, func_get_args()))
		{
			$options = json_encode((object) $options);

			$js = <<<JS
// Chosen select
jQuery(document).ready(function($)
{
	$('$selector').multiselect('$selector', $options);
});
JS;

			$asset->internalScript($js);
		}
	}

	/**
	 * formValidation
	 *
	 * @param string $selector
	 * @param array  $options
	 *
	 * @return  void
	 */
	public static function formValidation($selector = '#admin-form', $options = array())
	{
		$asset = static::getAsset();

		if (!static::inited(__METHOD__))
		{
			JQueryScript::core();

			$asset->addScript(static::phoenixName() . '/js/string/punycode.min.js');
			$asset->addScript(static::phoenixName() . '/js/phoenix/validation.min.js');
		}

		if (!static::inited(__METHOD__, func_get_args()))
		{
			$defaultOptions = array();

			$options = json_encode((object) array_merge($defaultOptions, $options));

			static::translate('phoenix.message.validation.required');
			static::translate('phoenix.message.validation.failure');

			$js = <<<JS
// Chosen select
jQuery(document).ready(function($)
{
	$('$selector').validation($options);
});
JS;

			$asset->internalScript($js);
		}
	}

	/**
	 * keepAlive
	 *
	 * @param string  $url
	 * @param integer $time
	 *
	 * @return  void
	 */
	public static function keepAlive($url = './', $time = null)
	{
		if (!static::inited(__METHOD__))
		{
			if ($time === null)
			{
				$config = Ioc::getConfig();
				$time = $config->get('session.life_time', 3);

				$time = $time * 60000;
			}

			$js = "Phoenix.keepAlive('$url', $time);";

			static::getAsset()->internalScript($js);
		}
	}
}
