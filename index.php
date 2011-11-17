<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>DataTable</title>
	<link href="assets/css/style.css" rel="stylesheet" />
</head>
<body>
	<div>
	<table id="table" style="display:none" cellspacing="0">
	<thead>
		<tr>
			<th><input type="checkbox" class="checkbox" value="" name="" /></th>
			<th>Price</th>
			<th>Item</th>
			<th>Count</th>
		</tr>
	</thead>
		<?php $items=explode(',','apple,boom,cube,diff,emerge')?>
		<?php for($i=0;$i<100;$i++):?>
		<tr>
			<td><input type="checkbox" class="checkbox" value="" name="" /></td>
			<td><?php echo rand(1,999)?></td>
			<td><?php echo $items[rand(0,count($items)-1)]?></td>
			<td><?php echo rand(1,19)?></td>
		</tr>
		<?php endfor?>
	</table>
	</div>
	<div class="pagination"></div>
	<script type="text/javascript" src="assets/js/jquery-1.7.js"></script>
	<script type="text/javascript" src="assets/js/jquery.dtable.js"></script>
	<script type="text/javascript" src="assets/js/index.js"></script>
</body>
</html>
