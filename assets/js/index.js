
  jQuery(function() {
    var table;
    table = $('#table').dtable({
      per_page: 8
    });
    console.log(table.head());
    return console.log(table.range(1, 5));
  });
