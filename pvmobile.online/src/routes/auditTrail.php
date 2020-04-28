<?php

function checkMessage(actionid, actiontext, audittext) {                                                                                                                                                                                                                                                                                                                     m

    $actionid   = actionid;
    $actiontext = actiontext;
    $audittext  = audittext;
    $message    = "";

    session_start();

    $PA5053     = $_SESSION['PA5053'];
    
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

                    break;


                case "51"; // Document Sent on Standard Issue [IssueNumber]-[IssueType]-[Recipient]
                case "52"; // Document Downloaded send on standard issue  [IssueNumber]-[IssueType]
                case "68"; // Issued on [IssueNumber]-[IssueType]-[Recipient]
                case "83"; // Issued on [IssueNumber]-[IssueType]-[Recipient]
                case "85"; // Issued on [IssueNumber]-[IssueType]-[Recipient]
                //case "xxx84"; // Issued on  [IssueNumber]-[IssueType]-[Package] - [Recipient]                

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

                    $Type1            = $issue[1]->Type1;
                    $Type2            = $issue[2]->Type2;      
                    $Type             = $Type1."/".$Type2;  

                    $PackageID        = $issue[3]->PackageID;

                    $TypeName         = $issue[4]->TypeName;  

                    //////////////////////////////////////////////////////////////////////////
                    // Get issue recipients
                    //////////////////////////////////////////////////////////////////////////
                                       
                    $sql  = "SELECT DISTINCT UserView.FullName + N' - ' + UserView.CompanyName AS Detail ";
                    $sql .= "FROM BranchOrders LEFT OUTER JOIN  UserView ON BranchOrders.RecipientID = UserView.SystemUserID ";
                    $sql .= "WHERE (BranchOrders.OrderID = '".$actiontext."') OR ";
                    $sql .= "(BranchOrders.ParentOrderID = '".$actiontext."') ORDER BY Detail";

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

                    foreach($name as $row) {
                       $IssueTypeDistributionTxt .= $crlf."Issued to: ".$row['Detail'];
                    }                   

                    //////////////////////////////////////////////////////////////////////////
                    // Get the package number
                    //////////////////////////////////////////////////////////////////////////

                    $sql = "Select PackageName From Packages  WHERE  (PackageID = '".$PackageID."')";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $package = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    $PackageName = $package[0]->PackageName;

                    //////////////////////////////////////////////////////////////////////////
                    // Get the Issue type name
                    //////////////////////////////////////////////////////////////////////////

                    if ($actionid = "41" || $actionid = "68" || $actionid = "83" ); //|| $actionid = "85"){                        
                        $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext);
                        $message = str_replace('[IssueType]',   $TypeNameTxt, $message);
                        $message = str_replace('[Recipient]',   $IssueTypeDistributionTxt, $message);                  
                    }


                    if ($actionid = "52"){
                        $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext);
                        $message = str_replace('[IssueType]',   $TypeNameTxt, $message);
                    }
    /*
                        if ($actionid = "84" and $PA5053 = "view"){
                            $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext); 
                            $message = str_replace('[IssueType]',   $TypeNameTxt, $message);
                            $message = str_replace('[Package]',     $PackageName, $message);
                            $message = str_replace('[Recipient]',   $IssueTypeDistributionTxt, $message);  
                        }

                        if ($actionid = "84" and $PA5053 = "noview"){
                            $message = str_replace('[IssueNumber]', $SytemOrderNumber, $audittext); 
                            $message = str_replace('[IssueType]',   $TypeNameTxt, $message);
                            $message = str_replace('[Package]',     $PackageName, $message);
                        }
    */
                    break;



                case "54"; // Document Moved
                    //Mess = String.Format("{0} - {1}", GetAction(e.GetListSourceFieldValue("ActionID").ToString), e.GetListSourceFieldValue("ActionText"))
                    $message = "Document Moved";
                    break;



                case "56"; // Document Added to Package [PackageName]
                case "57"; // Document Removed Frrom Package [PackageName]
                case "58"; // Document Added to Package [PackageName] dynamically
                case "59"; // Document removed from Package [PackageName] dynamically

                    $sql = "Select PackageName From Packages  WHERE  (PackageID = '".$PackageID."')";

                    try{
                        $db = new db();
                        $db = $db->connect();
                        $stmt = $db->query($sql);
                        $package = $stmt->fetchALL(PDO::FETCH_OBJ);
                        $db = null;
                    } catch(PDOException $e){
                        echo '("error": {"text": '.$e->getMessage().'}';
                    }

                    $PackageName = $package[0]->PackageName;

                    $message = str_replace('[Package]', $PackageName, $audittext);

                    break;



                
                case "60"; // Document superseded by [Document] 
                case "61"; // Document has superseded [Document] 
                    //Dim Doc = GetDocNumberAndRev(e.GetListSourceFieldValue("ActionText").ToString)
                    //Mess = Replace(Mess, "[Document]", Doc)
                    $message = "TBD";
                    break;


                
                case "xxx62"; // Document Downloaded send on package  [PackageNumber]-[PackageName]

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

                    break;


                
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

                    break;


                
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
                    $message = "TBD";
                    break;


                
                case "82"; // Applied status "[status]"
                case "81"; // Decommissioned status "[status]"
                   // Mess = Replace(Mess, "[status]", e.GetListSourceFieldValue("ActionText").ToString)
                    $message = "TBD";
                    break;


                
                case "71"; // Released to Process (1)
                    //Mess = Replace(Mess, "(1)", Session("ArchiveNames")(16))
                    $message = "TBD";
                    break;


            return $message;


        } catch (Exception $e) {
            die("I could not create a car");
        }

    }

}

}