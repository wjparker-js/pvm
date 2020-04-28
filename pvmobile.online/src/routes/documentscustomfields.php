<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/documentscustomfields/{pid}/{scid}', function (Request $request, Response $response, $args) {

        class dbClient{
            public $dbname;
            public function __construct($proj) {
                    $this->dbname  = $proj;            
               }
            public function connectToClientDB(){
                $dbConnection = new PDO("sqlsrv:server=172.16.44.21; Database=".$this->dbname."", "", "");  
                $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
                return $dbConnection; 
            }
        };

        $ProjectID      = $args['pid'];
        $SystemClientID = $args['scid'];

        $sql = "SELECT FieldName FROM ProjectCustomData WHERE  ProjectID = '".$ProjectID."' and FieldLength > 1 and Active = 1";

        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $stmt = $dbc->query($sql);            
            $customfields = $stmt->fetchALL(PDO::FETCH_OBJ);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        } 

        $customfields = json_encode($customfields);

        return $customfields;  

});