
$ = jQuery

$.fn.extend {}=
	dtable: (options,data) ->
		settings =
			per_page:10
			debug:true
			checkbox:true
			page:1
			pagination_holder:'.pagination'
			pre:'<'
			next:'>'

		$.extend settings, options

		el = @

		log = (msg) -> console?.log msg if settings.debug

		@head = () -> ($(item).text() for item in $(el).find('th'))

		@rows = () -> $(el).find('tr')[1..]

		@range = (begin,end)-> $(el).find('tr')[begin+1..end]

		@filter = (keyword,colnum) ->
			true

		@grep = (keyword,colnum) ->
			true

		@init = ->
			# should use on instead of live
			$("#{settings.pagination_holder} .goto").live 'click',(e)->
				e.preventDefault()
				page = $(@).text() - 0
				el.goto page

			$("#{settings.pagination_holder} .pre").live 'click',(e)->
				e.preventDefault()
				@pre()

			$("#{settings.pagination_holder} .next").live 'click',(e)->
				e.preventDefault()
				@next()

			@paginate()
			@show()

		@paginate = ->
			shift = (settings.page-1)*settings.per_page
			rows = @range(shift,shift+settings.per_page)
			@rows().hide()
			rows.show()

			pre = "<a class=\"pre\" href=\"javascript:;\">#{settings.pre}</a>"
			next = "<a class=\"next\" href=\"javascript:;\">#{settings.next}</a>"
			buttons = ""
			for page in [1..@num_pages()]
				cls = if page == settings.page then 'current' else 'goto'
				buttons += "<a class=\"#{cls}\" href=\"javascript:;\">#{page}</a>"
			html = "#{pre} #{buttons} #{next}"
			$(settings.pagination_holder).html html

		@pre = () -> @goto(settings.page-1) if settings.page>1

		@next = () -> @goto(settings.page+1) if settings.page<@num_pages()

		@goto = (page_num) ->
			settings.page=page_num
			@paginate()

		@get_num_rows = ->
			@num_rows=@rows().length

		@num_pages = ->
			num_rows = @num_rows ? @get_num_rows()
			Math.ceil num_rows/settings.per_page

		@init()
