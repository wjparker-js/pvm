<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


$file = '\\\\172.16.44.5\\e$\\PV\\0afa8514-9486-4672-a5ca-17f4569108f0\\P\\8a9c3c4e-5667-4697-b012-d2b899bed784\\0ccedfd4-08cc-4c79-8e5d-6b650cf6cc9b';
$newfile = 'docs\example2.pdf';

if (!copy($file, $newfile)) {
    echo "failed to copy $file...\n";
}

/*
// path to remote file
$ftp_server    = "172.16.44.5";
$remote_file   = '0afa8514-9486-4672-a5ca-17f4569108f0\P\275be9bc-d725-4440-96bf-dbe3eadde945/96f4f812-859e-4fb5-9482-fd129b3db215';
$local_file    = 'docs/file12.pdf';
$ftp_user = "BillParkerClientFileAccess";
$ftp_pass = "SealTeam6";

/* connect
$conn_id = @ftp_connect($ftp_server);
if (!$conn_id) die('could not connect.');

// try to login

if (@ftp_login($conn_id, $ftp_user, $ftp_pass)) {
    echo "Connected as $ftp_user@$ftp_server\n";
    ftp_pasv($conn_id, true);
    if (ftp_get($conn_id, $local_file, $remote_file, FTP_BINARY)) {
        $okk=2;
        echo $okk;
    }
} else {
    echo "Couldn't connect as $ftp_user_name\n";
}

*/
?>