<?php
class allergen_model {
	public $allergen_id;
	public $allergen_name;
	
	public static function list_all() {
		$sth = database::$dbh -> prepare("SELECT *, (select count(person_person_id) from person_has_allergy where allergen_allergen_id = allergen_id) as affected from allergen where 1");
		$sth->execute();
		return $sth->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public static function clear_person($person_id) {
		$sth = database::$dbh -> prepare("delete from person_has_allergy where person_person_id = :person_id");
		$sth->execute(array('person_id' => (int)$person_id));
	}
	
	public static function add_person_allergy($person_id, $allergen_id) {
		$sth = database::$dbh -> prepare("insert into person_has_allergy (person_person_id, allergen_allergen_id) values (:person_id, :allergen_id)");
		$sth->execute(array('person_id' => (int)$person_id, 'allergen_id' => (int)$allergen_id));
	}
}