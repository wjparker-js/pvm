<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/defectseffects/{apikey}/{pid}', function (Request $request, Response $response, $args) {

$ApiKey    = $args['apikey'];
$ProjectID = $args['pid'];

$sql  = "SELECT distinct ProjectRFIEffect.EffectID, ProjectSystemRFIEffect.EffectName,  ";
$sql .= "ProjectSystemRFIEffect.EffectDescription FROM ProjectRFIEffect LEFT  ";
$sql .= "OUTER JOIN ProjectSystemRFIEffect ON ProjectRFIEffect.EffectID =  ";
$sql .= "ProjectSystemRFIEffect.RFIEffectID WHERE ProjectRFIEffect.ProjectID = '";
$sql .= $ProjectID."' ORDER BY ProjectSystemRFIEffect.EffectName ";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $effects = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$effectsj = json_encode($effects);

return $effectsj;  


});



