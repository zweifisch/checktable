# **dtable** jquery plugin for table pagination and more
# 
# #### setup
# 
# the markup of a dtable
# 
# 	<table cellspacing="0" id="mytable">
# 		<tr>
# 			<th data-name="checkbox">
# 				<input type="checkbox" class="checkbox" value="" name="" />
# 			</th>
# 			<th data-name="product">Product</th>
# 			<th data-name="price">Price</th>
# 			<th data-name="counts">Counts</th>
# 		</tr>
# 		<tr data-id="">
# 			<td>
# 				<input type="checkbox" class="checkbox" value="" name="" />
# 			</td>
# 			<td></td>
# 			<td></td>
# 			<td></td>
# 		</tr>
# 	</table>
# 
# if `data-name is not set, .text() of th will be used
# the column can be accessed/populated with the name
# 
# 	$('#mytable').dtable()
# 

# alias
$ = jQuery

$.fn.extend {}=
	dtable: (options,data) ->
		settings =
			per_page:10
			debug:false
			checkbox:true
			page:1
			pagination_holder:'#pagination'
			pre:'<'
			next:'>'

		# overwrite default settings
		$.extend settings, options

		# put `this` to el
		el = @
		@_cache={}

		log = (msg) -> console?.log msg if settings.debug

		@init = ->
			el.allrows = el.rows()
			# bind number buttons
			$("#{settings.pagination_holder} .goto").live 'click',(e)->
				e.preventDefault()
				page = $(@).text() - 0
				el.goto page

			# prev button
			$("#{settings.pagination_holder} .prev").live 'click',(e)=>
				e.preventDefault()
				@prev()

			# next button
			$("#{settings.pagination_holder} .next").live 'click',(e)=>
				e.preventDefault()
				@next()

			$(@rows()).click (e)->
				$(@).addClass('current').siblings().removeClass('current')

			@paginate()
			# the whole table can be hidden at the beginning to avoid flash
			@show()

		# expose rows that should be visible, repopulate the pagination area
		@paginate = ->
			log 'paginating'
			if settings.page > @num_pages()
				settings.page =  @num_pages()
			shift = (settings.page-1)*settings.per_page
			rows = @range(shift,shift+settings.per_page)
			@allrows.hide()
			odd=false
			for row in rows
				$(row).removeClass('odd').removeClass('even').addClass(if odd then 'odd' else 'even')
				odd = not odd
			rows.show()

			pre = "<li class=\"prev#{if settings.page<=1 then ' disabled' else ''}\"><a href=\"javascript:;\">#{settings.pre}</a></li>"
			next = "<li class=\"next#{if settings.page>=@num_pages() then ' disabled' else ''}\"><a href=\"javascript:;\">#{settings.next}</a></li>"
			buttons = ""
			if @num_pages()>0
				for page in [1..@num_pages()]
					cls = if page == settings.page then 'active' else 'goto'
					buttons += "<li class=\"#{cls}\"><a href=\"javascript:;\">#{page}</a></li>"
			html = "<div class=\"pagination\"><ul>#{pre} #{buttons ? ''} #{next}</ul></div>"
			$(settings.pagination_holder).html html

		@prev = () -> @goto(settings.page-1) if settings.page>1
		@next = () -> @goto(settings.page+1) if settings.page<@num_pages()

		@goto = (page_num) ->
			settings.page=page_num
			@paginate()

		@num_pages = ->
			num_rows = @_cache.num_rows ? @_cache.num_rows = @rows().length
			Math.ceil num_rows/settings.per_page

		# get text in `th`s as an array
		@head = -> @_cache.head ? @_cache.head = ($(item).text() for item in if settings.checkbox then $(el).find('th')[1..] else $(el).find('th'))

		# get distinct values from a column
		@colvals_distinct= (colname)->
			added = {}
			# get the coloumn val from row, and append it to the result if it's
			# not there
			(row[colname] for row in @rows_data() when not added?[row[colname]] and added[row[colname]]=true)

		# get all available rows
		@get_rows = ->
			# strip the header
			rows = $(el).find('tr')[1..]
			result = []
			if settings.grep
				return $ (row for row in rows when @get_row_data_from_markup(row)[settings.grep.colname].match(settings.grep.keyword))
			if settings.filter
				return $ (row for row in rows when not @get_row_data_from_markup(row)[settings.filter.colname].match(settings.filter.keyword))
			return rows

		@rows = -> @_cache.rows ? @_cache.rows = @get_rows()

		# get rows as an array of dictionary, if `settings.checkbox` enabled, key
		# `checked` will be added
		@get_rows_data = -> (@get_row_data_from_markup(row) for row in @rows())

		@rows_data = -> @_cache?.rows_data ? @get_rows_data()

		@rows_current_page = ->
			rows = $(el).find('tr:visible')[1..]

		@range = (begin,end)-> @rows()[begin...end]

		@clear_cache = -> @_cache = {}

		@reset = ->
			delete settings.grep
			delete settings.filter
			settings.page=1
			@clear_cache()

		@filter = (keyword,colname) ->
			@reset()
			settings.filter=
				keyword:keyword
				colname:colname
			@paginate()

		@grep = (keyword,colname) ->
			@reset()
			settings.grep=
				keyword:keyword
				colname:colname
			@paginate()

		@get_colnames = -> ($(th).data('name') ? $(th).text() for th in if settings.checkbox then $(el).find('th')[1..] else $(el).find('th'))

		@colnames = -> @_colnames ? @get_colnames()

		@checked_rows = -> (row for row in @rows() when $('td:first-child input:checked',row).length==1)
		@checked_rows_current_page = -> (row for row in @rows_current_page() when $('td:first-child input:checked',row).length==1)

		@checked_ids = -> ($(row).data('id') for row in @rows() when $('td:first-child input:checked',row).length==1)
		@checked_ids_current_page = -> ($(row).data('id') for row in @rows_current_page() when $('td:first-child input:checked',row).length==1)

		@checked_rows_data = -> (@get_row_data_from_markup(row) for row in @rows() when $('td:first-child input:checked',row).length==1)
		@checked_rows_data_current_page = -> (@get_row_data_from_markup(row) for row in @rows_current_page() when $('td:first-child input:checked',row).length==1)

		@get_row_by_id = (id)-> $("tr[data-id=#{id}]").first()
		@get_row_data_by_id = (id) -> @get_row_data_from_markup @get_row_by_id()

		@get_row_data_from_markup = (markup) ->
			result={}
			vals = ($(td).text() for td in if settings.checkbox then $(markup).children()[1..] else $(markup).children())
			result[key] = vals[i] for key,i in @colnames()
			if settings.checkbox
				result['checked']= $('td:first-child input:checked',markup).length == 1
			result

		@remove_by_id = (id) ->
			@get_row_by_id(id).remove()
			@clear_cache()
			@paginate()

		@update_row = (id,data) -> false

		@create_selector_for = (colname,options)->
			@reset()
			defaults=
				name:colname
				class:''
				id:''
			$.extend defaults,options
			@create_selector @colvals_distinct(colname),defaults

		@create_field_selector = (settings,vals)->
			defaults=
				name:'field'
				class:''
				id:''
			$.extend defaults,settings
			options={}
			options[key] = @head()[i] for key,i in @colnames()
			@create_selector options,defaults

		@create_selector = (options,settings)->
			defaults=
				name:''
				class:''
				id:''
			$.extend defaults,settings
			if options instanceof Array
				options_array=("<option>#{val}</option>" for val in options)
			else
				options_array=("<option value=\"#{val}\">#{label}<option>" for val,label of options)
			"<select name=\"#{defaults.name}\" id=\"#{defaults.id}\" class=\"#{defaults.class}\">#{options_array.join ''}</select>"

		@init()
