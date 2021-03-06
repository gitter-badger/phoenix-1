<?php
/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2015 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace Phoenix\Model;

use Windwalker\Data\Data;
use Windwalker\Record\Record;

/**
 * The AbstractCrudModel class.
 *
 * @since  1.0
 */
class CrudModel extends FormModel
{
	/**
	 * save
	 *
	 * @param Data $data
	 *
	 * @return  boolean
	 */
	public function save(Data $data)
	{
		$record = $this->getRecord();
		$key = $record->getKeyName();

		$isNew = true;
		$pk    = $data->$key;

		if ($pk)
		{
			$record->load($pk);
			$isNew = false;
		}

		$record->bind($data->dump());

		$this->prepareRecord($record);

		$record->check()
			->store();

		if ($record->$key)
		{
			$this['item.pk'] = $data->$key = $record->$key;
		}

		$this['item.new'] = $isNew;
		$this['item.pkName'] = $key;

		$this->postSaveHook($record);

		return true;
	}

	/**
	 * postSaveHook
	 *
	 * @param Record $record
	 *
	 * @return  void
	 */
	protected function postSaveHook(Record $record)
	{
	}

	/**
	 * prepareRecord
	 *
	 * @param Record $record
	 *
	 * @return  void
	 */
	protected function prepareRecord(Record $record)
	{
	}

	/**
	 * delete
	 *
	 * @param array $pk
	 *
	 * @return  boolean
	 */
	public function delete($pk = array())
	{
		$pk = $pk ? : $this['item.pk'];

		$record = $this->getRecord();

		$record->load($pk)->delete();

		return true;
	}
}
