<form class="form-horizontal">
	<p>These tables show the number of guests who have each dietary requirement.</p>
	<div class="form-group">
		<div class="col-sm-6">
			<h4>Allergies</h4>
			<table class="table table-striped">
			<?php 
			foreach($data['allergen'] as $allergen) {
				echo "<tr><td>".esc($allergen['allergen_name'])."</td><td>".$allergen['affected']."</td></tr>";
			}
			?>
			</table>
		</div>
		
		<div class="col-sm-6">
			<h4>Other requirements</h4>
			<table class="table table-striped">
			<?php 
			foreach($data['requirement'] as $requirement) {
				echo "<tr><td>".esc($requirement['requirement_name'])."</td><td>".$requirement['affected']."</td></tr>";
			}
			?>
			</table>
		</div>
	</div>
</form>

<?php 
function esc($inp) {
	return htmlspecialchars($inp);
}