<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/locationcity/{pid}', function (Request $request, Response $response, $args) {

        //$ApiKey    = $args['apikey'];
        $ProjectID = $args['pid'];

        $sql  = "SELECT TOP (1) RTRIM(Town) AS Town FROM AddressDetails ";
        $sql .= "WHERE ProjectID = '".$ProjectID."'";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $locationcity = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        if(!empty($locationcity)){
            $locationcityj = json_encode($locationcity);
        } else {
            $locationcityj = '[{"Town":"London"}]';
        }

        return $locationcityj;  

});