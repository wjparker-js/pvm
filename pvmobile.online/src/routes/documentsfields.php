<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/documentsfields/{pid}', function (Request $request, Response $response, $args) {

        $ProjectID = $args['pid'];

        $sql = "SELECT DocumentNumberName, RevisionName, TitleName, RegistrationDateName, ";
        $sql.= "IssueDateName, DesignerName, DisciplineName, IssueReasonName, StatusName, ";
        $sql.= "TypeName, CurrentName from Projects where ProjectID = '".$ProjectID."'"; 
        
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $fieldnames = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $fieldnames = json_encode($fieldnames);

        return $fieldnames;  

});