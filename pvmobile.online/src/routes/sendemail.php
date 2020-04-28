<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/sendemail/{apikey}/{uid}/{pid}/{from}/{to}/{subject}/{message}/{docid}/{docname}', function (Request $request, Response $response, $args) {

    class dbAudit{
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


    $APIKey       = $args['apikey'];
    $SystemUserID = $args['uid'];
    $ProjectID    = $args['pid'];
    $From         = $args['from'];
    $To           = $args['to'];
    $Subject      = $args['subject'];
    $Message      = $args['message'];
    $DocID        = $args['docid'];
    $DocName      = $args['docname'];


    $sql = "SELECT SystemClientID, Name from Projects where Status = '2' and ProjectID = '".$ProjectID."'";
    
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
    $Projectname      = $SysCID[0]->Name;

    echo $APIKey."<br/>";
    echo $SystemUserID."<br/>";
    echo $ProjectID."<br/>";
    echo $From."<br/>";
    echo $To."<br/>";
    echo $Subject."<br/>";
    echo $Message."<br/>";
    echo $DocID."<br/>";
    echo $SystemClientID."<br/>";


    $sql = "SELECT SystemUsers.FirstName, SystemUsers.LastName, SystemClients.Name, SystemUsers.Telephone FROM SystemUsers INNER JOIN ";
    $sql.= "SystemClients ON SystemUsers.SystemClientID = SystemClients.SystemClientID ";
    $sql.= "WHERE (SystemUsers.Email = '".$From."')";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $userdata = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
        $FullnameCompany      = trim($userdata[0]->FirstName)." ".trim($userdata[0]->LastName)." - ".trim($userdata[0]->Name);
        $FullnameCompanyPhone = trim($userdata[0]->FirstName)." ".trim($userdata[0]->LastName)." - ".trim($userdata[0]->Name)." (".trim($userdata[0]->Telephone).")";
    } catch(PDOException $e){
        $FullnameCompany = "Sender details not found.";
        echo '("error": {"text": '.$e->getMessage().'}';
    }
    
    

    // Copy the document

    $ftp_server    = "172.16.44.5";
    $remote_file   = $DocID;
    $local_file    = "emaildocs/".$DocName.".pdf";
    $ftp_user      = "BillParkerClientFileAccess";
    $ftp_pass      = "SealTeam6";
    

    if(!is_dir("emaildocs")) {
        mkdir("emaildocs/", 0777);
    }

    $conn_id = ftp_connect($ftp_server);

    if (!$conn_id) die('could not connect.');

    if (ftp_login($conn_id, $ftp_user, $ftp_pass)) {

        ftp_pasv($conn_id, true);

        //echo "Current directory: " . ftp_pwd($conn_id) . "<br>";

        if (ftp_chdir($conn_id, $SystemClientID)) {
            //echo "Current directory is now: " . ftp_pwd($conn_id) . "<br>";
        } else { 
            //echo "Couldn't change directory SCID<br>";
        }

        if (ftp_chdir($conn_id, "P")) {
            //echo "Current directory is now: " . ftp_pwd($conn_id) . "<br>";
        } else { 
            //echo "Couldn't change directory P<br>";
        }

        if (ftp_chdir($conn_id, $ProjectID)) {
           // echo "Current directory is now: " . ftp_pwd($conn_id) . "<br>";
        } else { 
           // echo "Couldn't change directory PID<br>";
        }

        //echo "Required File is: " . $remote_file. "<br>";
        //echo "local File is: " . $local_file . "<br>";

        if (ftp_get($conn_id, $local_file, $remote_file, FTP_BINARY)) {
            $message = $local_file;
            //fclose($handle);
        } else {
            $message = "No File";            
        }

            
        //echo $message;


    } else {
            $message = "Couldn't login";
    }  
 
    ftp_close($conn_id);




    $template = "<table width='100%' border='0' cellpadding='10' cellspacing='0' bgcolor='#FF9900'>
      <tbody>
        <tr>
            <td>
                <table width='100%' border='0' cellspacing='0' cellpadding='10'>    
                    <tbody>  
                        <tr bgcolor='#FFFFFF'>
                            <td width='40%' height='50' align='left' valign='middle' ><img border='0' height='50' src='https://go.projectvaultuk.com/PublicLogos/[ProjectLogo].png'></img></td>
                            <td width='60%' height='50' align='right' valign='middle'><img border='0' height='50' src='https://go.projectvaultuk.com/PublicLogos/[SystemLogo].png'></img></td>
                        </tr>                    
                        <tr>
                            <td height='45' colspan='2' align='left' valign='middle'>
                                <p>
                                    <span style='font-size: 12pt; font-weight: bold; font-family: Verdana; color: #ffffff;'>[ProjectName] Project</span>
                                </p>
                                <p> 
                                    <span style='font-size: 16pt; font-family: Verdana; color: #ffffff;'>Project Issue: Mobile</span>
                                </p>
                            </td>
                        </tr>
                        <tr>  
                            <td width='40%' bgcolor='#FFFFFF'>
                                <p><span style='font-size: 10pt; font-weight: bold; font-family: 'Trebuchet MS'; color: #808080;'>[Date]</span></p>
                                <p><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>To: <strong>[ToFullName]</strong></span></p>
                                <p><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>A <strong>[IssueType]</strong> has been sent to you by <strong>[FromFullName] - [FromCompany]</strong></span></p>
                                <p><span style='background-color:SILVER;font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>[Message]</span>          
                                </p>
                            </td>          
                            <td width='60%' valign='top' bgcolor='#FFFFFF'>                            
                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                    <tbody>
                                        <tr>
                                            <td width='150' height='20' align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #000000;'><strong>Reference:</strong></span></td>
                                            <td align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>[Reference]</span></td>
                                        </tr>
                                        <tr>
                                            <td width='150' height='20' align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #000000;'><strong>Subject:</strong></span></td>
                                            <td align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>[Subject]</span></td>
                                            <td align='left' valign='top'>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td width='150' height='20' align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #000000;'><strong>Due Date:</strong></span></td>
                                            <td align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>[DueDate]</span></td>
                                        </tr>
                                        <tr>
                                            <td width='150' height='20' align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #000000;'><strong>Issue Type:</strong></span></td>
                                            <td align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>[SubIssueType]</span></td>
                                        </tr>
                                        <tr>
                                            <td width='150' height='20' align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #000000;'><strong>From:</strong></span></td>
                                            <td align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>[FromFullName] - [FromCompany]</span></td>
                                        </tr>
                                        <tr>
                                            <td height='20' colspan='3' align='left' valign='bottom'><hr noshdae='noshade' /></td>
                                        </tr>
                                        <tr>
                                            <td height='20' colspan='3' align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #000000;'><strong>Distribution List:</strong></span></td>
                                        </tr>
                                        <tr>
                                            <td height='20' colspan='3' align='left' valign='top'><span style='font-size: 10pt; font-family: 'Trebuchet MS'; color: #808080;'>[RecipientList]</span></td>
                                        </tr>

                                                                          
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
      </tbody>
    </table>";


    $ProjectLogo   = $SystemClientID;
    $SystemLogo    = "0afa8514-9486-4672-a5ca-17f4569108f0";
    $ToFullName    = $To;
    $IssueType     = "Document Email Issue";
    $FromFullNameFromCompany = $FullnameCompany;
    $FromFullNameFromCompanyPhone = $FullnameCompanyPhone;
    $Reference     = "";
    $Subject       = $Subject;
    $DueDate       = "";
    $SubIssueType = "(Mobile)";
    $RecipientList = $args['to'];    
    $RecipientList = str_replace(",","<br>",$RecipientList); 
    $Date1         = date("d/m/Y");
    $SysClientID = $SystemClientID;


    $template = str_replace("[ProjectLogo]",  $ProjectLogo, $template);
    $template = str_replace("[ProjectName]",  $Projectname, $template);
    $template = str_replace("[Date]",  $Date1, $template);
    $template = str_replace("[SystemLogo]",   $SystemLogo, $template);
    $template = str_replace("[IssueType]",    $IssueType, $template);
    $template = str_replace("[SubIssueType]", $SubIssueType, $template);
    $template = str_replace("[RecipientList]", $RecipientList, $template);
    $template = str_replace("[DueDate]", $DueDate, $template);
    $template = str_replace("[Subject]", $Subject, $template);
    $template = str_replace("[Reference]", $Reference, $template);
    $template = str_replace("[FromFullName] - [FromCompany]", $FromFullNameFromCompany, $template);
    //$template = str_replace("[SystemClientID]", $SystemClientID, $template);
    //$template = str_replace("[ProjectID]", $ProjectID, $template);    
    //$template = str_replace("[FromFullName] - [FromCompany] - [Phone]", $FromFullNameFromCompanyPhone, $template);
    $template = str_replace("[ProjectLogo]", $ProjectLogo, $template);
    $template = str_replace("[ProjectLogo]", $ProjectLogo, $template);


    // Send the emails

    $contacts = explode(',', $To);

    foreach($contacts as $contact) {

        $docURL  = "<table width='100%' border='0' cellspacing='0' cellpadding='10'><tr bgcolor='#e8e8e8'><td>Click this link to download the attached document...</td></tr>";
        $docURL .= "<tr bgcolor='#e8e8e8'><td><b><a href='http://pvmobile.online/emaildocs/".$DocName.".pdf'>".$DocName.".pdf</a></td></tr></table>";

        $utc_str = gmdate("M d Y H:i:s", time());
        $to      = $contact;
        $subject = $Subject;
        $message = $Message.$docURL;

        $ContactFullname = "";
        $userdata = "";


        $sql = "SELECT SystemUsers.FirstName, SystemUsers.LastName FROM SystemUsers INNER JOIN ";
        $sql.= "SystemClients ON SystemUsers.SystemClientID = SystemClients.SystemClientID WHERE (SystemUsers.Email = '".$contact."')";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $userdata = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
            $ContactFullname = trim($userdata[0]->FirstName)." ".trim($userdata[0]->LastName);
        } catch(PDOException $e){
            $ContactFullname = "Recipient name not found.";
            echo '("error": {"text": '.$e->getMessage().'}';
        }


        $template = str_replace("[ToFullName]", $ContactFullname, $template);
        $template = str_replace("[Message]", $message, $template);

        $headers  = 'MIME-Version: 1.0' . "\r\n";   
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        $headers .= "From:" . "postmaster@projectvault.net" . "\r\n";
        $headers .= "To:" . $contact;

        mail($to, $subject, $template, $headers);

        $template = str_replace($ContactFullname, "[ToFullName]", $template);

        echo "Mail sent to: ".$contact."<br>";








        $Actiontext = "Mobile - Emailed Drawing to ".$ContactFullname." - ".$contact;

        $sql  = "INSERT INTO audit(EntityID, SystemUserID, ActionID, ActionDate, ActionText, PrivateAction) VALUES ";
        $sql .= "(CAST('$DocID' AS UNIQUEIDENTIFIER) ,CAST('$SystemUserID' AS UNIQUEIDENTIFIER) ,'95','$utc_str','".$Actiontext."', 0)";

        try{
            $db = new dbAudit($SystemClientID);
            $db = $db->connect();
            $stmt = $db->prepare($sql);
            $stmt->execute(); 
            $db = null;
            echo "Audit Written.<br>";
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'456}';
        }




    }    

});
