<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/defects/{apikey}/{pid}/{uid}/{search}/{segment}/{role}', function (Request $request, Response $response, $args){

    $ApiKey    = $args['apikey'];
    $ProjectID = $args['pid'];
    $UserID    = $args['uid'];
    $Search    = $args['search'];
    $Segment   = $args['segment'];
    $Role      = $args['role'];


    if($Search == "nosearch"){
        $SearchCondition = "";
        } else {
        $SearchCondition = " and (";
        $SearchCondition.= "ProjectLocationMap.name like '%".$Search."%' or " ;
        $SearchCondition.= "BranchOrders.OrderReference like '%".$Search."%' or " ;
        $SearchCondition.= "BranchOrders.OrderSubject like '%".$Search."%' or " ;
        $SearchCondition.= "BranchOrders.SpecialInstructions like '%".$Search."%') " ;
    }

    $roleAccess  = " and (BranchOrders.Recipientid = '".$UserID."' or ";
    $roleAccess .= " BranchOrders.OwnerID    = '".$UserID."' or ";
    $roleAccess .= " BranchOrders.SubOwner    = '".$UserID."' or ";
    $roleAccess .= " BranchOrders.SubOwner2   = '".$UserID."') ";


    if($Segment !== "undefined" && $Segment !== "1" && $Segment !== "2" && $Segment !== "3" && $Segment !== "50" && $Segment !== "51" && $Segment !== "52" && $Segment !== "53" && $Segment !== "54" && $Segment !== "55"  && $Segment !== "xxx"  && $Segment !== "nosearchsummary" && $Segment !== "snaglocationsticker" && $Segment !== "snaglocationpage" && $Segment !== "sticker" && $Segment !== "room"){

/*
        $sql = "SELECT SubOwner2 FROM BranchOrders where BranchOrders.SytemOrderNumber = ".$Segment;

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $sub2 = $stmt->fetchALL(PDO::FETCH_OBJ);
            if ($sub2->rowCount() > 0) {
              $gotQS = "T";
            } else {
              $gotQS = "F";
            }
            $db = null;
            } catch(PDOException $e){
                echo '("error": {"text": '.$e->getMessage().'}';
            }

*/

        $sql = "SELECT top(1) ";
        $sql.= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated, ";
        $sql.= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql.= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql.= "convert(varchar,ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql.= "convert(varchar,EndFixDate, 106) as EndFixDate, ";
        $sql.= "ProjectLocationMap.name,  ";
        $sql.= "BranchOrders.OrderId, BranchOrders.pairedid, ";
        $sql.= "BranchOrders.OrderReference, DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql.= "BranchOrders.OrderSubject, ";
        $sql.= "BranchOrders.SytemOrderNumber,";
        $sql.= "BranchOrders.OrderStatus, ";
        $sql.= "BranchOrders.SpecialInstructions, ";
        $sql.= "BranchOrders.Type, ";
        $sql.= "BranchOrders.OwnerID, "; 
        $sql.= "BranchOrders.RecipientID, ";
        $sql.= "BranchOrders.SubOwner, ";

        //if($gotQS == "T"){$sql.= "BranchOrders.SubOwner2, ";}
        
        $sql.= "BranchOrderStatus.Status as StatusText,";

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt,";

        $sql .= "   CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";

        $sql.= "SystemUsers.Email as OwnerEmail, ";
        $sql.= "SystemUsers_1.Email InspectorEmail, ";
        $sql.= "SystemUsers_2.Email AS SubbyEmail, ";
        //$sql.= "SystemUsers_3.Email AS QSEmail, ";

        $sql.= "cast(N'' as xml).value('xs:base64Binary(xs:hexBinary(sql:column(".chr(34)."RFIImages.SnapShotThumb".chr(34).")))', 'varchar(max)') as thumbbase64 ";
        
        $sql.= "FROM BranchOrders ";
        $sql.= "LEFT  JOIN RFIImages ON BranchOrders.OrderID = RFIImages.RFIID ";
        $sql.= "LEFT  JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";
        $sql.= "INNER JOIN BranchOrderStatus ON BranchOrders.OrderStatus = BranchOrderStatus.AuditID ";

        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID ";
        $sql.= "INNER JOIN SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID ";
        
        //if($gotQS == "T"){
        //    $sql.= "INNER JOIN SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID  ";
       // }

        $sql.= "INNER JOIN SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql.= "where BranchOrders.SytemOrderNumber = ".$Segment;
        //if($Role != 39){$sql.= $roleAccess;} 
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


    if($Segment == "1"){

        $sql  = "SELECT BranchOrders.OrderId,";
        
        $sql .= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated,";
        $sql .= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql .= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql .= "convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql .= "convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate, ";        
        $sql .= "ProjectLocationMap.name,  ";
        $sql .= "BranchOrders.OrderId, BranchOrders.pairedid,  ";
        $sql .= "BranchOrders.OrderReference, DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql .= "BranchOrders.OrderStatus, ";

        $sql .= "CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";

        $sql .= "BranchOrders.OrderSubject, ";
        $sql .= "left(BranchOrders.SpecialInstructions,20) + '...' as SpecialInstructions, ";
        $sql .= "BranchOrders.SytemOrderNumber, ";

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt ";


        //$sql.= "SystemUsers.Email as OwnerEmail, SystemUsers_1.Email InspectorEmail, ";
        //$sql.= "SystemUsers_2.Email AS SubbyEmail, SystemUsers_3.Email AS QSEmail ";

        $sql .= "From BranchOrders INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";

        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID  ";
        //$sql.= "SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID INNER JOIN ";
        //$sql.= "SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID INNER JOIN ";
        //$sql.= "SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql .= "Where BranchOrders.ProjectID = '".$ProjectID."' And ";
        $sql .= "BranchOrders.Type = '5' and (BranchOrders.OrderStatus = 50) ".$SearchCondition;        
        if($Role != 39){$sql.= $roleAccess;} 
        $sql .= "order by BranchOrders.OrderStatus, BranchOrders.TypeOrderNumber desc";
        //echo $sql;
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $defects  = $stmt->fetchALL(PDO::FETCH_OBJ); 
            //print_r($defects);
            $db = null;  
        } catch(PDOException $e){
            echo '("Defects Segment 1 error": {"text": '.$e->getMessage().'}';
        }
            
        $defectsj = json_encode($defects);
        return $defectsj;

    }    


    if($Segment == "2"){

        $sql  = "SELECT BranchOrders.OrderId,";
        $sql .= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated,";
        $sql .= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql .= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql .= "convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql .= "convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate, ";        
        $sql .= "ProjectLocationMap.name,  ";
        $sql .= "BranchOrders.OrderId, BranchOrders.pairedid,  ";
        $sql .= "BranchOrders.OrderReference,  DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql .= "BranchOrders.OrderStatus, "; 

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt,";


        $sql .= "   CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";

        $sql .= "BranchOrders.OrderSubject, ";
        $sql .= "BranchOrders.SytemOrderNumber ";


        //$sql.= "SystemUsers.Email as OwnerEmail, SystemUsers_1.Email InspectorEmail, ";
        //$sql.= "SystemUsers_2.Email AS SubbyEmail, SystemUsers_3.Email AS QSEmail ";

        $sql .= "From BranchOrders INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";

        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID  ";
        //$sql.= "SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID INNER JOIN ";
        //$sql.= "SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID INNER JOIN ";
        //$sql.= "SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql .= "Where BranchOrders.ProjectID = '".$ProjectID."' And ";
        $sql .= "BranchOrders.Type = 5 and BranchOrders.OrderStatus = 51 ".$SearchCondition;
        if($Role != 39){$sql.= $roleAccess;}
        $sql .= " order by BranchOrders.OrderStatus, BranchOrders.TypeOrderNumber desc";
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

    if($Segment == "3"){

        $sql  = "SELECT BranchOrders.OrderId,";

        $sql .= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated,";
        $sql .= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql .= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql .= "convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql .= "convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate, ";
        $sql .= "ProjectLocationMap.name,  ";
        $sql .= "BranchOrders.OrderId, BranchOrders.pairedid,  ";
        $sql .= "BranchOrders.OrderReference, DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql .= "BranchOrders.OrderStatus, "; 

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt,";


        $sql .= "   CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";


        $sql .= "BranchOrders.OrderSubject, ";
        $sql .= "left(BranchOrders.SpecialInstructions,20) + '...' as SpecialInstructions, ";
        $sql .= "BranchOrders.SytemOrderNumber ";


        //$sql.= "SystemUsers.Email as OwnerEmail, SystemUsers_1.Email InspectorEmail, ";
        //$sql.= "SystemUsers_2.Email AS SubbyEmail, SystemUsers_3.Email AS QSEmail ";

        $sql .= "From BranchOrders INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";

        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID  ";
        //$sql.= "SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID INNER JOIN ";
        //$sql.= "SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID INNER JOIN ";
        //$sql.= "SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql .= "Where BranchOrders.ProjectID = '".$ProjectID."' And ";
        $sql .= "BranchOrders.Type = '5' and (BranchOrders.OrderStatus > 51 and BranchOrders.OrderStatus < 57) ".$SearchCondition; // or BranchOrders.OrderStatus = 54 or BranchOrders.OrderStatus = 55
        if($Role != 39){$sql.= $roleAccess;}
        $sql .= " order by BranchOrders.OrderStatus, BranchOrders.TypeOrderNumber desc";
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

    if($Segment == "xxx"){

        $sql  = "SELECT distinct BranchOrders.OrderId,";
        $sql .= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated,";
        $sql .= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql .= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql .= "convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql .= "convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate, ProjectLocationMap.name,  ";
        $sql .= "BranchOrders.OrderId, BranchOrders.pairedid,  ";
        $sql .= "BranchOrders.OrderReference, DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql .= "BranchOrders.OrderStatus, "; 

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt,";


        $sql .= "   CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";

        $sql .= "BranchOrders.OrderSubject, ";
        $sql .= "left(BranchOrders.SpecialInstructions,20) + '...' as SpecialInstructions, ";
        $sql .= "BranchOrders.SytemOrderNumber, BranchOrders.TypeOrderNumber, ";

        $sql.= "SystemUsers.Email as OwnerEmail, SystemUsers_1.Email InspectorEmail, ";
        $sql.= "SystemUsers_2.Email AS SubbyEmail, SystemUsers_3.Email AS QSEmail ";

        $sql .= "From BranchOrders INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";

        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql .= "Where BranchOrders.ProjectID = '".$ProjectID."' And ";
        $sql .= "BranchOrders.Type = '5' and (BranchOrders.OrderStatus = 52 or BranchOrders.OrderStatus = 51 or BranchOrders.OrderStatus = 50 or BranchOrders.OrderStatus = 53 or BranchOrders.OrderStatus = 54 or BranchOrders.OrderStatus = 55) ".$SearchCondition;
        if($Role != 39){$sql.= $roleAccess;}
        $sql .= " order by BranchOrders.TypeOrderNumber desc";



        //$sql .= "From BranchOrders INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";
        //$sql .= "Where BranchOrders.ProjectID = '".$ProjectID."' And ";
        //$sql .= "BranchOrders.Type = '5' and (BranchOrders.OrderStatus = 52 or BranchOrders.OrderStatus = 51 or BranchOrders.OrderStatus = 50) ".$SearchCondition." order by BranchOrders.TypeOrderNumber desc";

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


    if($Search == "nosearchsummary"){

        $sql  = "SELECT distinct BranchOrders.OrderId,";
        $sql .= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated,";
        $sql .= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql .= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql .= "convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql .= "convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate,  ProjectLocationMap.name, ";
        $sql .= "BranchOrders.OrderId, BranchOrders.pairedid, DATEDIFF(day, DeliverBy, getutcdate()) AS oklate, ";
        $sql .= "BranchOrders.OrderReference, DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql .= "BranchOrders.OrderStatus, "; 

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt,";


        $sql .= "   CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";

        $sql .= "BranchOrders.OrderSubject, ";
        $sql .= "left(BranchOrders.SpecialInstructions,20) + '...' as SpecialInstructions, ";
        $sql .= "BranchOrders.SytemOrderNumber, BranchOrders.TypeOrderNumber ";

        //$sql.= "SystemUsers.Email as OwnerEmail, SystemUsers_1.Email InspectorEmail, ";
        //$sql.= "SystemUsers_2.Email AS SubbyEmail, SystemUsers_3.Email AS QSEmail ";

        $sql.= "From BranchOrders ";
        $sql.= "INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";
        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID ";
        //$sql.= "INNER JOIN SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID ";
        //$sql.= "INNER JOIN SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID ";
        //$sql.= "INNER JOIN SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql .= "Where BranchOrders.ProjectID = '".$ProjectID."' And ";
        $sql .= "BranchOrders.Type = '5' and (BranchOrders.OrderStatus = ".$Segment.")";
        if($Role != 39){$sql.= $roleAccess;}
        $sql .= " order by oklate";
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




    if($Segment == "snaglocationsticker"){

        $sql = "SELECT ProjectLocationMap.Name, BranchOrders.LocationID From BranchOrders ";
        $sql.= "INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";
        $sql.= "where BranchOrders.pairedid = '".$Search."' and  BranchOrders.ProjectID = '".$ProjectID."' ";


        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $loc = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            $loc =  '("error": {"text": '.$e->getMessage().'}';
        }

        $locj = json_encode($loc);

        return $locj;  
    }



    if($Segment == "snaglocationpage"){

        $sql  = "Select Name From viewLocationMap Where LocationMapID = '".$Search."'";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $location = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $locationj = json_encode($location);

        return $locationj;  
    }



    if($Segment == "sticker"){

        $sql  = "SELECT distinct BranchOrders.OrderId,";
        $sql .= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated,";
        $sql .= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql .= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql .= "convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql .= "convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate,  ProjectLocationMap.name, ";
        $sql .= "BranchOrders.OrderId, BranchOrders.pairedid,  ";
        $sql .= "BranchOrders.OrderReference, DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql .= "BranchOrders.OrderStatus, "; 

        $sql .= "   CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";

        $sql .= "BranchOrders.OrderSubject, ";

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt,";

        $sql .= "left(BranchOrders.SpecialInstructions,20) + '...' as SpecialInstructions, ";
        $sql .= "BranchOrders.SytemOrderNumber, BranchOrders.TypeOrderNumber, ";

        $sql.= "SystemUsers.Email as OwnerEmail, SystemUsers_1.Email InspectorEmail, ";
        $sql.= "SystemUsers_2.Email AS SubbyEmail, SystemUsers_3.Email AS QSEmail ";

        $sql .= "From BranchOrders INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";

        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql .= "Where BranchOrders.pairedid = '".$Search."' and  BranchOrders.ProjectID = '".$ProjectID."' ";
        if($Role != 39){$sql.= $roleAccess;}        
        $sql .= "order by BranchOrders.TypeOrderNumber desc";

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



    if($Segment == "room"){

        $sql  = "SELECT distinct BranchOrders.OrderId,";
        $sql .= "convert(varchar, BranchOrders.DateCreated, 106) as DateCreated,";
        $sql .= "convert(varchar, BranchOrders.DateIsssued, 106) as DateIssued, ";
        $sql .= "convert(varchar, BranchOrders.DeliverBy, 106) as DeliverBy, ";
        $sql .= "convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate, ";            
        $sql .= "convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate,  ProjectLocationMap.name, ";
        $sql .= "BranchOrders.OrderId, ";
        $sql .= "BranchOrders.OrderReference, BranchOrders.pairedid, ";
        $sql .= "BranchOrders.OrderStatus, DATEDIFF(day, GETDATE(), BranchOrders.DeliverBy) AS date1, ";
        $sql .= "BranchOrders.OrderSubject, "; 

        $sql.= "convert(varchar, BranchOrders.CloseDate, 106) as CloseDate ,convert(varchar, BranchOrders.ProposedCompletionDate, 106) as ProposedCompletionDate ,convert(varchar, BranchOrders.EndFixDate, 106) as EndFixDate , ";
        $sql.= "convert(varchar, BranchOrders.ScheduledInspectionDate, 106) as ScheduledInspectionDate ,BranchOrders.ProposedCompletionDateTxt, ";
        $sql.= "BranchOrders.ScheduledInspectionDateTxt, BranchOrders.CloseDateTxt, ";
        $sql.= "BranchOrders.EndFixDateTxt,";

        $sql .= "   CASE WHEN BranchOrders.OrderStatus = 50 THEN 'Issued' WHEN BranchOrders.OrderStatus = 51 THEN 'Fix Date Set' WHEN BranchOrders.OrderStatus = 52 THEN 'Ready To Inspect' WHEN BranchOrders.OrderStatus
                          = 53 THEN 'Inspection Date Set' WHEN BranchOrders.OrderStatus = 54 THEN 'Passed' WHEN BranchOrders.OrderStatus = 55 THEN 'Failed' WHEN BranchOrders.OrderStatus = 0 THEN 'Not Sent'
                          END AS OrderStatusText, ";

        $sql .= "left(BranchOrders.SpecialInstructions,20) + '...' as SpecialInstructions, ";
        $sql .= "BranchOrders.SytemOrderNumber, BranchOrders.TypeOrderNumber, ";
        $sql .= "ProjectLocationMap.LID, ";

        $sql.= "SystemUsers.Email as OwnerEmail, SystemUsers_1.Email InspectorEmail, ";
        $sql.= "SystemUsers_2.Email AS SubbyEmail, SystemUsers_3.Email AS QSEmail ";

        $sql .= "From BranchOrders INNER JOIN ProjectLocationMap ON BranchOrders.LocationID = ProjectLocationMap.LID ";

        $sql.= "INNER JOIN SystemUsers ON BranchOrders.OwnerID = SystemUsers.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_2 ON BranchOrders.SubOwner = SystemUsers_2.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_3 ON BranchOrders.SubOwner2 = SystemUsers_3.SystemUserID INNER JOIN ";
        $sql.= "SystemUsers AS SystemUsers_1 ON BranchOrders.RecipientID = SystemUsers_1.SystemUserID ";

        $sql .= "where ProjectLocationMap.LocationMapID = '".$Search."' and  BranchOrders.ProjectID = '".$ProjectID."' ";
        if($Role != 39){$sql.= $roleAccess;}        
        $sql .= "order by BranchOrders.TypeOrderNumber desc";
       
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $stickerdefects = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $stickerdefectsj = json_encode($stickerdefects);

        return $stickerdefectsj;  
    }      


});