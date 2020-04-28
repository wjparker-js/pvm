<?php

ini_set('display_errors',1);
error_reporting(E_ALL|E_STRICT);


$ftp_server = "172.16.44.5";
$ftp_user = "BillParkerClientFileAccess";
$ftp_pass = "SealTeam6";
$conn_id = ftp_connect($ftp_server) or die("Couldn't connect to $ftp_server"); 
// try to login
if (@ftp_login($conn_id, $ftp_user, $ftp_pass)) {
    echo "Connected as $ftp_user@$ftp_server\n";
} else {
    echo "Couldn't connect as $ftp_user\n";
}
// close the connection
ftp_close($conn_id);  
?>