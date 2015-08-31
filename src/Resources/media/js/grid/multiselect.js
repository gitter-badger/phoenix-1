/**
 * Part of phoenix project.
 *
 * @copyright  Copyright (C) 2015 {ORGANIZATION}. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

;(function($)
{
	/**
	 * Multi Select.
	 *
	 * @param {string} selector
	 *
	 * @constructor
	 */
	var PhoenixMultiSelect = function(selector)
	{
		var self = this;
		this.boxes = $(selector).find('input.grid-checkbox[type=checkbox]');
		this.last = false;

		this.boxes.click(function(event)
		{
			self.select(this, event);
		})
	};

	PhoenixMultiSelect.prototype = {
		/**
		 * Do select.
		 *
		 * @param {Element} element
		 * @param {Event}   event
		 */
		select: function(element, event)
		{
			if (!this.last)
			{
				this.last = element;

				return;
			}

			if(event.shiftKey)
			{
				var self  = this;
				var start = this.boxes.index(element);
				var end   = this.boxes.index(this.last);

				var chs = this.boxes.slice(Math.min(start, end), Math.max(start, end) + 1);

				$.each(chs, function(i, e)
				{
					setTimeout(function()
					{
						e.checked = self.last.checked;
					}, (100 / chs.length) * i);
				})
			}

			this.last = element;
		}
	};

	window.PhoenixMultiSelect = PhoenixMultiSelect;

})(jQuery);
