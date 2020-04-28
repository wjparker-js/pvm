<?php

header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class dbClient{
    public $dbname;
    public function __construct($SClientID) {
            $this->dbname  = $SClientID;            
       }
    public function connectToClientDB(){
        $dbConnection = new PDO("sqlsrv:server=172.16.44.21; Database=".$this->dbname."", "", "");  
        $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
        return $dbConnection; 
    }
};

$uid  = $_POST['uid'];
$cid  = $_POST['cid'];
$det  = $_POST['details'];
$boid = $_POST['orderid'];


$sql = "INSERT INTO Notes (ObjectID, ObjectType, Note, OwnerID, DateCreated) values (";
$sql.= "'".$boid."',"; 
$sql.= "1,";
$sql.= "'".$det."',";  
$sql.= "'".$uid."',";
$sql.= "GETUTCDATE())"; 

try{
    $dbc = new dbClient($cid);
    $dbc = $dbc->connectToClientDB();
    $stmt = $dbc->query($sql);
    $dbc = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
} 
 


?>