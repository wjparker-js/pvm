<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/documentaudit/{user}/{pid}/{did}/{cid}', function (Request $request, Response $response, $args) {

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

    $SystemUserID = $args['user'];
    $ProjectID    = $args['pid']; 
    $DocumentID   = $args['did'];
    $ClientID     = $args['cid'];

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

    $_SESSION['SystemClientID'] = $SystemClientID;

    class dbClientPkg{
        public $dbname;
        public function __construct($proj) {
                $this->dbname  = $proj;            
           }
        public function connect(){
            $dbConnection = new PDO("sqlsrv:server=172.16.44.21; Database=".$this->dbname."", "", "");  
            $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
            return $dbConnection; 
        }
    };  

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
    $sql  = "SELECT Audit.ActionID, Audit.ActionDate, Audit.ActionText, Audit.PrivateAction, ";
    $sql .= "SystemUsers.Email, SystemUsers.FirstName, SystemUsers.LastName ";
    $sql .= "FROM Audit INNER JOIN SystemUsers ON Audit.SystemUserID = SystemUsers.SystemUserID ";
    $sql .= "WHERE (Audit.EntityID = '".$DocumentID."') ";
    $sql .= "ORDER BY Audit.AuditID DESC";


    class dbClientAudit{
        public $dbaudit;
        public function __construct($audit) {
                $this->dbaudit  = $audit;            
           }
        public function connectToClientDBAudit(){
            $dbcaudit = new PDO("sqlsrv:server=localhost; Database=".$this->dbaudit."", "", "");
            $dbcaudit->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
            return $dbcaudit; 
        }
    };

    try{
        $dbc1 = new dbClientAudit($SystemClientID);
        $dbc1 = $dbc1->connectToClientDBAudit();
        $stmt = $dbc1->query($sql);
        $audittrail = $stmt->fetchALL(PDO::FETCH_OBJ);
        $dbc1 = null;
    } catch(PDOException $e){
        echo '("error": {"text": '.$e->getMessage().'}';
    }   

    */
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    class dbClientAudit{
        public $dbaudit;
        public function __construct($audit) {
                $this->dbaudit  = $audit;            
           }
        public function connect(){
            $dbcaudit = new PDO("sqlsrv:server=172.16.44.21; Database=".$this->dbaudit."", "", "");
            $dbcaudit->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
            return $dbcaudit; 
        }
    };

    $sql  = "SELECT a.AuditID, a.EntityID, a.SystemUserID, a.ActionID,  ";
    $sql .= "ActionDate, a.ActionText, a.PrivateAction, c.EnglishStd ";
    $sql .= "FROM Audit AS a INNER JOIN PV.dbo.AuditCodes AS c ON a.ActionID = c.ActionID ";
    $sql .= "WHERE (a.EntityID = '".$DocumentID."') ORDER BY a.AuditID desc";

    try{
        $db = new dbClientAudit($SystemClientID);
        $db = $db->connect();
        $stmt = $db->query($sql);
        $audit = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        echo '("error": {"text": '.$e->getMessage().'}';
    }
    
    $audittrail = "";
    $message = "";

    $msgstack = array();


    foreach ($audit as &$audititems) {

        $audititems   = get_object_vars($audititems);
        $AuditID      = $audititems["AuditID"]; 
        $EntityID     = $audititems["EntityID"]; 
        $SystemUserID = $audititems["SystemUserID"]; 
        $ActionID     = $audititems["ActionID"]; 
        $ActionDate   = $audititems["ActionDate"]; 
        $ActionText   = $audititems["ActionText"];
        $EnglishStd   = $audititems["EnglishStd"];
//echo $ActionID ;
        $message = checkMessage($ActionID,$ActionText,$EnglishStd,$ActionDate,$EntityID,$SystemUserID);
        //$message = "msg:{".$message."}";
        array_push($msgstack, $message);
        //$message .= $ActionID."-".$ActionText."-".$EnglishStd;        
     } 
     

    //$message = json_encode($audit);
    //$message = json_encode($message);
    $message = json_encode($msgstack);

    return $message;        

});


function checkMessage($actionid,$actiontext,$audittext,$actiondate,$entityid,$systemuserid) { 

    $message = "";
   
    $PA5053 = $_SESSION['PA5053'];
    $SystemClientID = $_SESSION['SystemClientID'];
    $actiondate = substr($actiondate,0,10);

    echo $PA5053;

  

    if ($actionid <> "") {
 
        try {

            switch ($actionid) {

                case "43"; // Document Downloaded From Issue [IssueNumber]-[IssueType]  At Recipient
                case "44"; // Document Viewed From Issue [IssueNumber]-[IssueType] at recipient
                case "41"; // Document Upload to recipients work space from Issue [IssueNumber]-[IssueType]  (Issuers Log)
                case "36"; // Document Sent on Home Issue [IssueNumber]-[IssueType]
                    
                    $sql = "Select IssueNumber, IssueType From Issues Where IssueID='".$actiontext."'";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $issue = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }
                    
                    $projectissuenumber = $issue[0]->projectissuenumber; 
                    $projectissuetype   = $issue[1]->projectissuetype;                   

                    $audittext = str_replace('[IssueNumber]', $projectissuenumber, $audittext);
                    $message   = str_replace('[IssueType]',   $projectissuetype, $audittext);
                    $message   = "On ".$actiondate." - ".$message;

                    break;


                case "51"; // Document Sent on Standard Issue [IssueNumber]-[IssueType]-[Recipient]
                case "52"; // Document Downloaded send on standard issue  [IssueNumber]-[IssueType]
                case "68"; // Issued on [IssueNumber]-[IssueType]-[Recipient]
                case "83"; // Issued on [IssueNumber]-[IssueType]-[Recipient]
                case "85"; // Issued on [IssueNumber]-[IssueType]-[Recipient]
                case "84"; // Issued on  [IssueNumber]-[IssueType]-[Package] - [Recipient]                

                //////////////////////////////////////////////////////////////////////////////////    
                // Get issue details
                //////////////////////////////////////////////////////////////////////////////////

                    $sql  = "SELECT BranchOrders.SytemOrderNumber, BranchOrders.Type, BranchOrders.OrderReference, ";
                    $sql .= "BranchOrders.PackageID, IssueSubTypes.TypeName FROM BranchOrders LEFT OUTER JOIN ";
                    $sql .= "IssueSubTypes ON BranchOrders.SubType = IssueSubTypes.SubTypeID WHERE ";
                    $sql .= "(BranchOrders.OrderID = '".$actiontext."')";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $issue = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }
                    
                    $SytemOrderNumber = $issue[0]->SytemOrderNumber; 

                    $Type             = $issue[0]->Type;
                    $OrderReference   = $issue[0]->OrderReference;      
                    $Type             = $Type."/".$OrderReference;  

                    $PackageID        = $issue[0]->PackageID;

                    $TypeName         = $issue[0]->TypeName;  

                    //////////////////////////////////////////////////////////////////////////
                    // Get issue recipients
                    //////////////////////////////////////////////////////////////////////////
                                       
                    /*$sql  = "SELECT DISTINCT UserView.FullName + N' - ' + UserView.CompanyName AS Detail ";
                    $sql .= "FROM BranchOrders LEFT OUTER JOIN  UserView ON BranchOrders.RecipientID = UserView.SystemUserID ";
                    $sql .= "WHERE (BranchOrders.OrderID = '".$actiontext."') OR ";
                    $sql .= "(BranchOrders.ParentOrderID = '".$actiontext."') ORDER BY Detail";*/

                    $sql  = "SELECT DISTINCT UserView.FullName, UserView.CompanyName ";
                    $sql .= "FROM BranchOrders LEFT OUTER JOIN ";
                    $sql .= "UserView ON BranchOrders.RecipientID = UserView.SystemUserID ";
                    $sql .= "WHERE (CAST(BranchOrders.OrderID AS varchar(50)) = '".$actiontext."') OR ";
                    $sql .= "(CAST(BranchOrders.ParentOrderID AS varchar(50)) = '".$actiontext."')";
                    $sql .= "ORDER BY UserView.FullName, UserView.CompanyName";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $name = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    $IssueTypeDistributionTxt = "";
                    $crlf      = "<br/>";

                    foreach ($name as &$row) {
                        $row   = get_object_vars($row); 
                        $IssueTypeDistributionTxt .= "Issued to: ".$row['FullName']." - ".$row['CompanyName'];
                    }                   

                    //////////////////////////////////////////////////////////////////////////
                    // Get the package number
                    //////////////////////////////////////////////////////////////////////////

                    $sql = "Select PackageName From Packages  WHERE  cast(PackageID as varchar(50)) = '".$PackageID."'";

                    try{
                        $db = new dbClientPkg($SystemClientID);
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $package = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    if(isset($package[0])){
                        $PackageName = $package[0]->PackageName;
                    } else {
                        $PackageName = " ";
                    }
                    

                    //////////////////////////////////////////////////////////////////////////
                    // Get the Issue type name || $actionid = "83" || $actionid = "85" || $actionid = "84"
                    //////////////////////////////////////////////////////////////////////////

                    if ($actionid = "41" || $actionid = "68" ){                        
                        $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext);
                        $message = str_replace('[IssueType]',   $TypeName, $message);
                        $message = str_replace('[Recipient]',   $IssueTypeDistributionTxt, $message);                  
                    }


                    if ($actionid = "52"){
                        $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext);
                        $message = str_replace('[IssueType]',   $TypeName, $message);
                    }

                    if ($actionid = "84" and $PA5053 = "view"){
                        $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext); 
                        $message = str_replace('[IssueType]',   $TypeName, $message);
                        $message = str_replace('[Package]',     $PackageName, $message);
                        $message = str_replace('[Recipient]',   $IssueTypeDistributionTxt, $message);
                        $message = "Redacted - see main PV4 system.";  
                    }

                    if ($actionid = "84" and $PA5053 = "noview"){
                        $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext); 
                        $message = str_replace('[IssueType]',   $TypeName, $message);
                        $message = str_replace('[Package]',     $PackageName, $message);
                        //$message = str_replace('[Recipient]',   "", $message); 
                        $message = str_replace('[Recipient]',   $IssueTypeDistributionTxt, $message);
                        $message = "Redacted - see main PV4 system.";
                    }


                    //$message = $message."  (".$actionid.") ";
                    $message   = "On ".$actiondate." - ".$message;
                   
                    break;


                case "25"; 

                    $sql = "SELECT SystemUsers.FirstName, SystemUsers.LastName, ";
                    $sql .= "SystemClients.Name FROM SystemUsers INNER JOIN SystemClients ON SystemUsers.SystemClientID = ";
                    $sql .= "SystemClients.SystemClientID WHERE (SystemUsers.SystemUserID = '".$systemuserid."')";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $userinfo = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    $FirstName = $userinfo[0]->FirstName;
                    $LastName  = $userinfo[0]->LastName;
                    $Name      = $userinfo[0]->Name;

                    $message = "Viewed by ".$FirstName." ".$LastName."  -  ".$Name;
                    //$message = "(".$actionid.") ".$message;
                    $message   = "On ".$actiondate." - ".$message;
                    
                    break;



                case "31"; 
                    $message = str_replace('(Project)', "", $audittext);
                    //$message = "(".$actionid.") ".$message;
                    $message   = "On ".$actiondate." - ".$message;
                    
                    break;



                case "54"; // Document Moved
                    //Mess = String.Format("{0} - {1}", GetAction(e.GetListSourceFieldValue("ActionID").ToString), e.GetListSourceFieldValue("ActionText"))
                    $message = "Document Moved - ".$actiontext;
                    //$message = "(".$actionid.") ".$message;
                    $message   = "On ".$actiondate." - ".$message;
                    
                    break;


/*
                case "56"; // Document Added to Package [PackageName]
                case "57"; // Document Removed Frrom Package [PackageName]
                case "58"; // Document Added to Package [PackageName] dynamically
                case "59"; // Document removed from Package [PackageName] dynamically

                    //////////////////////////////////////////////////////////////////////////////////    
                    // Get issue details
                    //////////////////////////////////////////////////////////////////////////////////

                    $sql  = "SELECT PackageID FROM BranchOrders WHERE OrderID = '".$entityid."'";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $issue = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    //echo $sql;

                    if(isset($issue[0])){
                        $PackageID = $issue[0]->PackageID;
                    } else {
                        $message = str_replace('[Package]', "Package ID ".$PackageID." not found", $audittext);
                        //$message = "(".$actionid.") ".$message;
                        $message   = "On ".$actiondate." - ".$message;

                        break;
                    }


                    $sql = "Select PackageName From Packages  WHERE  cast(PackageID as varchar(50)) = ".$PackageID."";

                    try{
                        $db = new dbClientPkg($SystemClientID);
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $package = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    if(isset($package[0])){
                        $PackageName = $package[0]->PackageName;
                        $message = str_replace('[Package]', $PackageName, $audittext);
                        //$message = "(".$actionid.") ".$message;
                        $message   = "On ".$actiondate." - ".$message;
                    } else {
                        $PackageName = " ";
                        $message = str_replace('[Package]', "Package ".$PackageID." - name not found", $audittext);
                        //$message = "(".$actionid.") ".$message;
                        $message   = "On ".$actiondate." - ".$message;

                    }          

                    break;

*/

                
                case "60"; // Document superseded by [Document] 
                case "61"; // Document has superseded [Document] 
                    //Dim Doc = GetDocNumberAndRev(e.GetListSourceFieldValue("ActionText").ToString)
                    //Mess = Replace(Mess, "[Document]", Doc)
                    $message = str_replace('[Document]', $entityid, $audittext);
                    //$message = "(".$actionid.") ".$message;
                    $message = "On ".$actiondate." - ".$message;

                    break;


                
                case "62"; // Document Downloaded send on package  [PackageNumber]-[PackageName]

                    $sql = "Select PackageNumber, PackageName From Packages  WHERE  (PackageID = '".$PackageID."')";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $package = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    $PackageName   = $package[0]->PackageName;
                    $PackageNumber = $package[0]->PackageNumber;

                    $message = str_replace('[PackageName]', $PackageName, $audittext);
                    $message = str_replace('[PackageNumber]', $PackageName, $message);
                    //$message = "(".$actionid.") ".$message;
                    $message   = "On ".$actiondate." - ".$message;

                    break;


                /*
                case "xxx63"; // Document Sent on Package [PackageNumber]-[PackageName]-[Recipient]

                    $sql = "Select PackageNumber, PackageName From Packages  WHERE  (PackageID = '".$PackageID."')";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $package = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    $PackageName   = $package[0]->PackageName;
                    $PackageNumber = $package[0]->PackageNumber;

                    //////////////////////////////////////////////////////////////////////////
                    // Get package recipients
                    //////////////////////////////////////////////////////////////////////////
                                        
                    $sql  = "SELECT SystemUserID FROM PackageUsers WHERE  (PackageID = '".$PackageID."')";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $user = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    $UserIDDistributionTxt = "";
                    $crlf      = "<br/>";

                    foreach($user as $userid) {
                        $UserIDDistributionTxt .= $crlf."Issued to: ".$userid['SystemUserID'];
                    }                   


                    $message = str_replace('[PackageName]', $PackageName, $audittext);
                    $message = str_replace('[PackageNumber]', $PackageName, $message);
                    //$message = str_replace('[Recipient]', $Recipient, $message)
                    //$message = "(".$actionid.") ".$message;
                    $message   = "On ".$actiondate." - ".$message;

                    break;

                */
                
                case "64"; // Document sent to [RecipientName] by [SendersName] on print order [OrderNumber], system order number [SystemOrderNumber], [Instructions] 
                case "65"; // Document NOT sent to [RecipientName] on print order [OrderNumber], system order number [SystemOrderNumber], [Instructions]. ORDER CANCELLED by [SendersName].
                case "66"; // Document NOT sent to [RecipientName] on print order [OrderNumber], system order number [SystemOrderNumber], [Instructions]. ORDER CANCELLED by [BranchName]
                case "67"; // Document NOT sent to [RecipientName] on print order [OrderNumber], system order number [SystemOrderNumber], [Instructions]. ORDER CANCELLED by [BranchName], redirected to another location, and new order created.
                    /*Dim ChildOrderID = e.GetListSourceFieldValue("ActionText").ToString
                    If ChildOrderID IsNot DBNull.Value Then
                        Dim OrderDetails = GetPrintOrderDetails(ChildOrderID.ToString)
                        Mess = Replace(Mess, "[RecipientName]", OrderDetails(0))
                        Mess = Replace(Mess, "[SendersName]", OrderDetails(1))
                        Mess = Replace(Mess, "[OrderNumber]", OrderDetails(2))
                        Mess = Replace(Mess, "[Instructions]", OrderDetails(3))
                        Mess = Replace(Mess, "[BranchName]", OrderDetails(4))
                        Mess = Replace(Mess, "[SystemOrderNumber]", GetMasterOrderNumber(ChildOrderID.ToString))
                    End If*/
                    $message = "(".$actionid.") TBD";
                    $message   = "On ".$actiondate." - ".$message;

                    break;


                
                case "82"; // Applied status "[status]"
                case "81"; // Decommissioned status "[status]"
                   // Mess = Replace(Mess, "[status]", e.GetListSourceFieldValue("ActionText").ToString)
                   $message = "(".$actionid.") TBD";
                   $message   = "On ".$actiondate." - ".$message;
                    break;


                
                case "71"; // Released to Process (1)
                    //Mess = Replace(Mess, "(1)", Session("ArchiveNames")(16))
                    $message = "(".$actionid.") TBD";

                    break;

                default;
                $message = $audittext;
                $message   = "On ".$actiondate." - ".$message;

            }
            

        } catch (Exception $e) {
            die("I could not create a record");
        }
        
        return $message;
    }

}