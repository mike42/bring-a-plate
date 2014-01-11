<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="site/favicon.ico">

<title><?php echo esc($content['title']); ?></title>
<link href="public/css/bootstrap.css" rel="stylesheet">
<link href="public/css/sticky-footer-navbar.css" rel="stylesheet">
</head>
<body data-spy="scroll" data-target="#nav-top">
	<div id="wrap">
		<nav id="nav-top" class="navbar navbar-default navbar-fixed-top"
			role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse"
						data-target=".navbar-collapse">
						<span class="sr-only">Toggle navigation</span> <span
							class="icon-bar"></span> <span class="icon-bar"></span> <span
							class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#"><?php echo esc($content['title']); ?>
					</a>
				</div>
				<div class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li class="active"><a href="#top">Event</a></li>
						<li><a href="#rsvp">RSVP</a></li>
						<li><a href="#food">Food</a></li>
						<li><a href="#venue">Venue</a></li>
						<li><a href="#contact">Contact</a></li>
						<li><a href="#map">Map</a></li>
					</ul>
				</div>
			</div>
		</nav>

		<div class="container">
			<p class="anchor" id="top">
				<?php echo $content['lead'] . "\n"; ?>
			</p>

			<h3 class="anchor" id="rsvp">RSVP</h3>
			<p>
				<?php echo $content['rsvp'] . "\n"; ?>
			</p>

			<form class="form-horizontal" role="form">
				<?php
				foreach($data['invitation']['people'] as $person) {
					$current = "No Response";
					if($person['person_rsvp'] == "yes") {
						$current = "Attending";
					} else if($person['person_rsvp'] == "no") {
						$current = "Not attending";
					}
					echo "\t\t\t\t<div class=\"form-group\">\n".
							"\t\t\t\t<label for=\"".(int)$person['person_id']."-rsvp\" class=\"col-sm-2 control-label\">".esc($person['person_name'])."</label>\n".
							"\t\t\t\t\t<div class=\"col-sm-10\">\n".
							"\t\t\t\t\t\t<div class=\"btn-group\">\n" .
							"\t\t\t\t\t\t\t<button id=\"".(int)$person['person_id']."-rsvp\" type=\"button\" data-loading-text=\"Saving...\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\n" .
							"\t\t\t\t\t\t\t\t$current <span class=\"caret\"></span>\n" .
							"\t\t\t\t\t\t\t</button>\n" .
							"\t\t\t\t\t\t\t<ul class=\"dropdown-menu\" role=\"menu\">\n" .
							"\t\t\t\t\t\t\t\t<li><a href=\"#\" onClick=\"rsvp(".(int)$person['person_id'].", true)\">Attending</a></li>\n" .
							"\t\t\t\t\t\t\t\t<li><a href=\"#\" onClick=\"rsvp(".(int)$person['person_id'].", false)\"\">Not attending</a></li>\n" .
							"\t\t\t\t\t\t\t</ul>\n" .
							"\t\t\t\t\t\t</div>\n";
					if($person['person_rsvp'] == 'yes') {
						$burgerDisplay = "";
					} else {
						$burgerDisplay = " style=\"display: none;\"";
					}
					echo "\t\t\t\t\t\t<div class=\"btn btn-default \"$burgerDisplay onClick=\"showDiet('".(int)$person['person_id']."')\" id=\"".(int)$person['person_id']."-foodbtn\"><span class=\"glyphicon glyphicon-cutlery\"></span></div>\n" .
							"\t\t\t\t\t</div>\n" .
							"\t\t\t\t</div>\n";
				}
				?>
			</form>

			<?php
			$diet_message = "To help people know what food to bring, please tick any boxes which apply.";
			foreach($data['invitation']['people'] as $person) {
				echo "<div class=\"modal fade\" id=\"".(int)$person['person_id']."-food\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"".(int)$person['person_id']."-foodLabel\" aria-hidden=\"true\">\n" .
						"\t<div class=\"modal-dialog\">\n" .
						"\t\t<div class=\"modal-content\">\n" .
						"\t\t\t<div class=\"modal-header\">\n" .
						"\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" .
						"\t\t\t\t<h4 class=\"modal-title\" id=\"".(int)$person['person_id']."-foodLabel\">Dietary requirements for ". esc($person['person_name']) ."</h4>\n" .
						"\t\t\t</div>\n" .
						"\t\t\t<div class=\"modal-body\">\n" .
						"\t\t\t\t<form id=\"".(int)$person['person_id']."-foodfrm\" class=\"form-horizontal\" action=\"invitation.php?id=".urlencode($data['invitation']['invitation_code'])."\" method=\"post\">\n" .
						"\t\t\t\t\t<input type=\"hidden\" name=\"person_id\" value=\"".(int)$person['person_id']."\" />\n" .
						"\t\t\t\t\t<input type=\"hidden\" name=\"action\" value=\"diet\" />\n" .
						"\t\t\t\t\t<p>" . $diet_message . "</p>\n" .
						"\t\t\t\t\t<div class=\"form-group\" style=\"padding-left: 1em\">\n";

				// Left col
				echo "\t\t\t\t\t\t<div class=\"col-sm-4\"><label class=\"control-label\">Allergies</label>\n";
				foreach($data['allergen'] as $allergen) {
					echo checkbox("allergen-".$allergen['allergen_id'], $allergen['allergen_name'], isset($person['allergy'][$allergen['allergen_id']]));
				}
				echo "</div>\n";

				// Right col
				echo "\t\t\t\t\t\t<div class=\"col-sm-4\"><label class=\"control-label\">Special requirements</label>\n";
				foreach($data['requirement'] as $requirement) {
					echo checkbox("requirement-".$requirement['requirement_id'], $requirement['requirement_name'], isset($person['requirement'][$requirement['requirement_id']]));
				}
				echo "</div>\n";

				echo "\t\t\t\t\t</div>\n";

				echo "\t\t\t\t</form>\n";
				echo "\t\t\t</div>\n" .
						"\t\t\t<div class=\"modal-footer\">\n" .
						"\t\t\t\t<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n" .
						"\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" onClick=\"submitDiet(".(int)$person['person_id'].")\">Save changes</button>\n" .
						"\t\t\t</div>\n" .
						"\t\t</div>\n" .
						"\t</div>\n" .
						"</div>\n";
			}
			?>

			<h3 class="anchor" id="food">Food</h3>
			<?php 
			if(isset($data['food-message'])) {
				echo "<div class=\"alert alert-warning\">" . esc($data['food-message']) . "</div>";
			}
			?>
			<p>
				<?php echo $content['food'] . "\n"; ?>
			</p>

			<p>
				<button class="btn btn-default" data-toggle="modal"
					data-target="#addFood">
					<span class="glyphicon glyphicon-plus"></span> Add Food
				</button>
				<button class="btn btn-default" onClick="specialCatering()">
					<span class="glyphicon glyphicon-info-sign"></span> Special
					catering
				</button>
			</p>

			<div class="panel-group" id="foodboxen">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4 class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"
								href="#collapseOne"> Mains (<?php echo count($data['food']['main'])?>)
							</a>
						</h4>
					</div>
					<div id="collapseOne" class="panel panel-collapse<?php if(count($data['food']['main']) == 0 || !isset($data['food-open'])) { echo " collapse"; }?>">
						<ul class="list-group">
							<?php foodlist($data['food']['main'], $data['invitation']['invitation_id']); ?>
						</ul>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4 class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"
								href="#collapseTwo"> Salads (<?php echo count($data['food']['salad'])?>)
							</a>
						</h4>
					</div>
					<div id="collapseTwo" class="panel panel-collapse<?php if(count($data['food']['salad']) == 0 || !isset($data['food-open'])) { echo " collapse"; }?>">
						<ul class="list-group">
							<?php foodlist($data['food']['salad'], $data['invitation']['invitation_id']); ?>
						</ul>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4 class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"
								href="#collapseThree"> Desserts (<?php echo count($data['food']['dessert'])?>)
							</a>
						</h4>
					</div>
					<div id="collapseThree" class="panel panel-collapse<?php if(count($data['food']['dessert']) == 0 || !isset($data['food-open'])) { echo " collapse"; }?>">
						<ul class="list-group">
							<?php foodlist($data['food']['dessert'], $data['invitation']['invitation_id']); ?>
						</ul>
					</div>
				</div>
			</div>

			<h3 class="anchor" id="venue">Venue Information</h3>
			<p>
				<?php echo $content['venue'] . "\n"; ?>
			</p>

			<h3 class="anchor" id="contact">Contact</h3>
			<p>
				<?php echo $content['contact'] . "\n"; ?>
			</p>

			<h3 class="anchor" id="map">Map</h3>
			<p>
				<?php echo $content['map-text']. "\n"; ?>
			</p>

			<div style="text-align: center">
				<?php
				echo "\t\t\t\t<iframe width=\"80%\" height=\"350\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"".$content['map-src']."\"></iframe>\n";
				echo "\t\t\t\t<br /><small><a href=\"".$content['map-link']."\">View Larger Map</a> </small>";
				?>
			</div>
		</div>
	</div>

	<!-- Special Catering -->
	<div class="modal fade" id="specialCatering" tabindex="-1"
		role="dialog" aria-labelledby="specialCateringLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="addFoodLabel">Special Catering</h4>
				</div>

				<div class="modal-body">
					<div id="reqBox">Loading..</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Add Food -->
	<div class="modal fade" id="addFood" tabindex="-1" role="dialog"
		aria-labelledby="addFoodLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="addFoodLabel">Add Food</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" role="form"
					<?php echo " action=\"invitation.php?id=".urlencode($data['invitation']['invitation_code'])."#food\"\n"; ?>
						id="frmAddFood" method="post">
						<input type="hidden" name="action" value="addFood" />
						<div class="form-group">
							<label for="food_name" class="col-sm-4 control-label">Food name</label>
							<div class="col-sm-8">
								<input name="food_name" type="text" class="form-control"
									id="food_name" placeholder="eg. Spaghetti Carbonara">
							</div>
						</div>
						<div class="form-group">
							<label for="food_type" class="col-sm-4 control-label">Type</label>
							<div class="col-sm-8">
								<select class="form-control" name="food_type">
									<option value="main">Main</option>
									<option value="salad">Salad</option>
									<option value="dessert">Dessert</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label for="food_desc" class="col-sm-4 control-label">Description</label>
							<div class="col-sm-8">
								<textarea name="food_desc" rows=2 class="form-control"
									style="resize: none;"
									placeholder="Creamy pasta sauce with bacon."></textarea>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-4 control-label">Extra Information</label>
							<?php
							// Left col
							echo "\t\t\t\t\t\t<div class=\"col-sm-4\"><label class=\"control-label\">Contains</label>";
							foreach($data['allergen'] as $allergen) {
								echo checkbox("allergen-".$allergen['allergen_id'], $allergen['allergen_name'], false);
							}
							echo "</div>";

							// Right col
							echo "\t\t\t\t\t\t<div class=\"col-sm-4\"><label class=\"control-label\">I'll make it</label>";
							foreach($data['requirement'] as $requirement) {
								echo checkbox("requirement-".$requirement['requirement_id'], $requirement['requirement_name'], false);
							}
							echo "</div>";
							?>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary"
						onClick="$('#frmAddFood').submit()">Add food</button>
				</div>
			</div>
		</div>
	</div>

	<?php
	/* Edit food */
	foreach($data['invitation']['food'] as $food) {
		echo "\t<div class=\"modal fade\" id=\"food-".$food['food_id']."\" tabindex=\"-1\" role=\"dialog\"" .
				"\t\taria-labelledby=\"food-".$food['food_id']."-label\" aria-hidden=\"true\">" .
				"\t\t<div class=\"modal-dialog\">" .
				"\t\t\t<div class=\"modal-content\">" .
				"\t\t\t\t<div class=\"modal-header\">" .
				"\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\"" .
				"\t\t\t\t\t\taria-hidden=\"true\">&times;</button>" .
				"\t\t\t\t\t<h4 class=\"modal-title\" id=\"food-".$food['food_id']."-label\">Edit Food</h4>" .
				"\t\t\t\t</div>" .
				"\t\t\t\t<div class=\"modal-body\">" .
				"\t\t\t\t\t<form class=\"form-horizontal\" role=\"form\" action=\"invitation.php?id=".urlencode($data['invitation']['invitation_code'])."#food\" id=\"foodfrm-".$food['food_id']."\" method=\"post\">" .
				"\t\t\t\t\t\t<input type=\"hidden\" name=\"action\" value=\"editFood\" />" .
				"\t\t\t\t\t\t<input type=\"hidden\" name=\"food_id\" value=\"".(int)$food['food_id']."\" />" .
				"\t\t\t\t\t\t<div class=\"form-group\">" .
				"\t\t\t\t\t\t\t<label for=\"food_name\" class=\"col-sm-4 control-label\">Food name</label>" .
				"\t\t\t\t\t\t\t<div class=\"col-sm-8\">" .
				"\t\t\t\t\t\t\t\t<input name=\"food_name\" type=\"text\" class=\"form-control\"" .
				"\t\t\t\t\t\t\t\t\tid=\"food_name\" value=\"".esc($food['food_name'])."\">" .
				"\t\t\t\t\t\t\t</div>" .
				"\t\t\t\t\t\t</div>";

		// Check which is selected
		$main = $salad = $dessert = "";
		if($food['food_type'] == "main") {
			$main = " selected=\"yes\"";
		}
		if($food['food_type'] == "salad") {
			$salad = " selected=\"yes\"";
		}
		if($food['food_type'] == "dessert") {
			$dessert = " selected=\"yes\"";
		}
		echo "\t\t\t\t\t\t<div class=\"form-group\">" .
				"\t\t\t\t\t\t\t<label for=\"food_type\" class=\"col-sm-4 control-label\">Type</label>" .
				"\t\t\t\t\t\t\t<div class=\"col-sm-8\">" .
				"\t\t\t\t\t\t\t\t<select class=\"form-control\" name=\"food_type\">" .
				"\t\t\t\t\t\t\t\t\t<option value=\"main\"$main>Main</option>" .
				"\t\t\t\t\t\t\t\t\t<option value=\"salad\"$salad>Salad</option>" .
				"\t\t\t\t\t\t\t\t\t<option value=\"dessert\"$dessert>Dessert</option>" .
				"\t\t\t\t\t\t\t\t</select>" .
				"\t\t\t\t\t\t\t</div>" .
				"\t\t\t\t\t\t</div>";

		echo "\t\t\t\t\t\t<div class=\"form-group\">" .
				"\t\t\t\t\t\t\t<label for=\"food_desc\" class=\"col-sm-4 control-label\">Description</label>" .
				"\t\t\t\t\t\t\t<div class=\"col-sm-8\">" .
				"\t\t\t\t\t\t\t\t<textarea name=\"food_desc\" rows=2 class=\"form-control\"" .
				"\t\t\t\t\t\t\t\t\tstyle=\"resize: none;\"" .
				"\t\t\t\t\t\t\t\t\tplaceholder=\"\">".esc($food['food_desc'])."</textarea>" .
				"\t\t\t\t\t\t\t</div>" .
				"\t\t\t\t\t\t</div>" .
				"\t\t\t\t\t\t<div class=\"form-group\">" .
				"\t\t\t\t\t\t\t<label class=\"col-sm-4 control-label\">Extra Information:</label>";

		/* Some calculations */
		$setAllergen = $setRequirement = array();
		foreach($food['allergen'] as $a) {
			$setAllergen[$a['allergen_allergen_id']] = true;
		}
		foreach($food['requirement'] as $r) {
			$setRequirement[$r['requirement_requirement_id']] = true;
		}
		
		// Allergens
		echo  "\t\t\t\t\t\t\t<div class=\"col-sm-4\"><label class=\"control-label\">Contains</label>\n";
		foreach($data['allergen'] as $allergen) {
			echo checkbox("allergen-".$allergen['allergen_id'], $allergen['allergen_name'], isset($setAllergen[$allergen['allergen_id']]));
		}
		echo "\t\t\t\t\t\t\t</div>";
		
		// Requirements
		echo  "\t\t\t\t\t\t\t<div class=\"col-sm-4\"><label class=\"control-label\">I'll make it</label>\n";
		foreach($data['requirement'] as $requirement) {
			echo checkbox("requirement-".$requirement['requirement_id'], $requirement['requirement_name'], isset($setRequirement[$requirement['requirement_id']]));
		}
		echo "\t\t\t\t\t\t\t</div>";

		echo "\t\t\t\t\t\t</div>" .
				"\t\t\t\t\t</form>" .
				"\t\t\t\t</div>" .
				"\t\t\t\t<div class=\"modal-footer\">" .
				"\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>" .
				"\t\t\t\t\t<button type=\"button\" class=\"btn btn-danger\"" .
				"\t\t\t\t\t\tonClick=\"deleteFood(".$food['food_id'].")\">Delete</button>" .
				"\t\t\t\t\t<button type=\"button\" class=\"btn btn-primary\"" .
				"\t\t\t\t\t\tonClick=\"submitFood(".$food['food_id'].")\">Save changes</button>" .
				"\t\t\t\t</div>" .
				"\t\t\t</div>" .
				"\t\t</div>" .
				"\t</div>\n";
	}

	?>

	<form style="display: none" id="foodDelete" <?php echo " action=\"invitation.php?id=".urlencode($data['invitation']['invitation_code'])."#food\"" ?> method="post">
		<input type="hidden" name="action" value="foodDel" />
		<input type="hidden" name="food_id" value="" id="delfood-id" />
	</form>
	
	<div style="padding-top: 100%">&nbsp;</div>

	<div id="footer">
		<div class="container">
			<p class="text-muted">Place sticky footer content here.</p>
		</div>
	</div>

	<script src="public/js/jquery-1.10.2.min.js"></script>
	<script src="public/js/bootstrap.min.js"></script>
	<script type="text/javascript">
	function submitDiet(id) {
		$('#' + id + '-food').modal('hide');
		$.post( "invitation.php?id=<?php echo $data['invitation']['invitation_code'] ?>", $( '#' + id + '-foodfrm' ).serialize() );
	}
	
	function showDiet(id) {
		$('#' + id + '-food').modal()
		return false;
	}

	function showFood(id) {
		$('#food-' + id).modal()
	}

	function submitFood(id) {
		$('#food-' + id).modal('hide');
		$( '#foodfrm-' + id ).submit();
	}

	function deleteFood(id) {
		if(confirm('Remove the food from the list?')) {
			$('#food-' + id).modal('hide');
			$('#delfood-id').val(id);
			$('#foodDelete').submit();
		}
	}
	
	function rsvp(id, attending) {
		$('#' + id + '-rsvp').button('loading');
		$.post("invitation.php?id=<?php echo $data['invitation']['invitation_code'] ?>", {action: 'rsvp', person_id: id, attending: attending } ).done(function( data ) {
			$('#' + id + '-rsvp').button('complete');
			if(attending) {
				$('#' + id + '-rsvp').html('Attending <span class="caret"></span>');
				$('#' + id + '-foodbtn').show();
				showDiet(id);
			} else {
				$('#' + id + '-rsvp').html('Not attending <span class="caret"></span>');
				$('#' + id + '-foodbtn').hide();
			}
		  });
	}

	function specialCatering() {
		$('#specialCatering').modal();
		$('#reqBox').load("invitation.php?id=<?php echo $data['invitation']['invitation_code'] ?>&action=specialcatering");
	}
	</script>
</body>
</html>
<?php 
function esc($inp) {
	return htmlspecialchars($inp);
}

function foodlist($data, $invitation_id) {
	if(count($data) == 0) {
		echo "<li class=\"list-group-item\">(No food listed)</li>\n";
	} else {
		foreach($data as $food) {
			echo "<li class=\"list-group-item\">" . esc($food['food_name']);
			if($invitation_id == $food['invitation_invitation_id']) {
				echo "<button style=\"float:right\" class=\"btn btn-primary btn-xs\" onClick=\"showFood(".$food['food_id'].")\"><span class=\"glyphicon glyphicon-edit\"></span> Edit</button>";
			}
			echo "</li>\n";
		}
	}
}

function checkbox($name, $content, $checked = false) {
	$c = "";
	if($checked) {
		$c = " checked=\"true\"";
	}
	return "<div class=\"checkbox\">" .
			"<label>" .
			"<input type=\"checkbox\"$c name=\"$name\"> ".esc($content) . " " .
			"</label>" .
			"</div>";
}

?>