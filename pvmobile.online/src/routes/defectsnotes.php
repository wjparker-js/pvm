<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/defectsnotes/{apikey}/{cid}/{did}', function (Request $request, Response $response, $args) {


$ApiKey    = $args['apikey'];
$SClientID = $args['cid'];
$DefectID  = $args['did'];

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

$sql=  "SELECT ";
$sql.= "Notes.ObjectID, Notes.DateCreated, Notes.Note, ";
$sql.= "SystemUsers.Email, SystemUsers.FirstName, SystemUsers.LastName ";
$sql.= "FROM Notes INNER JOIN SystemUsers ON Notes.OwnerID = SystemUsers.SystemUserID ";
$sql.= "where objectid = '".$DefectID."' ORDER BY Notes.DateCreated";

try{
    $dbc = new dbClient($SClientID);
    $dbc = $dbc->connectToClientDB();
    $stmt = $dbc->query($sql);
    $dnotes = $stmt->fetchALL(PDO::FETCH_OBJ);
    $dbc = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
} 

$dnotesj = json_encode($dnotes);

return $dnotesj; 

});

 
