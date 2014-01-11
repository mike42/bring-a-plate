<?php 
require_once(dirname(__FILE__) . "/invitation_model.php");
require_once(dirname(__FILE__) . "/allergen_model.php");
require_once(dirname(__FILE__) . "/requirement_model.php");
require_once(dirname(__FILE__) . "/food_model.php");

class database {
	public static $dbh;
	
	public static function init($config) {
		$db = $config['db'];
		$host = $config['host'];
		self::$dbh = new PDO("mysql:dbname=$db;host=$host", $config['user'], $config['pass']);
	}
}
?>