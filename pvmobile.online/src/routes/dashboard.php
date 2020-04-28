<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/dashboard/{uid}/{pid}', function (Request $request, Response $response, $args) {
    
    $SystemUserID = $args['uid'];
    $ProjectID    = $args['pid'];

    $sql  = "SELECT ProjectRoles.D1 AS Last24Hours, ProjectRoles.D7 AS Last7Days, ProjectRoles.D14 AS Last14Days, ";
    $sql .= "ProjectRoles.D30 AS Last30Days, Projects.Name AS Project, ProjectUsers.ProjectUserID, CASE WHEN (D1Report = 1) ";
    $sql .= "THEN 1 ELSE 0 END AS D1Report, ProjectRoles.ProjectID ";

    $sql .= "FROM ProjectRoles WITH (NOLOCK) INNER JOIN ProjectUsers WITH (NOLOCK) ON ProjectRoles.ProjectRoleID = ";
    $sql .= "ProjectUsers.ProjectRoleID INNER JOIN Projects WITH (NOLOCK) ON ProjectRoles.ProjectID = ";
    $sql .= "Projects.ProjectID INNER JOIN SystemClients WITH (NOLOCK) ON Projects.SystemClientID = ";
    $sql .= "SystemClients.SystemClientID ";
    
    $sql .= "WHERE ((CAST(ProjectUsers.UserID AS varchar(50))) = '".$SystemUserID."') ";
    $sql .= "and ((CAST(Projects.ProjectID AS varchar(50))) = '".$ProjectID."') ";
    $sql .= "and (Projects.Master IS NULL OR Projects.Master = 0) AND (Projects.CompanyMaster IS NULL OR ";
    $sql .= "Projects.CompanyMaster = 0) AND (Projects.ToDelete <> 1 OR Projects.ToDelete IS NULL) AND (SystemClients.Active = 1) ";
    $sql .= "AND Projects.Status = 2 ";
    $sql .= "ORDER BY Project, Last24Hours ";
//echo $sql;
    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $stats = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        echo '("error": {"text": '.$e->getMessage().'}';
    }

    header('Content-type:application/json');
    return json_encode($stats);
    
});

 