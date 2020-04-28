<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/t4/{apikey}/{user}/{pid}', function (Request $request, Response $response, $args) {

        //Add the APIKey check here and die if not current
        $APIKey          = $args['apikey'];    
        $SystemUserID    = $args['user']; // 409236d0-d85d-4bc7-be57-c4bc2677d4e0
        $ProjectID       = $args['pid']; //  11eba02d-2151-40ef-94f5-50d088b985a1
        
        $sql = "SELECT ProjectRoleID from ProjectUsers where UserID = '".$SystemUserID."' and  Projectid = '".$ProjectID."'"; 
        
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $role = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }
        
        $ProjectRoleID = $role[0]->ProjectRoleID;



        
        
        $sql = "SELECT ViewFolders, ViewDocuments, PA5053 from  ProjectRoles where Active = 1 and ProjectRoleID = '".$ProjectRoleID."'";
        
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $permissions = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }
        
        $ViewFolders     = $permissions[0]->ViewFolders;
        $ViewDocuments   = $permissions[0]->ViewDocuments;
        $PA5053          = $permissions[0]->PA5053;

        if(is_null($PA5053))
        {
            $_SESSION['PA5053'] = "noview";  
        } else {
            $_SESSION['PA5053'] = "view";
        }      
        


    

        $sql = "SELECT SystemClientID from Projects where Status = '2' and ProjectID = '".$ProjectID."'";
        
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $SysCID = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }
        
        $SystemClientID   = $SysCID[0]->SystemClientID;


        $sqlt4  = "SELECT ";
        $sqlt4 .= "Projects.ProjectID, ";
        $sqlt4 .= "Projects.Name, ";
        $sqlt4 .= "GADT4.TypeName as Process, ";
        $sqlt4 .= "COUNT(*) AS RFICount, ";
        $sqlt4 .= "SUM(GADT4.New) AS New, ";
        $sqlt4 .= "SUM(GADT4.InProcess) AS InProcess, ";
        $sqlt4 .= "SUM(GADT4.Closed) AS Closed, ";
        $sqlt4 .= "SUM(GADT4.InTime) AS InTime, ";
        $sqlt4 .= "SUM(GADT4.OverDue) AS OverDue, ";
        $sqlt4 .= "SUM(GADT4.SoonDue) AS SoonDue ";
        $sqlt4 .= "FROM Projects INNER JOIN ProjectUsers ON Projects.ProjectID = ProjectUsers.ProjectID ";
        $sqlt4 .= "INNER JOIN ProjectRoles ON ProjectUsers.ProjectRoleID = ProjectRoles.ProjectRoleID ";
        $sqlt4 .= "INNER JOIN GADT4 ON Projects.ProjectID = GADT4.ProjectID ";
        $sqlt4 .= "WHERE ";
        $sqlt4 .= "(Projects.ProjectID = '".$ProjectID."') and "; 
        $sqlt4 .= "(ProjectRoles.PA5067 = 1) ";
        //$sqlt4 .= "(ProjectUsers.UserID = '".$SystemUserID."') ";
        $sqlt4 .= "GROUP BY Projects.ProjectID, Projects.Name, GADT4.TypeName ";
        $sqlt4 .= "ORDER BY Projects.Name, Projects.ProjectID, GADT4.TypeName";   

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sqlt4);
            $RFIs = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }


        //header('Content-type:application/json');
        $RFIsj = json_encode($RFIs);

        return $RFIsj;        

});