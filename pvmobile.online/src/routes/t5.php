<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

// Needs to incorporate user role


$app->get('/api/t5/{apikey}/{user}/{pid}/{role}', function (Request $request, Response $response, $args) {

        $APIKey          = $args['apikey'];    
        $SystemUserID    = $args['user'];
        $ProjectID       = $args['pid'];
        $Role            = $args['role'];
        $newtable        = rand();

        //$sql  = "SELECT OrderStatus, DATEDIFF(day, GETDATE(), DeliverBy) AS date1 INTO Defects".$newtable." ";
        //$sql .= "FROM BranchOrders WHERE (Type = 5) AND (ProjectID = '".$ProjectID."') AND (OrderStatus <> 0) AND (OrderStatus < 54)";

//echo $Role;

        if($Role == 39) {
            $sql  = "SELECT OrderStatus, DATEDIFF(day, GETDATE(), DeliverBy) AS date1 INTO Defects".$newtable." ";
            $sql .= "FROM BranchOrders WHERE (Type = 5) AND (ProjectID = '".$ProjectID."') AND (OrderStatus <> 0) AND (OrderStatus < 54)";
        }


        if($Role == 38) {
            $sql  = "SELECT OrderStatus, DATEDIFF(day, GETDATE(), DeliverBy) AS date1 INTO Defects".$newtable." ";
            $sql .= "FROM BranchOrders WHERE (Type = 5) AND (ProjectID = '".$ProjectID."') AND (OrderStatus <> 0) AND (OrderStatus < 54) ";
            $sql .= "and (OwnerID = '".$SystemUserID."' or RecipientID = '".$SystemUserID."' or SubOwner = '".$SystemUserID."' or SubOwner2 = '".$SystemUserID."') ";
        }


        if($Role == 73) {
            $sql  = "SELECT OrderStatus, DATEDIFF(day, GETDATE(), DeliverBy) AS date1 INTO Defects".$newtable." ";
            $sql .= "FROM BranchOrders WHERE (Type = 5) AND (ProjectID = '".$ProjectID."') AND (OrderStatus <> 0) AND (OrderStatus < 54) ";
            $sql .= "and (SubOwner = '".$SystemUserID."') ";                
        }
//echo $sql;
       try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }


        $sql  = "SELECT OrderStatus, COUNT(CASE WHEN date1 < 0 THEN 1 ELSE NULL END) AS Late, ";
        $sql .= "COUNT(CASE WHEN date1 >= 0 THEN 1 ELSE NULL END) AS OK FROM Defects".$newtable." ";
        $sql .= "GROUP BY OrderStatus";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $defectcounts = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }


        $sql = "Drop table Defects".$newtable." ";         

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }
        
        $defectcountsj = json_encode($defectcounts);
        return $defectcountsj;    


});