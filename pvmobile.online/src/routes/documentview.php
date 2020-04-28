<?php

header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/documentview/{cid}/{pid}/{did}/{ext}/{action}', function (Request $request, Response $response, $args) {
    
    $cid = strtolower($args['cid']);
    $pid = strtolower($args['pid']);
    $did = strtolower($args['did']);
    $ext = strtolower($args['ext']);
    $act = strtolower($args['action']);

    $ftp_server    = "172.16.44.5";
    $remote_file   = $did;
    $local_file    = "docs/".$did.$ext;
    $ftp_user      = "BillParkerClientFileAccess";
    $ftp_pass      = "SealTeam6";

    if($act == "delete"){
        unlink($local_file);
    } 
    else 
    {
        
        $sql = "SELECT SystemClientID from Projects where Status = '2' and ProjectID = '".$pid."'";
        
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $SysCID = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("get SystemClientID error": {"text": '.$e->getMessage().'}';
        }
        
        $SystemClientID   = $SysCID[0]->SystemClientID;

        

        if(!is_dir("docs")) {
            mkdir("docs/", 0777);
        }


        //$conn_id = ftp_connect($ftp_server);
        $conn_id = ftp_connect($ftp_server) or die("Couldn't connect to $ftp_server");

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

            if (ftp_chdir($conn_id, $pid)) {
               //echo "Current directory is now: " . ftp_pwd($conn_id) . "<br>";
            } else { 
               //echo "Couldn't change directory PID<br>";
            }

            //echo "Required File is: " . $remote_file. "<br>";
            //echo "local File is: " . $local_file . "<br>";

            if (ftp_get($conn_id, $local_file, $remote_file, FTP_BINARY)) {
                $message = $local_file;
                //fclose($handle);
            } else {
                $message = "No File";            
            }

        } else {
                $message = "Couldn't login";
        }  
    
        ftp_close($conn_id);
    }


    return nl2br($message); 

});



