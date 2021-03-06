/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2015 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

/**
 * PhoenixGrid
 */
;(function($)
{
    "use strict";

    /**
     * Plugin Name.
     *
     * @type {string}
     */
    var plugin = "grid";

    /**
     * Default options.
     *
     * @type {Object}
     */
    var defaultOptions = {
        selector: {
            search: {
                container: '.search-container',
                button: '.search-button',
                clearButton: '.search-clear-button'
            },
            filter: {
                container: '.filter-container',
                button: '.filter-toggle-button'
            },
            sort: {
                button: 'a[data-sort-button]'
            }
        }
    };

    /**
     * PhoenixGrid constructor.
     *
     * @param element
     * @param core
     * @param options
     *
     * @constructor
     */
    function PhoenixGrid(element, core, options)
    {
        this.form = element;
        this.core = core;
        this.options = $.extend(true, {}, defaultOptions, options);

        var selector = this.options.selector;

        this.searchContainer = this.form.find(selector.search.container);
        this.searchButton = this.form.find(selector.search.button);
        this.searchClearButton = this.form.find(selector.search.clearButton);
        this.filterContainer = this.form.find(selector.filter.container);
        this.filterButton = this.form.find(selector.filter.button);
        this.sortButtons = this.form.find(selector.sort.button);

        this.registerEvents();
    }

    PhoenixGrid.prototype = {

        registerEvents: function()
        {
            var self = this;

            this.searchClearButton.click(function(event)
            {
                self.searchContainer.find('input, textarea, select').val('');
                self.filterContainer.find('input, textarea, select').val('');

                self.form.submit();
            });

            this.filterButton.click(function(event)
            {
                self.toggleFilter();
                event.stopPropagation();
                event.preventDefault();
            });

            this.sortButtons.click(function(event)
            {
                self.sort(this, event);
            });
        },

        toggleFilter: function()
        {
            Phoenix.Theme.toggleFilter(this.filterContainer, this.filterButton);

            return this;
        },

        sort: function(ordering, direction)
        {
            var orderingInput = this.form.find('input[name=list_ordering]');

            if (!orderingInput.length)
            {
                orderingInput = $('<input name="list_ordering" type="hidden" value="" />');

                this.form.append(orderingInput);
            }

            var directionInput = this.form.find('input[name=list_direction]');

            if (!directionInput.length)
            {
                directionInput = $('<input name="list_direction" type="hidden" value="" />');

                this.form.append(directionInput);
            }

            orderingInput.val(ordering);
            directionInput.val(direction);

            return this.core.put();
        },

        /**
         * Update a row.
         *
         * @param  {number} row
         * @param  {string} url
         * @param  {Object} queries
         */
        updateRow: function(row, url, queries)
        {
            this.toggleAll(false);

            var ch = this.form.find('input.grid-checkbox[data-row-number=' + row + ']');

            if (!ch.length)
            {
                throw new Error('Checkbox of row: ' + row + ' not found.');
            }

            ch[0].checked = true;

            return this.core.patch(url, queries);
        },

        /**
         * Copy a row.
         *
         * @param  {number} row
         * @param  {string} url
         * @param  {Object} queries
         */
        copyRow: function(row, url, queries)
        {
            this.toggleAll(false);

            var ch = this.form.find('input.grid-checkbox[data-row-number=' + row + ']');

            if (!ch.length)
            {
                throw new Error('Checkbox of row: ' + row + ' not found.');
            }

            ch[0].checked = true;

            return this.core.post(url, queries);
        },

        deleteList: function(msg, url, queries)
        {
            msg = msg || Phoenix.Translator.translate('phoenix.delete.confirm');

            if (!confirm(msg))
            {
                return false;
            }

            return this.core.sendDelete(url, queries);
        },

        deleteRow: function(row, msg, url, queries)
        {
            this.toggleAll(false);

            var ch = this.form.find('input.grid-checkbox[data-row-number=' + row + ']');

            if (!ch.length)
            {
                throw new Error('Checkbox of row: ' + row + ' not found.');
            }

            ch[0].checked = true;

            return this.deleteList(msg, url, queries);
        },

        /**
         * Toggle all checkboxes.
         *
         * @param  {boolean}          value     Checked or unchecked.
         * @param  {number|boolean}   duration  Duration to check all.
         */
        toggleAll: function(value, duration)
        {
            var checkboxes = this.form.find('input.grid-checkbox[type=checkbox]');

            $.each(checkboxes, function(i, e)
            {
                if (duration)
                {
                    // A little pretty effect
                    setTimeout(function()
                    {
                        e.checked = value;
                    }, (duration / checkboxes.length) * i);
                }
                else
                {
                    e.checked = value;
                }
            });

            return this;
        },

        /**
         * Count checked checkboxes.
         *
         * @returns {int}
         */
        countChecked: function()
        {
            return this.getChecked().length;
        },

        /**
         * Get Checked boxes.
         *
         * @returns {Element[]}
         */
        getChecked: function()
        {
            var checkboxes = this.form.find('input.grid-checkbox[type=checkbox]'),
                result = [];

            $.each(checkboxes, function(i, e)
            {
                if (e.checked)
                {
                    result.push(e);
                }
            });

            return result;
        },

        /**
         * Validate there has one or more checked boxes.
         *
         * @param   {string}  msg
         * @param   {Event}   event
         *
         * @returns {PhoenixGrid}
         */
        hasChecked: function(msg, event)
        {
            msg = msg || Phoenix.Translator.translate('phoenix.message.grid.checked');

            if (!this.countChecked())
            {
                alert(msg);

                // If you send event object as second argument, we will stop all actions.
                if (event)
                {
                    event.stopPropagation();
                    event.preventDefault();
                }

                throw new Error(msg);
            }

            return this;
        },

        /**
         * Reorder all.
         *
         * @param   {string}  url
         * @param   {Object}  queries
         *
         * @returns {boolean}
         */
        reorderAll: function(url, queries)
        {
            queries = queries || {};
            queries['task'] = queries['task'] || 'reorder';

            return this.core.patch(url, queries);
        },

        /**
         * Reorder items.
         *
         * @param  {int}     row
         * @param  {int}     offset
         * @param  {string}  url
         * @param  {Object}  queries
         *
         * @returns {boolean}
         */
        reorder: function(row, offset, url, queries)
        {
            var input = this.form.find('input[data-order-row=' + row + ']');
            var tr    = input.parents('tr');
            var group = tr.attr('data-order-group');
            var input2;

            input.val(parseInt(input.val()) + parseFloat(offset));

            if (offset > 0)
            {
                if (group)
                {
                    input2 = tr.nextAll('tr[data-order-group=' + group + ']').first().find('input[data-order-row]');
                }
                else
                {
                    input2 = tr.next().find('input[data-order-row]');
                }
            }
            else if (offset < 0)
            {
                if (group)
                {
                    input2 = tr.prevAll('tr[data-order-group=' + group + ']').first().find('input[data-order-row]');
                }
                else
                {
                    input2 = tr.prev().find('input[data-order-row]');
                }
            }

            input2.val(parseInt(input2.val()) - parseFloat(offset));

            return this.reorderAll(url, queries);
        }
    };

    $.fn[plugin] = function(core, options)
    {
        if (!$.data(this, "phoenix." + plugin))
        {
            $.data(this, "phoenix." + plugin, new PhoenixGrid(this, core, options));
        }

        return $.data(this, "phoenix." + plugin);
    };

})(jQuery);
