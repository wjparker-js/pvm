<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/qrroom/{apikey}/{qrcode}/{pid}/{type}', function (Request $request, Response $response, $args) {

    $ApiKey = $args['apikey'];
    $qrcode = $args['qrcode'];
    $type   = $args['type'];
    $pid    = $args['pid'];

    ///////////////////////////// Get Location

    if ($type == "snaglocationsticker"){

        $sql ="SELECT Name FROM ProjectLocationMap WHERE projectid='".$pid."' and LID IN ";
        $sql.="(SELECT LocationID  FROM  BranchOrders WHERE (OrderID = '".$qrcode."'))";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $roomlocation = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $roomlocationj = json_encode($roomlocation);
        return $roomlocationj;
    }


    if ($type == "snaglocationpage"){

        $sql ="SELECT Name FROM ProjectLocationMap WHERE projectid='".$pid."' and LocationMapID = '".$qrcode."' ";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $roomlocation = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $roomlocationj = json_encode($roomlocation);
        return $roomlocationj;
    }

});