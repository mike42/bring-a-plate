<?php

require_once('lib/BringAPlate.php');
include('site/content.php');
BringAPlate::init();

if(isset($_REQUEST['id'])) {
	$id = $_REQUEST['id'];
	try {
		$data['invitation'] = invitation_model::get($id);
	} catch(Exception $e) {
		include(dirname(__FILE__) . "/lib/web/error-badcode.php");
		exit(0);
	}
} else {
	include(dirname(__FILE__) . "/lib/web/error-nocode.php");
	exit(0);
}
$data['allergen'] = allergen_model::list_all();
$data['requirement'] = requirement_model::list_all();
$data['food'] = food_model::list_all();

$action = "";
if(isset($_REQUEST['action'])) {
	$action = $_REQUEST['action'];
}
switch($action) {
	case 'specialcatering':
		include(dirname(__FILE__) . "/lib/web/invitation-catering.php");
		break;
	case 'json':
		echo json_encode($data);
		break;
	case 'rsvp':
		if(isset($_POST['person_id']) && isset($_POST['attending'])) {
			invitation_model::rsvp((int)$data['invitation']['invitation_id'], (int)$_POST['person_id'], $_POST['attending'] == 'true' || $_POST['attending'] == '1');
		}
		echo json_encode($data);
		break;
	case 'diet':
		// Check that this person is on the invite
		if(!isset($_POST['person_id'])) {
			break;
		}
		$ok = false;
		foreach($data['invitation']['people'] as $person) {
			if($person['person_id'] == $_POST['person_id']) {
				$ok = true;
				break;
			}
		}
		if(!$ok) {
			break;
		}
		
		$a = list_allergens_and_requirements($data);
		// Clear and re-populate
		allergen_model::clear_person($person['person_id']);
		requirement_model::clear_person($person['person_id']);
		foreach($a['allergen'] as $allergen_id) {
			allergen_model::add_person_allergy($person['person_id'], $allergen_id);
		}
		
		foreach($a['requirement'] as $requirement_id) {
			requirement_model::add_person_requirement($person['person_id'], $requirement_id);
		}
		
		echo json_encode($data);
		break;
	case "addFood":
	case 'editFood':
		try {
			if(($action == "editFood" && !isset($_POST['food_id'])) || !isset($_POST['food_name']) || !isset($_POST['food_desc']) || !isset($_POST['food_type']) || trim($_POST['food_name']) == "") {
				throw new Exception("Some information was missing. Please try again");
			}		
			$food_name = trim($_POST['food_name']);
			$food_desc = trim($_POST['food_desc']);
			switch($_POST['food_type']) {
				case 'dessert':
					$food_type = 'dessert';
					break;
				case 'salad':
					$food_type = 'salad';
					break;
				default:
					$food_type = 'main';
			}
			
			$a = list_allergens_and_requirements($data);
			
			if($action == "editFood") {
				/* Verify that food_id belongs to this invitation and update */
				$food_id = (int)$_POST['food_id'];
				$ok = false;
				foreach($data['invitation']['food'] as $food) {
					if($food['food_id'] == $food_id) {
						$ok = true;
					}
				}
				if($ok) {
					food_model::update($food_id, $data['invitation']['invitation_id'], $food_name, $food_desc, $food_type, $a['requirement'], $a['allergen']);
				}
			} else {
				food_model::add($data['invitation']['invitation_id'], $food_name, $food_desc, $food_type, $a['requirement'], $a['allergen']);
			}
			
			$data['invitation'] = invitation_model::get($id); // Re-load with changes
			$data['food'] = food_model::list_all();
			$data['message'] = "Your food has been added to the list!";
		} catch(Exception $e) {
			$data['food-message'] = $e -> getMessage();
		}
		$data['food-open'] = true;
		include(dirname(__FILE__) . "/lib/web/invitation-main.php");
		break;
	case 'foodDel':
		if(isset($_POST['food_id'])) {
			$food_id = $_POST['food_id'];
			food_model::delete($data['invitation']['invitation_id'], $food_id);
			$data['invitation'] = invitation_model::get($id); // Re-load with changes
			$data['food'] = food_model::list_all();
			$data['food-message'] = "Food item has been deleted";
			$data['food-open'] = true;
		}
		include(dirname(__FILE__) . "/lib/web/invitation-main.php");
		break;
	default:
		include(dirname(__FILE__) . "/lib/web/invitation-main.php");
}

/**
 * Pull allergens and requirements from POST data
 * 
 * @param mixed $data
 */
function list_allergens_and_requirements($data) {
	// Get list of all requirements and allergies in the DB
	$ret = array('allergen' => array(), 'requirement' => array());
	$valid_requirement = array();
	foreach($data['requirement'] as $requirement) {
		$valid_requirement[$requirement['requirement_id']] = true;
	}
	$valid_allergen = array();
	foreach($data['allergen'] as $allergen) {
		$valid_allergen[$allergen['allergen_id']] = true;
	}
	
	foreach($_POST as $foo => $val) {
		if(strpos($foo, "-") !== false) {
			$a = explode("-", $foo);
			if(count($a) == 2) {
				switch($a[0]) {
					case 'allergen':
						if(isset($valid_allergen[$a[1]])) {
							$ret['allergen'][] = (int)$a[1];
						}
						break;
					case 'requirement':
						if(isset($valid_requirement[$a[1]])) {
							$ret['requirement'][] = (int)$a[1];
						}
						break;
				}
			}
		}
	}
	return $ret;
}