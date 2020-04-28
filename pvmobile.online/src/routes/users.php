<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/users/{user}/{pass}', function (Request $request, Response $response, $args) {

    $user = trim($args['user']);

    if ($args['pass'] === "xxx-xxx"){       

        $sql =  "SELECT ";
        $sql .= "SystemUsers.SystemUserID, SystemUsers.SystemClientID, SystemUsers.Email, SystemUsers.PIN, ";
        $sql .= "RTRIM(SystemUsers.FirstName) + ' ' + RTRIM(SystemUsers.LastName) AS Name, UserView.CompanyName AS Company ";
        $sql .= "FROM SystemUsers INNER JOIN  UserView ON SystemUsers.SystemUserID = UserView.SystemUserID WHERE ";
        $sql .= "SystemUsers.Email = '".$user."'";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $users = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"Getting basic user details.": '.$e->getMessage().'}'; 
        } 

        

        if (empty((array) $users)){

            header('Content-type:application/json');
            $users = '[{"SystemUserID": "Not Found","Email": "'.$user.'","PIN": "xxxx"}]'; 
            return $users; 

        } else {

            $digits  = 4;
            $theKey  = rand(pow(10, $digits-1), pow(10, $digits)-1); 
            //$thePIN = $users[0]->PIN; 

            //if (strlen($thePIN) == 0) {

                $theDate = date("l jS \of F Y");

                $text = "Your ProjectVault PIN ";

                $html = "<center><table width='40%' border='0' cellpadding='10' cellspacing='0' bgcolor='#2D3054'> ";
                $html.= "<tr><td height='247'><table  border='0' cellspacing='0' cellpadding='10'> ";
                $html.= "<tr bgcolor='#FFFFFF'><td width='37%' height='50' align='left' valign='middle'> ";
                $html.= "<img src='https://projectvaultuk.com/images/Sys_Logo_PV4_SG-White.png' alt='PV Logo' "; 
                $html.= "longdesc='https://projectvaultuk.com/images/Sys_Logo_PV4_SG-White.png' /></td> ";
                $html.= "<td height='50' align='right' valign='middle'>&nbsp;</td></tr> ";
                $html.= "<tr><td height='45' colspan='2' align='Left' valign='middle'><p> ";
                $html.= "<span style='font-size:16pt; font-family:Verdana; color:#FFFFFF;'> ";
                $html.= "PIN Code From ProjectVault</span></td></tr><tr> ";
                $html.= "<TD height='' colspan='2' valign='top' bgcolor='#FFFFFF'> ";
                $html.= "<P><span style='font-family: Trebuchet MS; color: #808080; font-size: 10pt;'><strong> ";
                $html.= "You have requested a  PIN CODE to access the mobile app.</strong></span></p> ";
                
                $html.= " <table width='99%' border='0' cellpadding='5' cellspacing='0' bgcolor='#e8e8e8'><tr> ";
                $html.= "<td 'width=35%'>Your new PIN is: <span style='font-family: Trebuchet MS; color: #000000; font-size: 14pt;'>&nbsp;&nbsp;";
                $html.= $theKey."</span></td><td 'width=65%'><a href='https://pvmobile.online/api/confirm/".$user."/".$theKey."'>";
                $html.= "<button bgcolor='#2D3054' width='100%'>Confirm and accept the PIN</button></a></td></tr>";
                $html.= "</table></td></tr></table></body>";

                $html = str_replace("'","''",$html);

            //}

            $sql1 = "INSERT into Emails (Status,DateCreated,SendOn,FromID,ToAddress,Subject,HTMLBody,TXTBody,Priority,ReadReceipt,DeliveryReceipt ) values (";        
            $sql1.= "0,GETUTCDATE(),GETUTCDATE(),'43af73c0-654d-481e-b1ca-1c3cf44cd08e','".$user."','".$text."','".$html."','".$text."',1,0,0)";

            try{
                $db = new db();
                $db = $db->connect();
                $stmt = $db->query($sql1);      
                $db = null;
            } catch(PDOException $e){
                echo '("error": {"Insert Email Error": '.$e->getMessage().'}'; 
            }

            $key   = "PIN";
            $users[0]->$key = $theKey;
            //$users[$key] = $theKey;

            header('Content-type:application/json');
            return json_encode($users);
        }

        //$isauser = $users[0]->SystemUserID;             
        //$returnerror = array('0' => array('Email' => 'in new user'));             
        //return json_encode($returnerror);
    }


















    if ($args['pass'] !== "xxx-xxx"){

    $pass = md5(trim($args['pass']));
    $pin  = trim($args['pass']);    
        
    $status = "Not OK";

    $sql =  "SELECT ";
    $sql .= "SystemUsers.SystemUserID, SystemUsers.SystemClientID, SystemUsers.Email, ";
    $sql .= "RTRIM(SystemUsers.FirstName) + ' ' + RTRIM(SystemUsers.LastName) AS Name, UserView.CompanyName AS Company ";
    $sql .= "FROM SystemUsers INNER JOIN  UserView ON SystemUsers.SystemUserID = UserView.SystemUserID WHERE ";

    $sql .= "((SystemUsers.Email = '$user') AND (SystemUsers.apihash = '$pass') AND (SystemUsers.Active = 1) AND ";
    $sql .= "(SystemUsers.Locked <> 1 OR SystemUsers.Locked IS NULL)) ";
    $sql .= " or ";
    $sql .= "((SystemUsers.Email = '$user') AND (SystemUsers.PIN = '$pin') AND (SystemUsers.Active = 1) AND ";
    $sql .= "(SystemUsers.Locked <> 1 OR SystemUsers.Locked IS NULL))";

    //echo $sql;

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $users = $stmt->fetchALL(PDO::FETCH_OBJ);        
        $db = null; 
    } catch(PDOException $e){
        echo '("Logging in proper error": {"text": '.$e->getMessage().'}';    
    }

    if( (array)$users) {

        $guid = createGUID();
        $users[0]->apiKey = $guid;
        $SystemUserID  = $users[0]->SystemUserID;
        $utc_str       = gmdate("M d Y H:i:s", time());       
        $validUntil    = strtotime('+30 days', time());
        $utc_valid_str = gmdate("M d Y H:i:s", $validUntil);
        
        $sql = "INSERT INTO APIKey(KeyID, SystemUserID, Created, ValidUntil) VALUES ('$guid','$SystemUserID','$utc_str','$utc_valid_str')";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->prepare($sql);
            $stmt->execute(); 
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'456}';
        }
      

        header('Content-type:application/json');
        return json_encode($users);

    } else {

        header('Content-type:application/json');
        $returnerror = array('0' => array('Email' => 'Not Found'));
        return json_encode($returnerror);
    }
  } 

});



function createGUID() { 
    
        $token      = $_SERVER['HTTP_HOST'];
        $token     .= $_SERVER['REQUEST_URI'];
        $token     .= uniqid(rand(), true);
        $hash       = strtoupper(md5($token));
        $guid       = '';
        
        //XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX   
        $guid .= substr($hash,  0,  8) . 
                '-' .
                substr($hash,  8,  4) .
                '-' .
                substr($hash, 12,  4) .
                '-' .
                substr($hash, 16,  4) .
                '-' .
                substr($hash, 20, 12);
                
        return $guid;
    } 
