<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/documentsummary/{apikey}/{user}/{pid}/{days}', function (Request $request, Response $response, $args) {




        
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
    
        $SystemUserID    = $args['user']; // 409236d0-d85d-4bc7-be57-c4bc2677d4e0
        $ProjectID       = $args['pid']; //  11eba02d-2151-40ef-94f5-50d088b985a1
        
        $days            = $args['days']+1;
        
        $allRevs = "no";


        //Get SystemClientID to find document db location
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
        







        //Get the project specific field names
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


        // Project specific field names        
        //$Projectprefix        = "[".str_replace("-","",str_replace(" ","",$fieldnames[0]->DocumentNumberName))."]";

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











        //Get any Custom Fields in DB
        $customSearchConditions = "";
        $MDcustomFieldName = "";
        $customeSearchString = "";
        $customeSearchString1 = "";

        $sql = "SELECT ";
        $sql.= "ProjectCustomDataID, FieldName ";
        $sql.= "FROM ProjectCustomData ";
        $sql.= "WHERE  ProjectID = '".$ProjectID."' and FieldLength > 1 and Active = 1";
//echo $sql;
        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $customfields = $dbc->query($sql);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        } 

    /*    // Project custom field names
        foreach( $customfields as $row) {
            $customSearchConditions.= "[".$row["FieldName"]."] like '%".$searchCondition."%' or ";
            $MDcustomFieldName.= '[ProjectIndex'.$ProjectID.'].['.$row["ProjectCustomDataID"].'] as ['.$row["FieldName"].'], ';
            //$customeSearchString.= str_replace("[","",str_replace("]","",str_replace("-","",str_replace(" ","",$row["FieldName"])))).", "; 
            $customeSearchString.= $row["ProjectCustomDataID"].", "; 
            $customeSearchString1.= "[".$row["FieldName"]."], "; 
        }
*/










        $sql = "SELECT FolderID, Designers, IssueReason, Discipline, Type, Status, C FROM FolderAccess WHERE ProjectRoleID = '".$ProjectRoleID."'";

        try{
            $dbc = new dbClient($SystemClientID);
            $dbc = $dbc->connectToClientDB();
            $folderids = $dbc->query($sql);
            $dbc = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        } 

        $folderIdList      = "";
        $folderCList       = "";
        $DesignersIdList   = "";
        $IssueReasonIdList = "";
        $DisciplineIdList  = "";
        $TypeIdList        = "";
        $StatusIdList      = "";
        $CurrentList       = "";

        foreach( $folderids as $row) 
        {
            $folderIdList.= $row["FolderID"].",";
            //$folderCList.=  $row["C"]."-".$row["FolderID"].",";

            if($row["Designers"]!= ""){$DesignersIdList.= $row["Designers"].",";}
            if($row["IssueReason"] != ""){$IssueReasonIdList.= $row["IssueReason"].",";}
            if($row["Discipline"] != ""){$DisciplineIdList.= $row["Discipline"].",";}
            if($row["Type"] != ""){$TypeIdList.= $row["Type"].",";}
            if($row["Status"] != ""){$StatusIdList.= $row["Status"].",";}            
            if($row["C"] != ""){$CurrentList.= $row["C"].",";}


        }

        $folderIdList      = substr($folderIdList, 0, -1);

        if($DesignersIdList != ""){$DesignersIdList     = substr($DesignersIdList, 0, -1);}
        if($IssueReasonIdList != ""){$IssueReasonIdList = substr($IssueReasonIdList, 0, -1);}
        if($DisciplineIdList != ""){$DisciplineIdList   = substr($DisciplineIdList, 0, -1);}
        if($TypeIdList != ""){$TypeIdList               = substr($TypeIdList, 0, -1);}
        if($StatusIdList != ""){$StatusIdList           = substr($StatusIdList, 0, -1);}
        if($CurrentList != ""){$CurrentList             = substr($CurrentList, 0, -1);}














        //Get folder permissions      
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
        




        $sql = "SELECT ";  

        $sql .= "[ProjectIndex".$ProjectID."].FolderID, ";
        $sql .= "[ProjectIndex".$ProjectID."].DocumentID, "; 

        if($DocumentNumberName == "[DocumentNumber]"){
            $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber, ";  
        } else {
            $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber as DocumentNumber, ";
            $sql .= "[ProjectIndex".$ProjectID."].DocumentNumber as ".$DocumentNumberName.", ";
        }

        $sql .= "[ProjectIndex".$ProjectID."].Rev as ".$RevisionName.", ";
        $sql .= "[ProjectIndex".$ProjectID."].Title as ".$TitleName.", ";
        $sql .= "[ProjectIndex".$ProjectID."].FileExtension, ";
        $sql .= "ProjectDesigners.Name as ".$DesignerName.", ";
        $sql .= "CONVERT(VARCHAR(25), [ProjectIndex".$ProjectID."].IssueDate, 106) as ".$IssueDateName.", ";
        $sql .= "CONVERT(VARCHAR(25), [ProjectIndex".$ProjectID."].RegDate, 106) as ".$RegistrationDateName.", ";
        $sql .= "CASE WHEN ([ProjectIndex".$ProjectID."].hasphoto = 1)    THEN 1 ELSE 0 END AS HasPhoto,  ";
        $sql .= "CASE WHEN ([ProjectIndex".$ProjectID."].HasNotes = 1)    THEN 1 ELSE 0 END AS HasNotes,  ";
        $sql .= "CASE WHEN ([ProjectIndex".$ProjectID."].HasVersions = 1) THEN 1 ELSE 0 END AS HasVersions,  ";
        $sql .= "CASE WHEN ([ProjectIndex".$ProjectID."].CurrentDoc = 1)  THEN 'Current' ELSE 'Not Current' END AS ".$CurrentName.", ";
        $sql .= "'https://sky-vault.co.uk/PublicPics/".$SystemClientID."/".$ProjectID."/' + CONVERT(nvarchar(50), [";
        $sql .= "ProjectIndex".$ProjectID."].DocumentID) + '.png' AS PhotoTiny, ";

        $sql .= "[ProjectFolders".$ProjectID."].FolderName,  "; 
        $sql .= "ProjectStatus.Status AS ".$StatusName.",  ";   
        $sql .= "ProjectType.Type AS ".$TypeName.",  ";
        $sql .= "ProjectDisciplines.Discipline AS ".$DisciplineName.",  ";

        if($MDcustomFieldName != ""){ $sql .= $MDcustomFieldName; }

        $sql .= "ProjectIssueReasons.Reason AS ".$IssueReasonName." ";

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

        $sql .= "CONVERT(varchar(10), [ProjectFolders".$ProjectID."].FolderID) in (".$folderIdList.") ";
        $sql .= "AND ";        

        if($TypeIdList != ""){
        $sql .= "CONVERT(varchar(10), [ProjectIndex".$ProjectID."].Type) in (".$TypeIdList.") ";
        $sql .= "AND "; 
        }

        if($DesignersIdList != ""){
        $sql .= "CONVERT(varchar(10), [ProjectIndex".$ProjectID."].Originator) in (".$DesignersIdList.") ";
        $sql .= "AND "; 
        }

        if($IssueReasonIdList != ""){
        $sql .= "CONVERT(varchar(10), [ProjectIndex".$ProjectID."].IssueReason) in (".$IssueReasonIdList.") ";
        $sql .= "AND "; 
        }

        if($DisciplineIdList != ""){
        $sql .= "CONVERT(varchar(10), [ProjectIndex".$ProjectID."].Discipline) in (".$DisciplineIdList.") ";
        $sql .= "AND "; 
        }

        if($StatusIdList != ""){
        $sql .= "CONVERT(varchar(10), [ProjectIndex".$ProjectID."].Status) in (".$StatusIdList.") ";
        $sql .= "AND "; 
        }

        $sql .= "([ProjectIndex".$ProjectID."].CurrentDoc = 1) ";
        $sql .= "AND "; 


        $sql .= "(RegDate > CAST(GETDATE() - ".$days." AS DATE)) "; 
        $sql .= "AND ";

        $sql .= "([ProjectIndex".$ProjectID."].FileStatus = 1)  ";
        $sql .= "AND ";

        $sql .= "([ProjectIndex".$ProjectID."].FolderID IS NOT NULL)";
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

        return $docsj;        

});