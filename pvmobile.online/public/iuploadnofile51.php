<?php

header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//////////////////////////////////////////////////////////////////////////////////////
$current_timestamp = date('Y-m-d H:i:s');
$deliver_by_date   = date('Y-m-d',strtotime("+7 days"));

$api  = $_POST['api'];
$cid  = $_POST['cid'];
$det  = $_POST['details'];
$snag = $_POST['snagid'];
$pimg = $_POST['postimg'];
$boid = $_POST['orderid'];
$uid  = $_POST['uid'];
$pid  = $_POST['pid'];

//////////////////////////////////////////////////////////////////////////////////////
class db{
    public function connect(){
        $dbConnection = new PDO("sqlsrv:Server=172.16.44.21; Database=PV", "", "");  
        $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
        return $dbConnection; 
    }       
}

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

//////////////////////////////////////////////////////////////////////////////////////
$sql = "UPDATE BranchOrders set LastModified = GETUTCDATE(), EndFixDate = GETUTCDATE(), EndFixDateTxt = '".$det."',OrderStatus = -52 ";
$sql.= "WHERE SytemOrderNumber = ".$snag;

try{
    $db = new db();
    $db = $db->connect();  
    $statement = $db->prepare($sql);
    $statement->execute();
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}


//////////////////////////////////////////////////////////////////////////////////////
$sql = "SELECT Email, FirstName, LastName FROM SystemUsers where SystemUserID = '".$uid."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $user = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$UserId    = trim($user[0]->Email);
$FirstName = trim($user[0]->FirstName);
$LastName  = trim($user[0]->LastName);

/////////////////////////////////////////////////////////////////////////////////////
/*
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
*/

////////////////////PreImage///////////////////////////////////////////////////////////////////
$uploadPath = "//filesrv-1/websites/SV/projectvaultuk.com/PublicPics/";

$pimg  = substr($pimg, strpos($pimg, ',') + 1);
$pimg  = base64_decode($pimg);
$ptype = "jpg";

$target_path = $uploadPath.$cid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/".$pid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/"."DFX";
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/".$boid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$posttarget_path = $target_path."/".$boid."post.".$ptype;

file_put_contents($posttarget_path , $pimg);


?>