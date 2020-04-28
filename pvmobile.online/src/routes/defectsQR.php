<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/defectsqr/{apikey}/{pid}/{uid}/{segment}', function (Request $request, Response $response, $args) {

    $ApiKey    = $args['apikey'];
    $ProjectID = $args['pid'];
    $UserID    = $args['uid'];
    $segment   = $args['segment'];

    $segmentlen = strlen($segment);

    if($segmentlen == 36){

        $sql = "SELECT top(1) ";
        $sql.= "convert(varchar, BranchOrders.DateCreated, 101) as DateCreated, ";
        $sql.= "convert(varchar, BranchOrders.DateIsssued, 101) as DateIssued, ";
        $sql.= "convert(varchar, BranchOrders.DeliverBy, 101) as DeliverBy, ";
        $sql.= "convert(varchar,ProposedCompletionDate, 101) as ProposedCompletionDate, ";            
        $sql.= "convert(varchar,EndFixDate, 101) as EndFixDate, ";
        $sql.= "BranchOrders.OrderId,BranchOrders.OrderReference,BranchOrders.OrderSubject,BranchOrders.SytemOrderNumber,";
        $sql.= "BranchOrders.OrderStatus,BranchOrders.SpecialInstructions,BranchOrders.Type,ProjectLocationMap.name, ";
        $sql.= "cast(N'' as xml).value('xs:base64Binary(xs:hexBinary(sql:column(".chr(34)."RFIImages.SnapShotThumb".chr(34).")))', 'varchar(max)') as thumbbase64 ";
        $sql.= "FROM BranchOrders LEFT JOIN ";
        $sql.= "RFIImages ON BranchOrders.OrderID = RFIImages.RFIID LEFT JOIN ";
        $sql.= "ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";
        $sql.= "where BranchOrders.ProjectID = '".$ProjectID."' And BranchOrders.SytemOrderNumber = ".$segment." ";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $defects = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $defectsj = json_encode($defects);

        return $defectsj;  

    } else {

        $findme  = '-';
        $pos     = strpos($segment, $findme);    

        $LocationID = substr($segment, 0, 5);
        $LocationID = "10158";

        $sql = "SELECT ";
        $sql.= "convert(varchar, BranchOrders.DateCreated, 101) as DateCreated, ";
        $sql.= "convert(varchar, BranchOrders.DateIsssued, 101) as DateIssued, ";
        $sql.= "convert(varchar, BranchOrders.DeliverBy, 101) as DeliverBy, ";
        $sql.= "convert(varchar,ProposedCompletionDate, 101) as ProposedCompletionDate, ";            
        $sql.= "convert(varchar,EndFixDate, 101) as EndFixDate, ";
        $sql.= "BranchOrders.OrderId,BranchOrders.OrderReference,BranchOrders.OrderSubject,BranchOrders.SytemOrderNumber,";
        $sql.= "BranchOrders.OrderStatus,BranchOrders.SpecialInstructions,BranchOrders.Type,ProjectLocationMap.name, ";
        $sql.= "cast(N'' as xml).value('xs:base64Binary(xs:hexBinary(sql:column(".chr(34)."RFIImages.SnapShotThumb".chr(34).")))', 'varchar(max)') as thumbbase64 ";
        $sql.= "FROM BranchOrders LEFT JOIN ";
        $sql.= "RFIImages ON BranchOrders.OrderID = RFIImages.RFIID LEFT JOIN ";
        $sql.= "ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";
        $sql.= "where BranchOrders.ProjectID = '".$ProjectID."' And BranchOrders.LocationID = ".$LocationID;
//echo $sql;
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $defects = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $defectsj = json_encode($defects);

        return $defectsj;              

    }

});

