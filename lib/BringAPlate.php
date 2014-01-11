<?php
require_once(dirname(__FILE__) . "/db/database.php"); 
class BringAPlate {
	public static function init() {
		include(dirname(__FILE__) . "/../site/config.php");
		database::init($config['database']);
	}
	
	public static function escHTML($str) {
		return htmlentities($str);
	}
	
}



?>