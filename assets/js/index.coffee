
log = (msg)-> console?.log msg

jQuery ->
	table = $('#table').dtable
		per_page:5
		page:2
		checkbox:true
		debug:true

	$('.remove').live 'click',(e)->
		table.remove_by_id( $(@).parents('tr').data('id') )


	$('#field_selector').html table.create_field_selector name:'field'
	$('.grep.btn').click (e)->
		table.grep new RegExp($('[name=grep]').val(),'gi'), $('[name=field]').val()


	$('#field_selector2').html table.create_field_selector name:'field2'
	$('.filter.btn').click (e)->
		table.filter new RegExp($('[name=filter]').val(),'gi'), $('[name=field2]').val()


	$('#field_selector3').html table.create_field_selector name:'field3'
	$('[name=field3]').live 'change', ->
		$('#val_selector').html table.create_selector_for($(@).val(),name:'val_selector')
	$('[name=val_selector]').live 'change',->
		table.grep new RegExp("^#{$(@).val()}$",'gi'),$('[name=field3]').val()
	$('[name=field3]').change()


	$('.delete_all').live 'click', ->
		for id in table.checked_ids_current_page()
			table.remove_by_id id

	
