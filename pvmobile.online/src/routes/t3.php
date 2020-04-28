<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/t3/{apikey}/{user}/{pid}', function (Request $request, Response $response, $args) {

        //Add the APIKey check here and die if not current
        $APIKey          = $args['apikey'];    
        $SystemUserID    = $args['user'];
        $ProjectID       = $args['pid'];

        
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





        $sqlt3  = "SELECT ";
        $sqlt3 .= "Projects.ProjectID, ";
        $sqlt3 .= "Projects.Name, ";
        $sqlt3 .= "GADT3.TypeName as Process, ";
        $sqlt3 .= "COUNT(*) AS SDRCount, ";
        $sqlt3 .= "SUM(GADT3.Cancelled) AS Cancelled, ";
        $sqlt3 .= "SUM(GADT3.Closed) AS Closed, ";
        $sqlt3 .= "SUM(GADT3.InTime) AS InTime, ";
        $sqlt3 .= "SUM(GADT3.OverDue) AS OverDue, ";
        $sqlt3 .= "SUM(GADT3.SoonDue) AS SoonDue ";
        $sqlt3 .= "FROM Projects ";
        $sqlt3 .= "INNER JOIN ProjectUsers ON Projects.ProjectID = ProjectUsers.ProjectID ";
        $sqlt3 .= "INNER JOIN ProjectRoles ON ProjectUsers.ProjectRoleID = ProjectRoles.ProjectRoleID ";
        $sqlt3 .= "INNER JOIN GADT3 ON Projects.ProjectID = GADT3.ProjectID ";
        $sqlt3 .= "WHERE ";
        $sqlt3 .= "(Projects.ProjectID  = '".$ProjectID."') and ";
        //$sqlt3 .= "(ProjectUsers.UserID = '".$SystemUserID."') AND ";
        $sqlt3 .= "(ProjectRoles.PA5035 = 1) ";
        $sqlt3 .= "GROUP BY Projects.ProjectID, Projects.Name, GADT3.TypeName ";
        $sqlt3 .= "ORDER BY Projects.Name, Projects.ProjectID, GADT3.TypeName";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sqlt3);
            $SDRs = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        //header('Content-type:application/json');
        $SDRsj = json_encode($SDRs);

        return $SDRsj;        

});