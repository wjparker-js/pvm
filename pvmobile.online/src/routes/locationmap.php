<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/locationmap/{apikey}/{pid}/{uid}', function (Request $request, Response $response, $args) {

        $ApiKey    = $args['apikey'];
        $ProjectID = $args['pid'];
        $UserName  = $args['uid'];

        /*$sql  = "SELECT  ";
        $sql .= "Project, Plot, Floor, Type, Room, Name, L1ID, L2ID, L3ID, ";
        $sql .= "L4ID, Location, LocationImage, LocationOwnerID ";
        $sql .= "FROM viewLocationMap ";
        $sql .= "where ProjectID = '".$ProjectID."' ";
        $sql .= "order by Plot, Floor, Type, Room";*/

        $sql  = "SELECT  ";
        $sql .= "name "; //, Name+': '+Plot+' > '+Floor+' > '+Type+' > '+Room as Location ";
        $sql .= "FROM viewLocationMap ";
        $sql .= "where ProjectID = '".$ProjectID."' ";
        $sql .= "order by Plot, Floor, Type, Room";

        //echo $sql;

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $locationmaps = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
            //echo $locationmaps;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }


        $locationmapsj = json_encode($locationmaps);

        return $locationmapsj;  

});