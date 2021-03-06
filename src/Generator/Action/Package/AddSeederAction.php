<?php
/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2015 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 */

namespace Phoenix\Generator\Action\Package;

use Muse\Action\AbstractAction;
use Phoenix\Generator\GeneratorHelper;

/**
 * The AddSeederAction class.
 *
 * @since  1.0
 */
class AddSeederAction extends AbstractAction
{
	/**
	 * Do this execute.
	 *
	 * @return  mixed
	 */
	protected function doExecute()
	{
		$name = $this->config['replace.controller.item.name.cap'];

		$file = $this->config['dir.dest'] . '/Seed/DatabaseSeeder.php';

		if (!is_file($file))
		{
			return;
		}

		$code = file_get_contents($file);
		$added = false;

		if (strpos($code, '$this->execute(new ' . $name . 'Seeder);') === false)
		{
			$replace = "\t\t\$this->execute(new {$name}Seeder);\n\n";

			$code = GeneratorHelper::addBeforePlaceholder('seeder-execute', $code, $replace);

			$added = true;
		}

		if (strpos($code, '$this->clean(new ' . $name . 'Seeder);') === false)
		{
			$replace = "\t\t\$this->clean(new {$name}Seeder);\n\n";

			$code = GeneratorHelper::addBeforePlaceholder('seeder-clean', $code, $replace);

			$added = true;
		}

		if ($added)
		{
			file_put_contents($file, $code);

			$this->io->out('[<info>Action</info>] Add seeder to DatabaseSeeder');
		}
	}
}
