<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="../site/favicon.ico">

<title>Event Admin</title>
<link href="../public/css/bootstrap.css" rel="stylesheet">
<link href="../public/css/sticky-footer-navbar.css" rel="stylesheet">
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
					<a class="navbar-brand" href="#">Event Admin</a>
				</div>
				<div class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li><a href="#top">Invitations</a></li>
						<li><a href="#attendees">Attendees</a></li>
						<li><a href="#food">Food labels</a></li>
					</ul>
				</div>
			</div>
		</nav>

		<div class="container">
			<?php 
			if(isset($data['message'])) {
				echo "<div class=\"alert alert-warning\">".BringAPlate::escHTML($data['message'])."</div>";
			}

			?>

			<h3 class="anchor" id="top">Invitations</h3>
			<p>Manage invite list.</p>
			<table class="table">
				<tr>
					<th>Code</th>
					<th>Family</th>
					<th>People</th>
					<th>Actions</th>
				</tr>
				<?php 
				foreach($data['invitations'] as $invitation) {
					echo "<tr>\n";
					// Code
					echo "<td><a href=\"../invitation.php?id=".$invitation['invitation_code']."\">".$invitation['invitation_code']."</a></td>\n";
					
					// Family name
					echo "<td>".BringAPlate::escHTML($invitation['invitation_name'])."</td>\n";

					// Members
					echo "<td><ul>\n";
					foreach($invitation['people'] as $person) {
						if($person['person_rsvp'] == "yes") {
							$suffix = " (attending)";
						} else if($person['person_rsvp'] == "no") {
							$suffix = " (not attending)";
						} else {
							$suffix = "";
						}
						echo "<li>".BringAPlate::escHTML($person['person_name'])."$suffix [<a href=\"javascript: void(0)\" onClick=\"delPerson(".(int)$person['person_id'].")\">x</a>]</li>";
					}
					echo "</ul></td>\n";

					// Buttons
					echo "<td><div class=\"btn-group\">" .
							"<button class=\"btn btn-primary\" onClick=\"plusOne(".(int)$invitation['invitation_id'].")\">+ 1</button>" .
							"<button class=\"btn btn-danger\" onClick=\"deleteInvite(".(int)$invitation['invitation_id'].")\">Uninvite</button>" .
							"</div></td>\n";
					echo "</tr>\n";
				}
				?>
			</table>

			<button class="btn btn-default" data-toggle="modal"
				data-target="#addFamily"><span class="glyphicon glyphicon-plus"></span> Add Family</button>
			<a href="admin.php?page=invitations" class="btn btn-default"><span class="glyphicon glyphicon-download-alt"></span> Export</a>
				

			<h3 class="anchor" id="attendees">Attendees</h3>
			<p>Only people who have said they are attending are listed here</p>
			<table class="table">
				<tr>
					<th>Family</th>
					<th>Person</th>
				</tr>
			<?php
			$count = 0;
			foreach($data['people'] as $person) {
				if($person['person_rsvp'] == "yes") {
					echo "<tr><td>".esc($person['invitation_name'])."</td><td>".esc($person['person_name'])."</td></tr>";
					$count++;
				}
			}?>
			</table>
			<p><?php echo $count ?> people attending of <?php echo count($data['people']) ?> invited.</p>
			<a href="admin.php?page=attendees" class="btn btn-default"><span class="glyphicon glyphicon-download-alt"></span> Export</a>
			
			<h3 class="anchor" id="food">Food</h3>
			<table class="table">
				<tr>
					<th>Family</th>
					<th>Type</th>
					<th>Food</th>
					<th>Description</th>
				</tr>
			<?php
			$count = 0;
			foreach($data['food'] as $food) {
				echo "<tr><td>".esc($food['invitation_name'])."</td><td>".esc($food['food_type'])."</td><td>".esc($food['food_name'])."</td><td>".esc($food['food_desc'])."</td></tr>";
				$count++;
			}?>
			<p><?php echo $count ?> dishes being brought.</p>
			</table>
			<a href="admin.php?page=food" class="btn btn-default"><span class="glyphicon glyphicon-download-alt"></span> Export</a>
		</div>
	</div>

	<div style="padding-top: 100%">&nbsp;</div>

	<div id="footer">
		<div class="container">
			<p class="text-muted">Place sticky footer content here.</p>
		</div>
	</div>

	<!-- Add Family -->
	<div class="modal fade" id="addFamily" tabindex="-1" role="dialog"
		aria-labelledby="addFamilyLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="addFamilyLabel">Add Family</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" role="form"
						action="admin.php" id="frmAddFamily" method="post">
						<input type="hidden" name="action" value="add"/>
						<div class="form-group">
							<label for="invitation_name" class="col-sm-3 control-label">Invitation name</label>
							<div class="col-sm-8">
								<input name="invitation_name" type="text" class="form-control" id="invitation_name"
									placeholder="Jones Family">
							</div>
						</div>
						<div class="form-group">
							<label for="names" class="col-sm-3 control-label">People</label>
							<div class="col-sm-8">
								<input type="text" class="form-control" id="names" name="names"
									placeholder="Alice, Bob, Carl">
							</div>
						</div>
					</form>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary"
						onClick="$('#frmAddFamily').submit()">Save changes</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->

	<!-- Plus one -->
	<div class="modal fade" id="addPerson" tabindex="-1" role="dialog"
		aria-labelledby="addPersonLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="addPersonLabel">Add Person</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" role="form"
						action="admin.php" id="frmAddPerson" method="post">
						<input type="hidden" name="action" value="addPerson"/>
						<input type="hidden" name="invitation_id" value="" id="addPerson-invitation-id"/>
						<div class="form-group">
							<label for="person_name" class="col-sm-3 control-label">Person Name</label>
							<div class="col-sm-8">
								<input name="person_name" type="text" class="form-control" id="invitation_name"
									placeholder="John">
							</div>
						</div>
					</form>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary"
						onClick="$('#frmAddPerson').submit()">Save changes</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
	
	<form style="display: none" action="admin.php" method="post" id="person-frm">
		<input type="hidden" name="action" value="" id="person-action" />
		<input type="hidden" name="person_id" value="" id="person-id" />
	</form>
	
	<form style="display: none" action="admin.php" method="post" id="invite-frm">
		<input type="hidden" name="action" value="" id="invite-action" />
		<input type="hidden" name="invitation_id" value="" id="invite-id" />
	</form>
	
	<script src="../public/js/jquery-1.10.2.min.js"></script>
	<script src="../public/js/bootstrap.min.js"></script>
	<script>
		function delPerson(personId) {
			if(confirm('Delete person?')) {
				$('#person-action').val('deletePerson');
				$('#person-id').val(personId);
				$('#person-frm').submit();
			}
		}

		function plusOne(inviteId) {
			$('#addPerson-invitation-id').val(inviteId);
			$('#addPerson').modal('show');
		}

		function deleteInvite(inviteId) {
			if(confirm('Delete invite?')) {
				$('#invite-action').val('deleteInvite');
				$('#invite-id').val(inviteId);
				$('#invite-frm').submit();
			}
		}
    </script>
</body>
</html>
<?php function esc($inp) {
	return htmlspecialchars($inp);
}?>
