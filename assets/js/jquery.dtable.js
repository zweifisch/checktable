var $;

$ = jQuery;

$.fn.extend({
  dtable: function(options, data) {
    var el, log, settings;
    settings = {
      per_page: 10,
      debug: true,
      checkbox: true,
      page: 1,
      pagination_holder: '.pagination',
      pre: '<',
      next: '>'
    };
    $.extend(settings, options);
    el = this;
    log = function(msg) {
      if (settings.debug) {
        return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
      }
    };
    this.head = function() {
      var item, _i, _len, _ref, _results;
      _ref = $(el).find('th');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push($(item).text());
      }
      return _results;
    };
    this.rows = function() {
      return $(el).find('tr').slice(1);
    };
    this.range = function(begin, end) {
      return $(el).find('tr').slice(begin + 1, end + 1 || 9e9);
    };
    this.filter = function(keyword, colnum) {
      return true;
    };
    this.grep = function(keyword, colnum) {
      return true;
    };
    this.init = function() {
      $("" + settings.pagination_holder + " .goto").live('click', function(e) {
        var page;
        e.preventDefault();
        page = $(this).text() - 0;
        return el.goto(page);
      });
      $("" + settings.pagination_holder + " .pre").live('click', function(e) {
        e.preventDefault();
        return this.pre();
      });
      $("" + settings.pagination_holder + " .next").live('click', function(e) {
        e.preventDefault();
        return this.next();
      });
      this.paginate();
      return this.show();
    };
    this.paginate = function() {
      var buttons, cls, html, next, page, pre, rows, shift, _ref;
      shift = (settings.page - 1) * settings.per_page;
      rows = this.range(shift, shift + settings.per_page);
      this.rows().hide();
      rows.show();
      pre = "<a class=\"pre\" href=\"javascript:;\">" + settings.pre + "</a>";
      next = "<a class=\"next\" href=\"javascript:;\">" + settings.next + "</a>";
      buttons = "";
      for (page = 1, _ref = this.num_pages(); 1 <= _ref ? page <= _ref : page >= _ref; 1 <= _ref ? page++ : page--) {
        cls = page === settings.page ? 'current' : 'goto';
        buttons += "<a class=\"" + cls + "\" href=\"javascript:;\">" + page + "</a>";
      }
      html = "" + pre + " " + buttons + " " + next;
      return $(settings.pagination_holder).html(html);
    };
    this.pre = function() {
      if (settings.page > 1) return this.goto(settings.page - 1);
    };
    this.next = function() {
      if (settings.page < this.num_pages()) return this.goto(settings.page + 1);
    };
    this.goto = function(page_num) {
      settings.page = page_num;
      return this.paginate();
    };
    this.get_num_rows = function() {
      return this.num_rows = this.rows().length;
    };
    this.num_pages = function() {
      var num_rows, _ref;
      num_rows = (_ref = this.num_rows) != null ? _ref : this.get_num_rows();
      return Math.ceil(num_rows / settings.per_page);
    };
    return this.init();
  }
});
