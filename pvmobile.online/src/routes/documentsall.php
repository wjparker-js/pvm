<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

//$app = new \Slim\App;

$app->get('/api/documents/{user}/{pid}/{search}', function (Request $request, Response $response, $args) {

        //Add the APIKey check here and die if not current
    
        $SystemUserID    = $args['user']; // 409236d0-d85d-4bc7-be57-c4bc2677d4e0
        $ProjectID       = $args['pid']; //  11eba02d-2151-40ef-94f5-50d088b985a1
        $searchCondition = $args['search'];

        $searchCond  = "(DocumentNumber = '".$searchCondition."') order by ";
        
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
        
        
        $sql = "SELECT ViewFolders, ViewDocuments from  ProjectRoles where Active = 1 and ProjectRoleID = '".$ProjectRoleID."'";
        
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



        $tempFile = "temp".uniqid().str_replace("-","",$SystemUserID);  
        
        $sql = "SELECT "; 
        $sql .= "[ProjectFolders".$ProjectID."].FolderName,  ";
        $sql .= "[ProjectFolders".$ProjectID."].FolderID,  ";        
        $sql .= "ProjectDisciplines.Discipline AS DisciplineName,  ";
        $sql .= "ProjectType.Type AS TypeName,  ";
        $sql .= "[ProjectIndex".$ProjectID."].DocumentID,  ";
        $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber,  ";
        $sql .= "[ProjectIndex".$ProjectID."].Rev,  ";
        $sql .= "ProjectStatus.Status AS StatusName,  "; 
        $sql .= "[ProjectIndex".$ProjectID."].Status,  ";
        $sql .= "[ProjectIndex".$ProjectID."].Title,  ";
        $sql .= "ProjectIssueReasons.Reason AS ReasonName,  ";
        $sql .= "CONVERT(VARCHAR(25), [ProjectIndex".$ProjectID."].IssueDate, 105) as IssueDate, ";
        $sql .= "CONVERT(VARCHAR(25), [ProjectIndex".$ProjectID."].RegDate, 105) as RegDate, ";
        $sql .= "[ProjectIndex".$ProjectID."].Originator,  ";
        $sql .= "ProjectDesigners.Name AS DesignerName,  ";
        $sql .= "[ProjectIndex".$ProjectID."].FileExtension,  ";
        $sql .= "'https://www.sky-vault.co.uk/PublicPics/".$SystemClientID."/".$ProjectID."/' + CONVERT(nvarchar(50), [";
        $sql .= "ProjectIndex".$ProjectID."].DocumentID) + '.png' AS PhotoTiny, "; 
        $sql .= "CASE WHEN [ProjectIndex".$ProjectID."].hasphoto = 1 THEN 1 ELSE 0 END AS HasPhoto,  ";
        $sql .= "CASE WHEN [ProjectIndex".$ProjectID."].HasNotes = 1 THEN 1 ELSE 0 END AS HasNotes,  ";
        $sql .= "CASE WHEN [ProjectIndex".$ProjectID."].HasVersions = 1 THEN 1 ELSE 0 END AS HasVersions,  ";
        $sql .= "CASE WHEN ([ProjectIndex".$ProjectID."].CurrentDoc = 1) THEN 1 ELSE 0 END AS CurrentDoc  ";
        $sql .= "into ".$tempFile." ";
        $sql .= "FROM  [ProjectIndex".$ProjectID."]  ";
        $sql .= "LEFT OUTER JOIN ";
        $sql .= "[ProjectFolders".$ProjectID."] ON ";
        $sql .= "[ProjectIndex".$ProjectID."].FolderID = [ProjectFolders".$ProjectID."].FolderID  ";
        $sql .= "LEFT OUTER JOIN ProjectStatus WITH (NOLOCK) ON [ProjectIndex".$ProjectID."].Status = ProjectStatus.ProjectStatusID  ";
        $sql .= "LEFT OUTER JOIN ProjectType WITH (NOLOCK) ON [ProjectIndex".$ProjectID."].Type = ProjectType.ProjectTypeID  ";
        $sql .= "LEFT OUTER JOIN ProjectDesigners WITH (NOLOCK) ON [ProjectIndex".$ProjectID."].Originator = ProjectDesigners.DesignerID  ";
        $sql .= "LEFT OUTER JOIN ProjectDisciplines WITH (NOLOCK) ON [ProjectIndex".$ProjectID."].Discipline ";
        $sql .= "= ProjectDisciplines.ProjectDisciplinesID  ";
        $sql .= "LEFT OUTER JOIN ProjectIssueReasons WITH (NOLOCK) ON [ProjectIndex".$ProjectID."].IssueReason = ";
        $sql .= "ProjectIssueReasons.ProjectIssueReasonID ";
        $sql .= "WHERE    ";
        $sql .= "[ProjectFolders".$ProjectID."].FolderID in (SELECT FolderID FROM FolderAccess WHERE (ProjectRoleID = '$ProjectRoleID') and (R = '1')) ";
        $sql .= "AND ";
        $sql .= "([ProjectIndex".$ProjectID."].CurrentDoc = 1) ";
        $sql .= "AND "; 
        $sql .= "([ProjectIndex".$ProjectID."].FileStatus = 1)  ";
        $sql .= "AND ";
        $sql .= "([ProjectIndex".$ProjectID."].FolderID IS NOT NULL) ";

        class dbClient{
            public $dbname;
            public function __construct($proj) {
                    $this->dbname  = $proj;            
               }
            public function connectToClientDB(){
                $dbConnection = new PDO("sqlsrv:server=172.16.44.21; Database=".$this->dbname."", "", "");  
                $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
                return $dbConnection; 
            }
        };


        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $stmt = $dbc->query($sql);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }        


        $sql = "SELECT * from ".$tempFile." where ";         
        $sql .= $searchCond;
        //echo $sql;

        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $stmt = $dbc->query($sql);
            $docs = $stmt->fetchALL(PDO::FETCH_OBJ);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        
        $sql = "Drop table ".$tempFile." ";         

        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $stmt = $dbc->query($sql);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }        
        

        //header('Content-type:application/json');
        $docsj = json_encode($docs);
        $docsj = str_ireplace("$searchCondition","<span class='hilite'>$searchCondition</span>",$docsj);

        //$docsj = str_ireplace("site","<span class='hilite1'>Site</span>",$docsj);

        //$docsj = strtoupper($docsj);

        return $docsj;        

});