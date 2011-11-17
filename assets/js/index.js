var log;

log = function(msg) {
  return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
};

jQuery(function() {
  var table;
  table = $('#table').dtable({
    per_page: 5,
    page: 2,
    checkbox: true,
    debug: true
  });
  $('.remove').live('click', function(e) {
    return table.remove_by_id($(this).parents('tr').data('id'));
  });
  $('#field_selector').html(table.create_field_selector({
    name: 'field'
  }));
  $('.grep.btn').click(function(e) {
    return table.grep(new RegExp($('[name=grep]').val(), 'gi'), $('[name=field]').val());
  });
  $('#field_selector2').html(table.create_field_selector({
    name: 'field2'
  }));
  $('.filter.btn').click(function(e) {
    return table.filter(new RegExp($('[name=filter]').val(), 'gi'), $('[name=field2]').val());
  });
  $('#field_selector3').html(table.create_field_selector({
    name: 'field3'
  }));
  $('[name=field3]').live('change', function() {
    return $('#val_selector').html(table.create_selector_for($(this).val(), {
      name: 'val_selector'
    }));
  });
  $('[name=val_selector]').live('change', function() {
    return table.grep(new RegExp("^" + ($(this).val()) + "$", 'gi'), $('[name=field3]').val());
  });
  $('[name=field3]').change();
  return $('.delete_all').live('click', function() {
    var id, _i, _len, _ref, _results;
    _ref = table.checked_ids_current_page();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      _results.push(table.remove_by_id(id));
    }
    return _results;
  });
});
