<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/groups/{apikey}/{pid}/{group}', function (Request $request, Response $response, $args) {

        $ApiKey    = $args['apikey'];
        $ProjectID = $args['pid'];
        $Group     = $args['group'];


        if($Group == "1"){
            //SELECT GroupName FROM  Groups where ProjectID = '7BC6A3AE-ADA5-4BB4-916F-8CAE42FDD027' and GroupName is not Null and GroupName <> '' ORDER BY GroupName
            $sql  = "SELECT GroupName FROM  Groups where ProjectID = '".$ProjectID."' and GroupName is not Null and GroupName <> '' ORDER BY GroupName";

            try{
                $db = new db();
                $db = $db->connect();
                $stmt = $db->query($sql);
                $groups = $stmt->fetchALL(PDO::FETCH_OBJ);
                $db = null;
            } catch(PDOException $e){
                echo '("error": {"text": '.$e->getMessage().'}';
            }

            $groupsj = json_encode($groups);

            return $groupsj;  

        } 


        if($Group != "1"){

            $sql1 = "SELECT RTRIM(Email) AS Email, RTRIM(FirstName) AS PFirstName, RTRIM(LastName) AS PLastName FROM SystemUsers WHERE (SystemUserID IN (SELECT MemberID FROM GroupMembers WHERE (GroupID IN (SELECT GroupID FROM Groups WHERE ProjectID = '".$ProjectID."' and (GroupName = '".$Group."'))))) order by PLastName, PFirstName";
  
            try{
                //echo $sql1; 
                $db = new db();
                $db = $db->connect();
                $stmt = $db->query($sql1);
                $groupcontacts = $stmt->fetchALL(PDO::FETCH_OBJ);
                $db = null;
            } catch(PDOException $e){
                echo '("error": {"text": '.$e->getMessage().'}';
            }

            $groupcontactsj = json_encode($groupcontacts);

            return $groupcontactsj;             
            
            
        }     


});

