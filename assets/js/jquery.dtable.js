var $;

$ = jQuery;

$.fn.extend({
  dtable: function(options, data) {
    var el, log, settings;
    settings = {
      per_page: 10,
      debug: false,
      checkbox: true,
      page: 1,
      pagination_holder: '#pagination',
      pre: '<',
      next: '>'
    };
    $.extend(settings, options);
    el = this;
    this._cache = {};
    log = function(msg) {
      if (settings.debug) {
        return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
      }
    };
    this.init = function() {
      var _this = this;
      el.allrows = el.rows();
      $("" + settings.pagination_holder + " .goto").live('click', function(e) {
        var page;
        e.preventDefault();
        page = $(this).text() - 0;
        return el.goto(page);
      });
      $("" + settings.pagination_holder + " .prev").live('click', function(e) {
        e.preventDefault();
        return _this.prev();
      });
      $("" + settings.pagination_holder + " .next").live('click', function(e) {
        e.preventDefault();
        return _this.next();
      });
      $(this.rows()).click(function(e) {
        return $(this).addClass('current').siblings().removeClass('current');
      });
      this.paginate();
      return this.show();
    };
    this.paginate = function() {
      var buttons, cls, html, next, odd, page, pre, row, rows, shift, _i, _len, _ref;
      log('paginating');
      if (settings.page > this.num_pages()) settings.page = this.num_pages();
      shift = (settings.page - 1) * settings.per_page;
      rows = this.range(shift, shift + settings.per_page);
      this.allrows.hide();
      odd = false;
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        $(row).removeClass('odd').removeClass('even').addClass(odd ? 'odd' : 'even');
        odd = !odd;
      }
      rows.show();
      pre = "<li class=\"prev" + (settings.page <= 1 ? ' disabled' : '') + "\"><a href=\"javascript:;\">" + settings.pre + "</a></li>";
      next = "<li class=\"next" + (settings.page >= this.num_pages() ? ' disabled' : '') + "\"><a href=\"javascript:;\">" + settings.next + "</a></li>";
      buttons = "";
      if (this.num_pages() > 0) {
        for (page = 1, _ref = this.num_pages(); 1 <= _ref ? page <= _ref : page >= _ref; 1 <= _ref ? page++ : page--) {
          cls = page === settings.page ? 'active' : 'goto';
          buttons += "<li class=\"" + cls + "\"><a href=\"javascript:;\">" + page + "</a></li>";
        }
      }
      html = "<div class=\"pagination\"><ul>" + pre + " " + (buttons != null ? buttons : '') + " " + next + "</ul></div>";
      return $(settings.pagination_holder).html(html);
    };
    this.prev = function() {
      if (settings.page > 1) return this.goto(settings.page - 1);
    };
    this.next = function() {
      if (settings.page < this.num_pages()) return this.goto(settings.page + 1);
    };
    this.goto = function(page_num) {
      settings.page = page_num;
      return this.paginate();
    };
    this.num_pages = function() {
      var num_rows, _ref;
      num_rows = (_ref = this._cache.num_rows) != null ? _ref : this._cache.num_rows = this.rows().length;
      return Math.ceil(num_rows / settings.per_page);
    };
    this.head = function() {
      var item, _ref;
      return (_ref = this._cache.head) != null ? _ref : this._cache.head = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = settings.checkbox ? $(el).find('th').slice(1) : $(el).find('th');
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          item = _ref2[_i];
          _results.push($(item).text());
        }
        return _results;
      })();
    };
    this.colvals_distinct = function(colname) {
      var added, row, _i, _len, _ref, _results;
      added = {};
      _ref = this.rows_data();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        if (!(added != null ? added[row[colname]] : void 0) && (added[row[colname]] = true)) {
          _results.push(row[colname]);
        }
      }
      return _results;
    };
    this.get_rows = function() {
      var result, row, rows;
      rows = $(el).find('tr').slice(1);
      result = [];
      if (settings.grep) {
        return $((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rows.length; _i < _len; _i++) {
            row = rows[_i];
            if (this.get_row_data_from_markup(row)[settings.grep.colname].match(settings.grep.keyword)) {
              _results.push(row);
            }
          }
          return _results;
        }).call(this));
      }
      if (settings.filter) {
        return $((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rows.length; _i < _len; _i++) {
            row = rows[_i];
            if (!this.get_row_data_from_markup(row)[settings.filter.colname].match(settings.filter.keyword)) {
              _results.push(row);
            }
          }
          return _results;
        }).call(this));
      }
      return rows;
    };
    this.rows = function() {
      var _ref;
      return (_ref = this._cache.rows) != null ? _ref : this._cache.rows = this.get_rows();
    };
    this.get_rows_data = function() {
      var row, _i, _len, _ref, _results;
      _ref = this.rows();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _results.push(this.get_row_data_from_markup(row));
      }
      return _results;
    };
    this.rows_data = function() {
      var _ref, _ref2;
      return (_ref = (_ref2 = this._cache) != null ? _ref2.rows_data : void 0) != null ? _ref : this.get_rows_data();
    };
    this.rows_current_page = function() {
      var rows;
      return rows = $(el).find('tr:visible').slice(1);
    };
    this.range = function(begin, end) {
      return this.rows().slice(begin, end);
    };
    this.clear_cache = function() {
      return this._cache = {};
    };
    this.reset = function() {
      delete settings.grep;
      delete settings.filter;
      settings.page = 1;
      return this.clear_cache();
    };
    this.filter = function(keyword, colname) {
      this.reset();
      settings.filter = {
        keyword: keyword,
        colname: colname
      };
      return this.paginate();
    };
    this.grep = function(keyword, colname) {
      this.reset();
      settings.grep = {
        keyword: keyword,
        colname: colname
      };
      return this.paginate();
    };
    this.get_colnames = function() {
      var th, _i, _len, _ref, _ref2, _results;
      _ref = settings.checkbox ? $(el).find('th').slice(1) : $(el).find('th');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        th = _ref[_i];
        _results.push((_ref2 = $(th).data('name')) != null ? _ref2 : $(th).text());
      }
      return _results;
    };
    this.colnames = function() {
      var _ref;
      return (_ref = this._colnames) != null ? _ref : this.get_colnames();
    };
    this.checked_rows = function() {
      var row, _i, _len, _ref, _results;
      _ref = this.rows();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        if ($('td:first-child input:checked', row).length === 1) {
          _results.push(row);
        }
      }
      return _results;
    };
    this.checked_rows_current_page = function() {
      var row, _i, _len, _ref, _results;
      _ref = this.rows_current_page();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        if ($('td:first-child input:checked', row).length === 1) {
          _results.push(row);
        }
      }
      return _results;
    };
    this.checked_ids = function() {
      var row, _i, _len, _ref, _results;
      _ref = this.rows();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        if ($('td:first-child input:checked', row).length === 1) {
          _results.push($(row).data('id'));
        }
      }
      return _results;
    };
    this.checked_ids_current_page = function() {
      var row, _i, _len, _ref, _results;
      _ref = this.rows_current_page();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        if ($('td:first-child input:checked', row).length === 1) {
          _results.push($(row).data('id'));
        }
      }
      return _results;
    };
    this.checked_rows_data = function() {
      var row, _i, _len, _ref, _results;
      _ref = this.rows();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        if ($('td:first-child input:checked', row).length === 1) {
          _results.push(this.get_row_data_from_markup(row));
        }
      }
      return _results;
    };
    this.checked_rows_data_current_page = function() {
      var row, _i, _len, _ref, _results;
      _ref = this.rows_current_page();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        if ($('td:first-child input:checked', row).length === 1) {
          _results.push(this.get_row_data_from_markup(row));
        }
      }
      return _results;
    };
    this.get_row_by_id = function(id) {
      return $("tr[data-id=" + id + "]").first();
    };
    this.get_row_data_by_id = function(id) {
      return this.get_row_data_from_markup(this.get_row_by_id());
    };
    this.get_row_data_from_markup = function(markup) {
      var i, key, result, td, vals, _len, _ref;
      result = {};
      vals = (function() {
        var _i, _len, _ref, _results;
        _ref = settings.checkbox ? $(markup).children().slice(1) : $(markup).children();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          td = _ref[_i];
          _results.push($(td).text());
        }
        return _results;
      })();
      _ref = this.colnames();
      for (i = 0, _len = _ref.length; i < _len; i++) {
        key = _ref[i];
        result[key] = vals[i];
      }
      if (settings.checkbox) {
        result['checked'] = $('td:first-child input:checked', markup).length === 1;
      }
      return result;
    };
    this.remove_by_id = function(id) {
      this.get_row_by_id(id).remove();
      this.clear_cache();
      return this.paginate();
    };
    this.update_row = function(id, data) {
      return false;
    };
    this.create_selector_for = function(colname, options) {
      var defaults;
      this.reset();
      defaults = {
        name: colname,
        "class": '',
        id: ''
      };
      $.extend(defaults, options);
      return this.create_selector(this.colvals_distinct(colname), defaults);
    };
    this.create_field_selector = function(settings, vals) {
      var defaults, i, key, _len, _ref;
      defaults = {
        name: 'field',
        "class": '',
        id: ''
      };
      $.extend(defaults, settings);
      options = {};
      _ref = this.colnames();
      for (i = 0, _len = _ref.length; i < _len; i++) {
        key = _ref[i];
        options[key] = this.head()[i];
      }
      return this.create_selector(options, defaults);
    };
    this.create_selector = function(options, settings) {
      var defaults, label, options_array, val;
      defaults = {
        name: '',
        "class": '',
        id: ''
      };
      $.extend(defaults, settings);
      if (options instanceof Array) {
        options_array = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = options.length; _i < _len; _i++) {
            val = options[_i];
            _results.push("<option>" + val + "</option>");
          }
          return _results;
        })();
      } else {
        options_array = (function() {
          var _results;
          _results = [];
          for (val in options) {
            label = options[val];
            _results.push("<option value=\"" + val + "\">" + label + "<option>");
          }
          return _results;
        })();
      }
      return "<select name=\"" + defaults.name + "\" id=\"" + defaults.id + "\" class=\"" + defaults["class"] + "\">" + (options_array.join('')) + "</select>";
    };
    return this.init();
  }
});
