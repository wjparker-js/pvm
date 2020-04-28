<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/qrdefects/{apikey}/{qrcode}/{pid}/{type}', function (Request $request, Response $response, $args) {

    $ApiKey = $args['apikey'];
    $qrcode = $args['qrcode'];
    $type   = $args['type'];
    $pid    = $args['pid'];

    ///////////////////////////// Get Defects

    if ($type == "defectssticker"){

        $sql ="SELECT *  FROM  BranchOrders WHERE projectid='".$pid."' and (OrderID = '".$qrcode."')";
                                                                              
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $defects = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $defectsj = json_encode($defects);
        return $defectsj;
    }


    if ($type == "defectspage"){

        $sql ="SELECT *  FROM  BranchOrders WHERE projectid='".$pid."' and LocationID in ";
        $sql.="(SELECT LID  FROM  ProjectLocationMap WHERE (LocationMapID = '".$qrcode."'))";
                                                                              
        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $defects = $stmt->fetchALL(PDO::FETCH_OBJ);
            $db = null;
        } catch(PDOException $e){
            echo '("error": {"text": '.$e->getMessage().'}';
        }

        $defectsj = json_encode($defects);
        return $defectsj;
    }


});