<?php
class food_model {
	public static function list_all($invitation_id = -1, $merge = true) {
		/* Select all food or just food for one invitation */
		if($invitation_id >= 0) {
			$sth = database::$dbh -> prepare("select * from food join invitation on invitation_id = invitation_invitation_id where invitation_invitation_id = :invitation_id order by food_name");
			$sth->execute(array('invitation_id' => $invitation_id));
		} else {
			$sth = database::$dbh -> prepare("select * from food join invitation on invitation_id = invitation_invitation_id where 1 order by food_name");
			$sth->execute();
		}
		
		$allfood = $sth->fetchAll(PDO::FETCH_ASSOC);
		foreach($allfood as $key => $item) {
			$data = array("food_id" => $item['food_id']);
			$sth = database::$dbh -> prepare("select * from food_has_allergen where food_food_id = :food_id");
			$sth->execute($data);
			$allfood[$key]['allergen'] = $sth->fetchAll(PDO::FETCH_ASSOC);
			
			$sth = database::$dbh -> prepare("select * from food_meets_requirement where food_food_id = :food_id");
			$sth->execute($data);
			$allfood[$key]['requirement'] = $sth->fetchAll(PDO::FETCH_ASSOC);
		}
		
		if($invitation_id >= 0 || !$merge) {
			return $allfood;
		}
		
		/* Partition into food types */
		$food = array("main" => array(), "dessert" => array(), "salad" => array());
		foreach($allfood as $item) {
			$food[$item['food_type']][] = $item;
		}
		return $food;
	}
	
	public static function add($invitation_id, $food_name, $food_desc, $food_type, array $requirement_ids, array $allergen_ids) {
		$sth = database::$dbh -> prepare("insert into food (food_name, food_desc, invitation_invitation_id, food_type) VALUES (:food_name, :food_desc, :invitation_id, :food_type);");
		$sth->execute(array('food_name' => $food_name, 'food_desc' => $food_desc, 'food_type' => $food_type, 'invitation_id' => $invitation_id));
		$food_id = database::$dbh -> lastInsertId();
		
		self::populateAllergenRequirement($food_id, $requirement_ids, $allergen_ids);
	}
	
	public static function update($food_id, $invitation_id, $food_name, $food_desc, $food_type, array $requirement_ids, array $allergen_ids) {
		/* Clear allergies */
		self::clearAllergenRequirement($invitation_id, $food_id);
		self::populateAllergenRequirement($food_id, $requirement_ids, $allergen_ids);
		
		$sth = database::$dbh -> prepare("update food set food_name = :food_name, food_desc = :food_desc, food_type = :food_type WHERE food_id = :food_id");
		$data = array('food_id' => $food_id, 'food_name' => $food_name, 'food_desc' => $food_desc, 'food_type' => $food_type);
		$sth -> execute($data);
	}	
		
	public static function delete($invitation_id, $food_id) {
 		self::clearAllergenRequirement($invitation_id, $food_id);
 		$data = array('food_id' => $food_id, 'invitation_id' => $invitation_id);
 		$sth = database::$dbh -> prepare("delete from food where invitation_invitation_id = :invitation_id and food_id = :food_id");
 		$sth -> execute($data);
	}
	
	private static function clearAllergenRequirement($invitation_id, $food_id) {
		$data = array('food_id' => $food_id, 'invitation_id' => $invitation_id);
		$sth = database::$dbh -> prepare("delete food_has_allergen from food_has_allergen join food on food_id = food_food_id where invitation_invitation_id = :invitation_id and food_id = :food_id");
		$sth -> execute($data);
		$sth = database::$dbh -> prepare("delete food_meets_requirement from food_meets_requirement join food on food_id = food_food_id where invitation_invitation_id = :invitation_id and food_id = :food_id");
		$sth -> execute($data);
	}
	
	private static function populateAllergenRequirement($food_id, array $requirement_ids, array $allergen_ids) {
		foreach($requirement_ids as $requirement_id) {
			$sth = database::$dbh -> prepare("insert into food_meets_requirement (food_food_id, requirement_requirement_id) VALUES (:food_id, :requirement_id);");
			$sth->execute(array('food_id' => $food_id, 'requirement_id' => $requirement_id));
		}
		
		foreach($allergen_ids as $allergen_id) {
			$sth = database::$dbh -> prepare("insert into food_has_allergen (food_food_id, allergen_allergen_id) VALUES (:food_id, :allergen_id);");
			$sth->execute(array('food_id' => $food_id, 'allergen_id' => $allergen_id));
		}
	}
}