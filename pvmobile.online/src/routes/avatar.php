<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/avatar/{uid}', function (Request $request, Response $response, $args) {
   
    $checkavatarname = "//filesrv-1/Websites/SV/projectvaultuk.com/PublicPics/".$args['uid'].".jpg";

    if (file_exists($checkavatarname)) {
        $avatar = "https://go.projectvaultuk.com/PublicPics/".$args['uid'] .".jpg";
    } else {
        $avatar = "https://go.projectvaultuk.com/PublicPics/avatar.png";
    }

    return json_encode($avatar);        

});

