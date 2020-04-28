<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/discipline/{apikey}/{pid}/{did}', function (Request $request, Response $response, $args) {

        $ApiKey    = $args['apikey'];
        $ProjectID = $args['pid'];
        $DefectID  = $args['did'];


$sql  = "SELECT Distinct ";
$sql .= "ProjectRFIDesciplines.ProjectID, ProjectRFIDesciplines.DesciplineID, ";
$sql .= "ProjectSystemDisciplines.DisciplineName, ProjectSystemDisciplines.DisciplineDescription, ";
$sql .= "ProjectRFIDesciplines.GroupID, Groups.SubTypeOwner, Groups.GroupName, UserView.FullName AS OwnerName, ";
$sql .= "Groups.SubTypeContractor, Groups.SubTypeComercial, ";
$sql .= "UserView_1.FullName AS RemediatorName, UserView_2.FullName AS CommercialName, Groups.SubTypeID ";
$sql .= "FROM ProjectRFIDesciplines INNER JOIN ";
$sql .= "Groups ON ProjectRFIDesciplines.GroupID = Groups.GroupID LEFT OUTER JOIN ";
$sql .= "UserView AS UserView_2 ON Groups.SubTypeComercial = UserView_2.SystemUserID LEFT OUTER JOIN ";
$sql .= "UserView AS UserView_1 ON Groups.SubTypeContractor = UserView_1.SystemUserID LEFT OUTER JOIN ";
$sql .= "UserView ON Groups.SubTypeOwner = UserView.SystemUserID LEFT OUTER JOIN ";
$sql .= "ProjectSystemDisciplines ON ProjectRFIDesciplines.DesciplineID = ProjectSystemDisciplines.ProjectDisciplineID ";
$sql .= "WHERE (ProjectRFIDesciplines.GroupID IS NOT NULL) ";
$sql .= "and ProjectRFIDesciplines.ProjectID = '".$ProjectID."' ";
$sql .= "AND (Groups.SubTypeID in (SELECT DISTINCT SubTypeID FROM  IssueSubTypes ";
$sql .= "WHERE (TypeID = 5) AND (ProjectID = '".$ProjectID."') and (TypeName='".$DefectID."'))) ";
$sql .= "order by GroupName";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $disciplines = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $disciplinesj = json_encode($disciplines);

        return $disciplinesj;  


});