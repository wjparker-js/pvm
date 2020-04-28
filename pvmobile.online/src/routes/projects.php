<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

//$app = new \Slim\App;

$app->get('/api/projects/{key}', function (Request $request, Response $response, $args) {
    
    $apiKey = $args['key'];

    $sql  = "SELECT DISTINCT ProjectUsers.ProjectID, Projects.Name AS ProjectName, Projects.Client, Projects.SystemClientID,";
    $sql .= "'https://go.projectvaultuk.com/publiclogos/' + CONVERT(nvarchar(50), ProjectUsers.ProjectID) + '.png' AS Thumbnail, ";
    $sql .= "Projects.SystemClientID,Projects.FormPlotFlatName, Projects.FormFloorLevelName, Projects.FormFlatTypeName, Projects.FormComponentName, ";
    $sql .= "Projects.FormJobNumberName, Projects.FormPackageTitleName, Projects.FromSubContractorName, Projects.JobNumberValue ";
    $sql .= "FROM ProjectUsers INNER JOIN Projects ON ProjectUsers.ProjectID = Projects.ProjectID RIGHT OUTER JOIN ";
    $sql .= "APIKey ON ProjectUsers.UserID = APIKey.SystemUserID ";
    $sql .= "WHERE (ProjectUsers.Status = 10) AND (APIKey.ValidUntil > ";
    $sql .= "getutcdate()) AND (APIKey.KeyID = '$apiKey') and Projects.Status = 2 ORDER BY ProjectName";

    //echo $sql;

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $users = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        echo '("error": {"text": '.$e->getMessage().'}';
    }


    header('Content-type:application/json');
    return json_encode($users);
});

 