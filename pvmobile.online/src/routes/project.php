<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

//$app = new \Slim\App;

$app->get('/api/project/{key}/{user}/{project}', function (Request $request, Response $response, $args) {
    
    $apiKey = $args['key'];
    $uid    = $args['user'];
    $pid    = $args['project'];

    $sql  = "SELECT ";
    $sql .= "ProjectRoles.RoleName, ProjectRoles.RoleDescription, ProjectRoles.PA5038, ";
    $sql .= "ProjectRoles.PA5039, ProjectRoles.PA5073 FROM ProjectUsers INNER JOIN ";
    $sql .= "ProjectRoles ON ProjectUsers.ProjectRoleID = ProjectRoles.ProjectRoleID ";
    $sql .= "WHERE (ProjectUsers.ProjectID = '".$pid."') and ";
    $sql .= "(ProjectUsers.UserID = '".$uid."') AND (ProjectUsers.Status = 10)";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $role = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        echo $sql;
        echo '("error": {"text": '.$e->getMessage().'}';

    }

    header('Content-type:application/json');
    return json_encode($role);
       
});

 