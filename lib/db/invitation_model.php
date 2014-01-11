<?php
class invitation_model {
	public $invitation_id;
	public $invitation_code;
	public $invitation_name;
	
	public static function get($invitation_code) {
		$sth = database::$dbh -> prepare("select * from invitation where invitation_code = :invitation_code");
		$data = array('invitation_code' => $invitation_code);
		$sth->execute($data);
		$invitation = $sth->fetch(PDO::FETCH_ASSOC);
		if($invitation === false) {
			throw new Exception("Code not valid");
		}
		$sth = database::$dbh -> prepare("select * from person where family_invitation_id = :family_invitation_id order by person_id");
		$data = array('family_invitation_id' => $invitation['invitation_id']);
		$sth->execute($data);
		$invitation['people'] = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		// Get some data
		foreach($invitation['people'] as $id => $person) {
			$data = array('person_id' => $person['person_id']);
			// List allergies
			$sth = database::$dbh -> prepare("select * from person_has_allergy where person_person_id = :person_id");
			$sth->execute($data);
			$allergies = $sth->fetchAll(PDO::FETCH_ASSOC);
			$invitation['people'][$id]['allergy'] = array();
			foreach($allergies as $allergy) {
				$invitation['people'][$id]['allergy'][$allergy['allergen_allergen_id']] = true;
			}
			
			// List special requirements
			$sth = database::$dbh -> prepare("select * from person_has_requirement where person_person_id = :person_id");
			$sth->execute($data);
			$requirements = $sth->fetchAll(PDO::FETCH_ASSOC);
			$invitation['people'][$id]['requirement'] = array();
			foreach($requirements as $requirement) {
				$invitation['people'][$id]['requirement'][$requirement['requirement_requirement_id']] = true;
			}
		}
		$invitation['food'] = food_model::list_all($invitation['invitation_id']);
		
		return $invitation;
	}
	
	public static function list_all() {
		/* Get invites */
		$sth = database::$dbh -> prepare("select * from invitation where 1");
		$sth->execute();
		$invitations = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		/* Get people from invites */
		$sth = database::$dbh -> prepare("select * from person where family_invitation_id = :family_invitation_id");
		foreach($invitations as $id => $invite) {
			$data = array('family_invitation_id' => $invite['invitation_id']);
			$sth->execute($data);
			$invitations[$id]['people'] = $sth->fetchAll(PDO::FETCH_ASSOC);
		}
		return $invitations;
	}
	
	public static function list_people() {
		$sth = database::$dbh -> prepare("select * from person join invitation on family_invitation_id = invitation_id");
		$sth->execute();
		$people = $sth->fetchAll(PDO::FETCH_ASSOC);
		return $people;
	}
	
	public static function add($invitation_name, array $people) {
		/* Add invitation */
		$invitation_code = self::rndStr(5);
		$data = array('invitation_code' => $invitation_code, 'invitation_name' => $invitation_name);
		$sth = database::$dbh -> prepare("insert into invitation (invitation_code, invitation_name) values (:invitation_code, :invitation_name)");
		$sth -> execute($data);
		$family_invitation_id = database::$dbh -> lastInsertId();
		if($family_invitation_id == 0) {
			throw new Exception("Invitation name must be unique!");
		}
		
		/* Add people to invitation */
		$sth = database::$dbh -> prepare("insert into person (person_name, family_invitation_id) values (:person_name, :family_invitation_id)");
		foreach($people as $person_name) {
			$data = array('person_name' => $person_name, 'family_invitation_id' => $family_invitation_id);
			$sth -> execute($data);
		}
	}
	
	private static function rndStr($len = 64) {
		$randomData = file_get_contents('/dev/urandom', false, null, 0, $len) . uniqid(mt_rand(), true);
		$str = substr(str_replace(array('/','=','+'),'', base64_encode($randomData)), 0, $len);
		return $str;
	}
	
	public static function delete($invitation_id) {
		
		/* Delete all people and then the invite */
		$sth = database::$dbh -> prepare("select * from person where family_invitation_id = :family_invitation_id");
		$data = array('family_invitation_id' => $invitation_id);
		$sth -> execute($data);
		$people = $sth->fetchAll(PDO::FETCH_ASSOC);
		foreach($people as $person) {
			self::deletePerson($person['person_id']);
		}
		
		/* Clear food */
		$data = array('invitation_id' => $invitation_id);
		$sth = database::$dbh -> prepare("delete food_has_allergen from food_has_allergen join food on food_id = food_food_id where invitation_invitation_id = :invitation_id");
		$sth -> execute($data);
		$sth = database::$dbh -> prepare("delete food_meets_requirement from food_meets_requirement join food on food_id = food_food_id where invitation_invitation_id = :invitation_id");
		$sth -> execute($data);
		$sth = database::$dbh -> prepare("delete from food where invitation_invitation_id = :invitation_id");
		$sth -> execute($data);
		
		/* Delete actual invite */
		$sth = database::$dbh -> prepare("delete from invitation where invitation_id = :invitation_id");
		$sth -> execute($data);
		
	}
	
	public static function rsvp($invitation_id, $person_id, $attending) {
		$sth = database::$dbh -> prepare("update person set person_rsvp = :rsvp where family_invitation_id = :family_invitation_id and person_id = :person_id");
		$data = array('family_invitation_id' => $invitation_id, 'person_id' => $person_id, 'rsvp' => ($attending ? 'yes' : 'no'));
		$sth -> execute($data);
	}
	
	public static function deletePerson($person_id) {
		$sth = database::$dbh -> prepare("delete from person_has_allergy where person_person_id = :person_person_id");
		$data = array('person_person_id' => $person_id);
		$sth -> execute($data);
		
		$sth = database::$dbh -> prepare("delete from person_has_requirement where person_person_id = :person_person_id");
		$data = array('person_person_id' => $person_id);
		$sth -> execute($data);
		
		$sth = database::$dbh -> prepare("delete from person where person_id = :person_id");
		$data = array('person_id' => $person_id);
		$sth -> execute($data);
		return true;
	}
	
	public static function addPerson($person_name, $family_invitation_id) {
		$sth = database::$dbh -> prepare("insert into person (person_name, family_invitation_id) values (:person_name, :family_invitation_id)");
		$data = array('person_name' => $person_name, 'family_invitation_id' => $family_invitation_id);
		$sth -> execute($data);
	}
}

