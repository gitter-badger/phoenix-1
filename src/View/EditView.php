<?php
/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2015 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace Phoenix\View;

use Windwalker\Core\Language\Translator;

/**
 * The EditView class.
 *
 * @since  1.0
 */
class EditView extends ItemView
{
	/**
	 * setTitle
	 *
	 * @param string $title
	 *
	 * @return  static
	 */
	public function setTitle($title = null)
	{
		$title = $title ? : Translator::sprintf('phoenix.title.edit', Translator::translate($this->package->getName() . '.' . $this->getName() . '.title'));

		return parent::setTitle($title);
	}

	/**
	 * prepareRender
	 *
	 * @param \Windwalker\Data\Data $data
	 *
	 * @return  void
	 */
	protected function prepareRender($data)
	{
		parent::prepareRender($data);

		$data->item = $this->model->getItem();
		$data->form = $this->model->getForm('edit', 'item', true);
	}
}
