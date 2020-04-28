<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/defectsreasons/{apikey}/{pid}', function (Request $request, Response $response, $args) {

$ApiKey    = $args['apikey'];
$ProjectID = $args['pid'];

$sql  = "SELECT distinct ProjectRFIReasons.ReasonID, ProjectSystemRFIReasons.ReasonName,  ";
$sql .= "ProjectSystemRFIReasons.ReasonDescription FROM ProjectRFIReasons LEFT  ";
$sql .= "OUTER JOIN ProjectSystemRFIReasons ON ProjectRFIReasons.ReasonID =  ";
$sql .= "ProjectSystemRFIReasons.RFIReasonID WHERE (ProjectRFIReasons.ProjectID = '";
$sql .= $ProjectID."') ORDER BY ProjectSystemRFIReasons.ReasonName";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $reasons = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$reasonsj = json_encode($reasons);

return $reasonsj;  

});
