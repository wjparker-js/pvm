<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

//$app = new \Slim\App;

$app->get('/api/loginprojectuserdetails/{key}/{user}', function (Request $request, Response $response, $args) {
    
    $apiKey = $args['key'];
    $uid    = $args['user'];

    $sql  = "SELECT LastArchiveID from SystemUsers where Email = '".$uid."'";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $laid = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        echo $sql;
        echo '("error": {"text": '.$e->getMessage().'}';

    }

    $pid = $laid[0]->LastArchiveID;


    $sql = "SELECT ";
    $sql.= "ProjectRoles.ProjectRoleID, ProjectRoles.ProjectID, ProjectRoles.RoleName, ";
    $sql.= "ProjectRoles.RoleDescription, ProjectRoles.Active, ProjectRoles.PA5038, ";
    $sql.= "ProjectRoles.PA5039, ProjectRoles.PA5073, Projects.Name, ProjectUsers.UserID, ProjectUsers.Email, Projects.SystemClientID  ";
    $sql.= "FROM ProjectRoles INNER JOIN Projects ON ProjectRoles.ProjectID = ";
    $sql.= "Projects.ProjectID INNER JOIN ProjectUsers ON ProjectRoles.ProjectRoleID = ";
    $sql.= "ProjectUsers.ProjectRoleID ";
    $sql.= "WHERE (ProjectRoles.ProjectID = '".$pid."') AND ";
    $sql.= "(ProjectUsers.Email = '".$uid."') ";
    $sql.= "ORDER BY ProjectRoles.ProjectID"; 
 

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $userdetails = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        //echo $sql;
        echo '("error": {"text": '.$e->getMessage().'}';

    }


    header('Content-type:application/json');
    return json_encode($userdetails);
       
});

 