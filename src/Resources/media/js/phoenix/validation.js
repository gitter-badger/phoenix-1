/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2015 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 */

/**
 * PhoenixValidation
 */
;(function($)
{
    "use strict";

    /**
     * Plugin name.
     *
     * @type {string}
     */
    var plugin = 'validation';

    /**
     * Default handlers
     *
     * @type {Object}
     */
    var handlers = {};

    var defaultOptions = {
        events: ['change']
    };

    /**
     * Class init.
     *
     * @param {jQuery} element
     * @param {Object} options
     * @constructor
     */
    var PhoenixValidation = function(element, options)
    {
        options = $.extend({}, defaultOptions, options);

        /**
         * Validate success.
         *
         * @type {string}
         */
        this.STATE_SUCCESS = 'success';

        /**
         * Validate fail.
         *
         * @type {string}
         */
        this.STATE_FAIL = 'fail';

        /**
         * Pass or required with value.
         *
         * @type {string}
         */
        this.STATE_NONE = 'none';

        /**
         * Required with no value.
         *
         * @type {string}
         */
        this.STATE_EMPTY = 'empty';

        this.form = element || $;
        this.options = options;
        this.validators = [];
        this.theme = {};
        this.inputs = this.form.find('input, select, textarea, div.input-list-container');

        this.registerDefaultValidators();
        this.registerEvents();
    };

    PhoenixValidation.prototype = {

        /**
         * Add field.
         *
         * @param {*} input
         * @returns {PhoenixValidation}
         */
        addField: function(input)
        {
            this.inputs = this.inputs.add(input);

            return this;
        },

        /**
         * Validate All.
         *
         * @returns {boolean}
         */
        validateAll: function()
        {
            var self = this, inValid = [];

            this.inputs.each(function()
            {
                if (!self.validate(this))
                {
                    inValid.push(this);
                }
            });

            return inValid.length <= 0;
        },

        /**
         * Validate.
         *
         * @param {jQuery} input
         * @returns {boolean}
         */
        validate: function(input)
        {
            var $input = $(input), tagName, className, validator;

            if ($input.attr('disabled'))
            {
                this.showResponse(this.STATE_NONE, $input);

                return true;
            }

            if ($input.attr('type') == 'radio' || $input.attr('type') == 'checkbox')
            {
                return true;
            }

            if ($input.attr('required') || $input.hasClass('required'))
            {
                // Handle radio & checkboxes
                if ($input.prop("tagName").toLowerCase() === 'div' && $input.hasClass('input-list-container'))
                {
                    if (!$input.find('input:checked').length)
                    {
                        this.showResponse(this.STATE_EMPTY, $input);

                        return false;
                    }
                }

                // Handle all fields and checkbox
                else if (!$input.val() || ($input.attr('type') === 'checkbox' && !$input.is(':checked')))
                {
                    this.showResponse(this.STATE_EMPTY, $input);

                    return false;
                }
            }

            // Is value exists, validate this type.
            className = $input.attr('class');

            if (className)
            {
                validator = className.match(/validate-([a-zA-Z0-9\_|-]+)/);
            }

            // Empty value and no validator config, set response to none.
            if (!$input.val() || !validator)
            {
                this.showResponse(this.STATE_NONE, $input);

                return true;
            }

            validator = this.validators[validator[1]];

            if (!validator || !validator.handler)
            {
                this.showResponse(this.STATE_NONE, $input);

                return true;
            }

            if (!validator.handler($input.val(), $input))
            {
                var help = validator.options.notice;

                if (typeof  help == 'function')
                {
                    help = help($input, this);
                }

                this.showResponse(this.STATE_FAIL, $input, help);

                return false;
            }

            this.showResponse(this.STATE_SUCCESS, $input);

            return true;
        },

        /**
         * Show response on input.
         *
         * @param {string} state
         * @param {jQuery} $input
         * @param {string} help
         *
         * @returns {PhoenixValidation}
         */
        showResponse: function(state, $input, help)
        {
            Phoenix.Theme.showValidateResponse(this, state, $input, help);

            $input.trigger({
                type: 'phoenix.validate.' + state,
                input: $input,
                state: state,
                help: help
            });

            return this;
        },

        /**
         * Remove responses.
         *
         * @param {jQuery} $element
         *
         * @returns {PhoenixValidation}
         */
        removeResponse: function($element)
        {
            Phoenix.Theme.removeValidateResponse($element);

            return this;
        },

        /**
         * Add validator handler.
         *
         * @param name
         * @param validator
         * @param options
         * @returns {PhoenixValidation}
         */
        addValidator: function(name, validator, options)
        {
            options = options || {};

            this.validators[name] = {
                handler: validator,
                options: options
            };

            return this;
        },

        /**
         * Register events.
         */
        registerEvents: function()
        {
            var self = this;

            this.form.on('submit', function(event)
            {
                if (!self.validateAll())
                {
                    event.stopPropagation();
                    event.preventDefault();

                    return false;
                }

                return true;
            });

            $.each(this.options.events, function()
            {
                self.inputs.on(this, function()
                {
                    self.validate(this);
                });
            });
        },

        /**
         * Register default validators.
         */
        registerDefaultValidators: function()
        {
            var self = this;

            $.each(handlers, function(i)
            {
                self.addValidator(i, this);
            });
        }
    };

    $.fn[plugin] = function (options)
    {
        if (!this.data('phoenix.' + plugin))
        {
            this.data('phoenix.' + plugin, new PhoenixValidation(this, options));
        }

        return this.data('phoenix.' + plugin);
    };

    handlers.username = function(value, element)
    {
        var regex = new RegExp("[\<|\>|\"|\'|\%|\;|\(|\)|\&]", "i");
        return !regex.test(value);
    };

    handlers.password = function(value, element)
    {
        var regex = /^\S[\S ]{2,98}\S$/;
        return regex.test(value);
    };

    handlers.numeric = function(value, element)
    {
        var regex = /^(\d|-)?(\d|,)*\.?\d*$/;
        return regex.test(value);
    };

    handlers.email = function(value, element)
    {
        value = punycode.toASCII(value);
        var regex = /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(value);
    };

    handlers.url = function(value, element)
    {
        value = punycode.toASCII(value);
        var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/;
        return regex.test(value);
    };

    handlers.alnum = function(value, element)
    {
        var regex = /^[a-zA-Z0-9]*$/;
        return regex.test(value);
    };

    handlers.color = function(value, element)
    {
        var regex = /^#(?:[0-9a-f]{3}){1,2}$/;
        return regex.test(value);
    };

    /**
     * @see  http://www.virtuosimedia.com/dev/php/37-tested-php-perl-and-javascript-regular-expressions
     */
    handlers.creditcard = function(value, element)
    {
        var regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/;
        return regex.test(value);
    };

    handlers.ip = function(value, element)
    {
        var regex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;
        return regex.test(value);
    };

})(jQuery);
