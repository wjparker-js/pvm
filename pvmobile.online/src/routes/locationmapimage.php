<?php

header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/locationmapimage/{apikey}/{pid}/{uid}/{locname}', function (Request $request, Response $response, $args) {

        $ApiKey      = $args['apikey'];
        $ProjectID   = $args['pid'];
        $UserName    = $args['uid'];
        $LocName     = $args['locname'];



        //$sql  = "SELECT  Top(1) CAST(locationimage as image) as locationimage FROM viewLocationMap ";  

        $sql  = "SELECT  Top(1) locationimage FROM viewLocationMap ";
        $sql .= "where ProjectID = '".$ProjectID."' and Name ='".$LocName."' "; //FOR XML AUTO, BINARY BASE64";

        try{
            $db = new db();
            $db = $db->connect();
            $stmt = $db->query($sql);
            $locationImg = $stmt->fetchALL(PDO::FETCH_OBJ);
            //$loc = $locationImg["0"].locationimage;
            $db = null;
        } catch(PDOException $e){
            return '("error": {"text": '.$e->getMessage().'}';
        }

        $alocationImg = base64_encode($locationImg[0]->locationimage);

        //$locationImgj = json_encode($alocationImg);

        header('Content-type: application/json');
        $locationImgj = '[{"locationimage":"'.$alocationImg.'"}]';

        //return $loc;
//print_r($locationImg);
        return $locationImgj;  

});