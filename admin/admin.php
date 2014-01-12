<?php 
/* From: http://www.php.net/manual/en/function.str-getcsv.php#88773 and http://www.php.net/manual/en/function.str-getcsv.php#91170 */
if(!function_exists('str_putcsv'))
{
	function str_putcsv($input, $delimiter = ',', $enclosure = '"')
	{
		// Open a memory "file" for read/write...
		$fp = fopen('php://temp', 'r+');
		// ... write the $input array to the "file" using fputcsv()...
		fputcsv($fp, $input, $delimiter, $enclosure);
		// ... rewind the "file" so we can read what we just wrote...
		rewind($fp);
		// ... read the entire line into a variable...
		$data = fread($fp, 1048576);
		// ... close the "file"...
		fclose($fp);
		// ... and return the $data to the caller, with the trailing newline from fgets() removed.
		return rtrim($data, "\n");
	}
}

/* Actual admin code below */
require_once('../lib/BringAPlate.php');

BringAPlate::init();

if(isset($_POST['action'])) {
	$action = $_POST['action'];
} else {
	$action = "";
}
if(isset($_GET['page'])) {
	$page = $_GET['page'];
} else {
	$page = "";
}

switch($page) {
	case "food":
		$data['food'] = food_model::list_all(-1, false);
		header('Content-Disposition: attachment; filename="food.csv"');
		header('Content-type: text/csv');
		echo str_putcsv(array("family", "type", "food", "description")) . "\n";

		foreach($data['food'] as $food) {
			echo str_putcsv(array($food['invitation_name'], $food['food_type'], $food['food_name'], $food['food_desc'])) . "\n";
		}
		break;
	case "attendees":
		$data['people'] = invitation_model::list_people();
		header('Content-Disposition: attachment; filename="attendees.csv"');
		header('Content-type: text/csv');
		echo str_putcsv(array("family", "name", "rsvp")) . "\n";
		
		foreach($data['people'] as $person) {
			echo str_putcsv(array($person['invitation_name'], $person['person_name'], $person['person_rsvp'])) . "\n";
		}
		break;
	case "invitations":
		header('Content-Disposition: attachment; filename="invitations.csv"');
		header('Content-type: text/csv');
		
		$data['invitations'] = invitation_model::list_all();
	
		echo str_putcsv(array("code", "name", "people")) . "\n";
		foreach($data['invitations'] as $invite) {
			if(count($invite['people']) == 0) {
				$people = $invite['inviation_name'];
			} else {
				$names = array();
				foreach($invite['people'] as $person) {
					$names[] = $person['person_name'];
				}
				
				$final = array_pop($names);
				if(count($names) == 0) {
					$people = $final;
				} else {
					$first = implode(", ", $names);
					$people = $first . " and ".$final;
				}
			}
			echo str_putcsv(array($invite['invitation_code'], $invite['invitation_name'], $people)) . "\n";
		}
		break;
	default:
		if($action == "add" && isset($_POST['invitation_name']) && isset($_POST['names'])) {
			$names = explode(",", $_POST['names']);
			foreach($names as $id => $name) {
				$names[$id] = trim($name);
			}
			$invitation_name = trim($_POST['invitation_name']);
			try {
				invitation_model::add($invitation_name, $names);
			} catch(Exception $e) {
				$data['message'] = "Unable to add invitation: ".$e -> getMessage();
			}
		} else if($action == "deletePerson" && isset($_POST['person_id'])) {
			invitation_model::deletePerson($_POST['person_id']);
		} else if($action == "deleteInvite" && isset($_POST['invitation_id'])) {
			invitation_model::delete($_POST['invitation_id']);
		} else if($action == "addPerson" && isset($_POST['person_name']) && isset($_POST['invitation_id'])) {
			invitation_model::addPerson($_POST['person_name'], $_POST['invitation_id']);
		}
		
		$data['invitations'] = invitation_model::list_all();
		$data['people'] = invitation_model::list_people();
		$data['food'] = food_model::list_all(-1, false);
		include(dirname(__FILE__) . "/../lib/web/admin/admin-main.php");
}

?>
