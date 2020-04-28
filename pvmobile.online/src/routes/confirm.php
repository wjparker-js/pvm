<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/api/confirm/{user}/{pin}', function (Request $request, Response $response, $args) {

    $user = trim($args['user']);
    $pin  = trim($args['pin']);

    $sql = "update SystemUsers set PIN = '".$pin."' where Email = '".$user."'";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);      
        $db = null;
    } catch(PDOException $e){
        echo '("error": {"Update PIN Error": '.$e->getMessage().'}'; 
    }


$html = "<center><br><br><br><br><table width='40%' border='0' cellpadding='10' cellspacing='0' bgcolor='#2D3054'> ";
$html.= "<tr><td height='247'><table  border='0' cellspacing='0' cellpadding='10'> ";
$html.= "<tr bgcolor='#FFFFFF'><td width='37%' height='50' align='left' valign='middle'> ";
$html.= "<img src='https://projectvaultuk.com/images/Sys_Logo_PV4_SG-White.png' alt='PV Logo' "; 
$html.= "longdesc='https://projectvaultuk.com/images/Sys_Logo_PV4_SG-White.png' /></td> ";
$html.= "<td height='50' align='right' valign='middle'>&nbsp;</td></tr> ";
$html.= "<tr><td height='45' colspan='2' align='Left' valign='middle'><p> ";
$html.= "<span style='font-size:16pt; font-family:Verdana; color:#FFFFFF;'> ";
$html.= "PIN Code Accepted</span></td></tr><tr> ";
$html.= "<TD height='' colspan='2' valign='top' bgcolor='#FFFFFF'> ";
$html.= "<P><span style='font-family: Trebuchet MS; color: #808080; font-size: 10pt;'><strong> ";
$html.= "Your PIN Code access has been confirmed</strong></span></p> ";
$html.= "<P><strong><span style='font-family: &quot;Trebuchet MS&quot;; font-size: 10pt; color: "; 
$html.= "#808080'><a href='https://projectvaultuk.com/PVHelpV8/MobileApp.html'> ";
$html.= "Click here to view Help Pages on Mobile Access</a></span></strong></p></td></table> ";
$html.= "<table width='100%' border='0' cellspacing='0' cellpadding='0'> ";
$html.= "<tr bgcolor='#FFFFFF'> ";
$html.= "<td height='12' align='right'><span style='font-family:'Courier New', Courier, monospace; "; 
$html.= "color: #999999; font-family:Verdana;font-size: 7pt;'> PV4//WP01//[MSID]/".date("d/m/Y")."&nbsp;</span></td> ";
$html.= "</tr></table></td></tr></table> ";

    echo $html;

});



/*
    $html = "<body><center><br><br><table width='500' border='0' cellpadding='10' cellspacing='0' bgcolor='#2D3054'><tr>";
    $html.= "<td height='450'><table width='99%' border='0' cellspacing='0' cellpadding='10'>";
    $html.= "<tr bgcolor='#FFFFFF'><td width='50%' height='50' align='left' valign='middle'><img ";
    $html.= "src='https://projectvaultuk.com/images/Sys_Logo_PV4_SG-White.png' alt='PV Logo' ";
    $html.= "</td> ";
    $html.= "</tr><tr><tr> ";
    $html.= "<td height=' align='top' bgcolor='#FFFFFF'> ";
    $html.= "<table width='99%' border='0' cellpadding='5' cellspacing='0' bgcolor='#ffffff'><tr> ";
    $html.= "<td 'width=100%' style='font-size:16pt; font-family:Verdana; color:#000000;'>Your new PIN has been updated.</td></tr>";
    $html.= "</table></td></tr></table></body>";
*/
