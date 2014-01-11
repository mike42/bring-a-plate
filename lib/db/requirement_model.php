<?php
class requirement_model {
	public $requiremnet_id;
	public $requirement_name;
	
	public static function list_all() {
		$sth = database::$dbh -> prepare("SELECT *, (select count(person_person_id) from person_has_requirement where requirement_requirement_id = requirement_id) as affected from requirement where 1");
		$sth->execute();
		return $sth->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public static function clear_person($person_id) {
		$sth = database::$dbh -> prepare("delete from person_has_requirement where person_person_id = :person_id");
		$sth->execute(array('person_id' => (int)$person_id));
	}
	
	public static function add_person_requirement($person_id, $requirement_id) {
		$sth = database::$dbh -> prepare("insert into person_has_requirement (person_person_id, requirement_requirement_id) values (:person_id, :requirement_id)");
		$sth->execute(array('person_id' => (int)$person_id, 'requirement_id' => (int)$requirement_id));
	}
}