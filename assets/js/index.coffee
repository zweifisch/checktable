jQuery ->
	table = $('#table').dtable
		per_page:8

	console.log table.head()
	console.log table.range(1,5)
