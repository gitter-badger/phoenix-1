<?php
/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2015 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 */

namespace Phoenix\Provider;

use Phoenix\Asset\AssetManager;
use Phoenix\Html\DocumentManager;
use Phoenix\Toolbar\ToolbarFactory;
use Windwalker\Core\Renderer\RendererHelper;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;
use Windwalker\Utilities\Queue\Priority;

/**
 * The AssetProvider class.
 * 
 * @since  1.0
 */
class PhoenixProvider implements ServiceProviderInterface
{
	/**
	 * Registers the service provider with a DI container.
	 *
	 * @param   Container $container The DI container.
	 *
	 * @return  void
	 */
	public function register(Container $container)
	{
		if ($container->getParent())
		{
			$container = $container->getParent();
		}

		// Html document
		$closure = function(Container $container)
		{
			return new DocumentManager;
		};

		$container->share('phoenix.document', $closure);

		// Asset
		$closure = function(Container $container)
		{
			return new AssetManager;
		};

		$container->share('phoenix.asset', $closure);

		$container->share('toolbar.factory', $closure);

		$closure = function(Container $container)
		{
			return $container->get('toolbar.factory')->getToolbar('windwalker');
		};

		$container->share('toolbar', $closure);

		RendererHelper::addGlobalPath(PHOENIX_SOURCE . '/Resources/templates', Priority::LOW - 25);
	}
}
