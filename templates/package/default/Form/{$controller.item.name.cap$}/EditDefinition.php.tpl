<?php
/**
 * Part of phoenix project.
 *
 * @copyright  Copyright (C) 2015 {ORGANIZATION}. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace {$package.namespace$}{$package.name.cap$}\Form\{$controller.item.name.cap$};

use {$package.namespace$}{$package.name.cap$}\Field\{$controller.item.name.cap$}\{$controller.item.name.cap$}ListField;
use {$package.namespace$}{$package.name.cap$}\Field\{$controller.item.name.cap$}\{$controller.item.name.cap$}ModalField;
use Phoenix\Field\CalendarField;
use Windwalker\Core\Language\Translator;
use Windwalker\Form\Field\HiddenField;
use Windwalker\Form\Field\RadioField;
use Windwalker\Form\Field\TextareaField;
use Windwalker\Form\Field\TextField;
use Windwalker\Form\FieldDefinitionInterface;
use Windwalker\Form\Form;
use Windwalker\Html\Option;
use Windwalker\Validator\Rule\UrlValidator;

/**
 * The {$controller.item.name.cap$}EditDefinition class.
 *
 * @since  {DEPLOY_VERSION}
 */
class EditDefinition implements FieldDefinitionInterface
{
	/**
	 * Define the form fields.
	 *
	 * @param Form $form The Windwalker form object.
	 *
	 * @return  void
	 */
	public function define(Form $form)
	{
		// Basic fieldset
		$form->wrap('basic', null, function(Form $form)
		{
			// ID
			$form->add('id', new HiddenField);

			// Title
			$form->add('title', new TextField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.title'))
				->required(true);

			// Alias
			$form->add('alias', new TextField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.alias'));

			// Images
			$form->add('images', new TextField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.images'));

			// URL
			$form->add('url', new TextField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.url'))
				->setValidator(new UrlValidator)
				->set('class', 'validate-url');

			// Example: {$controller.item.name.cap$} List
			$form->add('{$controller.item.name.lower$}_list', new {$controller.item.name.cap$}ListField)
				->label('List Example');

			// Example: {$controller.item.name.cap$} Modal
			$form->add('{$controller.item.name.lower$}_modal', new {$controller.item.name.cap$}ModalField)
				->label('Modal Example');
		});

		// Text Fieldset
		$form->wrap('text', null, function(Form $form)
		{
			// Introtext
			$form->add('introtext', new TextareaField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.introtext'))
				->set('rows', 10);

			// Fulltext
			$form->add('fulltext', new TextareaField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.fulltext'))
				->set('rows', 10);
		});

		// Created fieldset
		$form->wrap('created', null, function(Form $form)
		{
			// State
			$form->add('state', new RadioField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.state'))
				->set('class', 'btn-group')
				->set('default', 1)
				->addOption(new Option(Translator::translate('phoenix.grid.state.published'), '1'))
				->addOption(new Option(Translator::translate('phoenix.grid.state.unpublished'), '0'));

			// Version
			$form->add('version', new TextField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.version'));

			// Created
			$form->add('created', new CalendarField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.created'));

			// Modified
			$form->add('modified', new CalendarField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.modified'));

			// Author
			$form->add('created_by', new TextField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.author'));

			// Modified User
			$form->add('modified_by', new TextField)
				->label(Translator::translate('{$package.name.lower$}.{$controller.item.name.lower$}.field.modifiedby'));
		});
	}
}
