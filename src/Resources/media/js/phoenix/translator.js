/**
 * Part of phoenix project.
 *
 * @copyright  Copyright (C) 2015 {ORGANIZATION}. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

var Phoenix;
(function(Phoenix)
{
    "use strict";

   Phoenix.Translator = {
        keys: {},

        /**
         * Translate a string.
         *
         * @param {string} text
         * @returns {string}
         */
        translate: function(text)
        {
            if (this.keys[text])
            {
                return this.keys[text];
            }

            return text;
        },

        sprintf: function(text)
        {
            var args = [], i;

            for (i in arguments)
            {
                args.push(arguments[i]);
            }

            args[0] = this.translate(text);

            return underscore.string.sprintf.apply(underscore.string, args);
        },

        /**
         * Add language key.
         *
         * @param {string} key
         * @param {string} value
         */
        addKey: function(key, value)
        {
            this.keys[key] = value;
        }
    };
})(Phoenix || (Phoenix = {}));