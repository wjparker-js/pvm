<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/getmydefects/{apikey}/{pid}/{uid}', function (Request $request, Response $response, $args) {

$ApiKey = $args['apikey'];
$pid    = $args['uid'];
$uid    = $args['pid'];

$sql  = "SELECT * from branchorders where projectid = '".$pid."' and Type = 5 and ";
$sql .= "(OwnerID = '".$uid."' or  RecipientID = '".$uid."' or SubOwner = '".$uid."' or SubOwner2 = '".$uid."') ";
$sql .= "ORDER BY SystemOrderNumber desc ";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $defects = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$defectsj = json_encode($defects);

return $defectsj;  


});



