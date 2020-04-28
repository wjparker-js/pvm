<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/documentinfo/{apikey}/{user}/{pid}/{search}/{search2}', function (Request $request, Response $response, $args) {

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

        //Add the APIKey check here and die if not current
    
        $SystemUserID    = $args['user'];
        $ProjectID       = $args['pid'];
        $searchCondition = $args['search'];
        $searchCondition2 = $args['search2'];

        $sql = "SELECT SystemClientID from Projects where Status = '2' ";
        $sql.= "and ProjectID = '".$ProjectID."'";
        
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


        $sql = "SELECT ";
        $sql.= "DocumentNumberName, RevisionName, TitleName, RegistrationDateName, ";
        $sql.= "IssueDateName, DesignerName, DisciplineName, IssueReasonName, StatusName, ";
        $sql.= "TypeName, CurrentName from Projects where ProjectID = '".$ProjectID."' "; 
        
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $fieldnames = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }


        $DocumentNumberName   = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->DocumentNumberName))."]";
        $RevisionName         = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->RevisionName))."]";
        $TitleName            = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->TitleName))."]";
        $RegistrationDateName = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->RegistrationDateName))."]";
        $IssueDateName        = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->IssueDateName))."]";
        $DesignerName         = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->DesignerName))."]";
        $DisciplineName       = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->DisciplineName))."]";
        $IssueReasonName      = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->IssueReasonName))."]";
        $StatusName           = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->StatusName))."]";
        $TypeName             = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->TypeName))."]";
        $CurrentName          = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->CurrentName))."]";

        $customSearchConditions = "";
        $MDcustomFieldName = "";
        $customeSearchString = "";
        $customeSearchString1 = "";

        $sql = "SELECT ";
        $sql.= "ProjectCustomDataID, FieldName ";
        $sql.= "FROM ProjectCustomData ";
        $sql.= "WHERE  ProjectID = '".$ProjectID."' and FieldLength > 1 and Active = 1";

        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $customfields = $dbc->query($sql);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        } 

        foreach( $customfields as $row) {

            $customSearchConditions.= $row["ProjectCustomDataID"]." like '%".$searchCondition."%' or ";
            $MDcustomFieldName.= '[ProjectIndex'.$ProjectID.'].['.$row["ProjectCustomDataID"].'] as ['.$row["FieldName"].'], ';
            $customeSearchString.= $row["ProjectCustomDataID"].", "; 
            $customeSearchString1.= "[".$row["FieldName"]."], "; 
        }

        $searchCondition  = substr($searchCondition, 5);
        $documentinfo     = $searchCondition;
        $searchCondition1 = str_replace("<span class='hilite'>","",$searchCondition);
        $searchCond       = "DocumentNumber = '".$searchCondition."' ";


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


        $sql = "SELECT FolderID FROM [ProjectIndex".$ProjectID."]  where ";
        $sql.= "DocumentNumber = '".$documentinfo."'";
       
        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $stmt = $dbc->query($sql);
            $docfolders = $stmt->fetchALL(PDO::FETCH_OBJ);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }  

        $docInfoFolder = $docfolders[0]->FolderID;


        $sql = "SELECT C FROM FolderAccess WHERE ProjectRoleID = '".$ProjectRoleID."' and FolderID = ".$docInfoFolder;
        
        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $stmt = $dbc->query($sql);
            $folderaccess = $stmt->fetchALL(PDO::FETCH_OBJ);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        } 

        $getallrevscC = $folderaccess[0]->C;

//echo "getallrevscC = ".$getallrevscC;
        
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

        if(is_null($PA5053)){$_SESSION['PA5053'] = "noview";} else {$_SESSION['PA5053'] = "view";} 


        
        $sql  = "SELECT ";  
        $sql .= "[ProjectIndex".$ProjectID."].DocumentID,  "; 
        $sql .= "[ProjectFolders".$ProjectID."].FolderName,  "; 
        if($DocumentNumberName == "[DocumentNumber]"){
            $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber, ";  
        } else {
            $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber as DocumentNumber, ";
            $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber as ".$DocumentNumberName.", ";
        }
        $sql .= "[ProjectIndex".$ProjectID."].Rev as ".$RevisionName.", ";
        $sql .= "[ProjectIndex".$ProjectID."].Title as ".$TitleName.", ";
        $sql .= "[ProjectIndex".$ProjectID."].FileExtension, "; 
        if($MDcustomFieldName != ""){$sql .= $MDcustomFieldName;}
        $sql .= "CASE WHEN ([ProjectIndex".$ProjectID."].CurrentDoc = 1)  THEN 'Current' ELSE 'Not Current' END AS ".$CurrentName.", ";
        $sql .= "ProjectType.Type AS ".$TypeName.",  ";
        $sql .= "ProjectDisciplines.Discipline AS ".$DisciplineName.",  ";
        $sql .= "ProjectDesigners.Name as ".$DesignerName.", ";
        $sql .= "ProjectStatus.Status AS ".$StatusName.",  ";  
        $sql .= "ProjectIssueReasons.Reason AS ".$IssueReasonName.", ";
        $sql .= "CONVERT(VARCHAR(25), [ProjectIndex".$ProjectID."].IssueDate, 106) as ".$IssueDateName.", ";
        $sql .= "CONVERT(VARCHAR(25), [ProjectIndex".$ProjectID."].RegDate, 106) as ".$RegistrationDateName.", ";
        $sql .= "'https://sky-vault.co.uk/PublicPics/".$SystemClientID."/".$ProjectID."/' + CONVERT(nvarchar(50), [";
        $sql .= "ProjectIndex".$ProjectID."].DocumentID) + '.png' AS PhotoTiny ";
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
        $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber = '".$documentinfo."' "; 
        if($getallrevscC == 1){$sql .= "and [ProjectIndex".$ProjectID."].CurrentDoc = 1 ";}  
        $sql .= "order by Currentdoc desc";

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
 
        $docsj = json_encode($docs);        

        if($searchCondition2 != "xxx"){
            $docsj = str_ireplace("$searchCondition2","<span class='hilite'>$searchCondition2</span>",$docsj);   
        } 
        
        return $docsj; 

});