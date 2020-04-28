<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/writeaudit/{apikey}/{uid}/{pid}/{eid}/{aid}/{atx}', function (Request $request, Response $response, $args) {

    //91  Mobile - Viewed Drawing
    //95  Mobile - Emailed Drawing
    //96  Mobile - Logged In
    //97  Mobile - Phone Call
    //98  Mobile - Changed Project
    //set up writing the apikey

    class dbAudit{
        public $dbname;
        public function __construct($proj) {
                $this->dbname  = $proj;            
        }
        public function connect(){
            $dbConnection = new PDO("sqlsrv:server=172.16.44.21; Database=".$this->dbname."", "", "");  
            $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
            return $dbConnection; 
        }
    };

    $utc_str         = gmdate("M d Y H:i:s", time());
    $SystemUserID    = $args['uid'];
    $ProjectID       = $args['pid'];
    $EntityID        = $args['eid'];
    $ActionID        = $args['aid'];
    $ActionText      = $args['atx'];

    $sql = "SELECT SystemClientID from Projects where Status = '2' and ProjectID = '".$ProjectID."'";
    
    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $SysCID = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        echo '("error": {"text": '.$e->getMessage().'}';
    }
    
    $SystemClientID   = $SysCID[0]->SystemClientID;

    
  
    $sql  = "INSERT INTO audit(EntityID, SystemUserID, ActionID, ActionDate, ActionText, PrivateAction) VALUES ";
    $sql .= "(CAST('$EntityID' AS UNIQUEIDENTIFIER) ,CAST('$SystemUserID' AS UNIQUEIDENTIFIER) ,'$ActionID','$utc_str','$ActionText', 0)";

    try{
        $db = new dbAudit($SystemClientID);
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute(); 
        $db = null;
        echo "Audit Written.";
    } catch(PDOException $e){
        echo '("error": {"text": '.$e->getMessage().'456}';
    }


});
