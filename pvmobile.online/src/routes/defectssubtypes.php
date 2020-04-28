<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/defectssubtypes/{apikey}/{pid}', function (Request $request, Response $response, $args) {

$ApiKey    = $args['apikey'];
$ProjectID = $args['pid'];

$sql  = "SELECT TypeName FROM IssueSubTypes WHERE TypeID = 5 AND ProjectID = '".$ProjectID."' ORDER BY TypeName";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $subtypes = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$subtypesj = json_encode($subtypes);

return $subtypesj;  


});



