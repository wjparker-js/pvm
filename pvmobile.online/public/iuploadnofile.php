<?php

header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//////////////////////////////////////////////////////////////////////////////////////
class db{
    public function connect(){
        $dbConnection = new PDO("sqlsrv:Server=172.16.44.21; Database=PV", "", "");  
        $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
        return $dbConnection; 
    }       
}
//////////////////////////////////////////////////////////////////////////////////////

$current_timestamp = date('Y-m-d H:i:s');
$deliver_by_date   = date('Y-m-d',strtotime("+7 days"));

$api = $_POST['api'];
$uid = $_POST['uid'];
$pid = $_POST['pid'];
$pairedid = $_POST['pairedid'];
$ref = $_POST['reference'];
$tnid= $_POST['defecttype'];
$loc = $_POST['location'];
$dis = $_POST['discipline'];
$eff = $_POST['effect'];
$rea = $_POST['reason'];
$det = $_POST['details'];
$limg = $_POST['limg'];
$pimg = $_POST['pimg'];

$fp = fopen('000iuploadpre.txt', 'w');

fwrite($fp,$ref);
fwrite($fp,$tnid);
fwrite($fp,$loc);
fwrite($fp,$dis);
fwrite($fp,$eff);
fwrite($fp,$rea);
fwrite($fp,$det);
fwrite($fp,$limg);
fwrite($fp,$pimg);
fwrite($fp,$pairedid);

///////////////////////////////////////////////////////////////////////////
$sql  = "SELECT SystemClientID FROM projects WHERE ProjectID='".$pid."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $scid = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$cid = $scid[0]->SystemClientID;


////////////////////////////////////////////////////////////////////////////////////////////////
$sql  = "SELECT location FROM viewLocationMap WHERE ProjectID='".$pid."' and Name='".$loc."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $locations = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$locationID = $locations[0]->location;


///////////////////////////////////////////////////////////////////////////////////////
$sql  = "SELECT RFIEffectID FROM ProjectSystemRFIEffect WHERE EffectName='".$eff."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $effects = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$effectID =  $effects[0]->RFIEffectID;


////////////////////////////////////////////////////////////////////////////////////////
$sql  = "SELECT RFIReasonID FROM ProjectSystemRFIReasons WHERE ReasonName='".$rea."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $reasons = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$reasonID =  $reasons[0]->RFIReasonID;


////////////////////////////////////////////////////////////////////////
$sql  = "SELECT SubTypeID FROM IssueSubTypes WHERE (TypeID = 5) and ";
$sql.= "ProjectID = '".$pid."' and Typename = '".$tnid."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $subTypes = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$subType = $subTypes[0]->SubTypeID;
$orderReference = $tnid;


////////////////////////////////////////////////////////////////////////////////
$sql = "SELECT GroupID, SubTypeOwner, SubTypeContractor, SubTypeComercial, ";
$sql.= "SubTypeID FROM DistinctDisciplines ";
$sql.= "WHERE ProjectID='".$pid."' and GroupName='".$dis."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $disciplines = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$GroupID      = $disciplines[0]->GroupID;
$RecipientID  = $disciplines[0]->SubTypeOwner;
$SubOwner     = $disciplines[0]->SubTypeContractor;
$SubOwner2    = $disciplines[0]->SubTypeComercial;
$SubTypeID    = $disciplines[0]->SubTypeID;


/////////////////////////////////////////////////////////////
$sql = "SELECT DesciplineID FROM ProjectRFIDesciplines ";
$sql.= "WHERE GroupID = '".$GroupID."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $disciplinesid = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$DesciplineID = $disciplinesid[0]->DesciplineID;


/////////////////////////////////////////////////////////////////////////////////////////////////
$sql = "Insert into BranchOrders ";
$sql.= "(LocationID, Type, SubType, OwnerID, ProjectID, OrderStatus, DateCreated, DeliverBy, ";
$sql.= "OrderReference, OrderSubject, SpecialInstructions, RecipientID, LastModified, "; 
$sql.= "AutoUpdate, UpdateRemove, UpdateSupersede, UpdateNew, OwnerCreator, BIM, ";

if($SubOwner2 == ""){
$sql.= "SubOwner, DisciplineID, EffectID, ReasonID, PairedID, RFIImage) values (";
}

if($SubOwner2 != ""){
$sql.= "SubOwner, SubOwner2, DisciplineID, EffectID, ReasonID, PairedID, RFIImage) values (";
}

$sql.= $locationID.",";
$sql.= "5,";
$sql.= $subType.",";
$sql.= "CONVERT(uniqueidentifier,'".$uid."'),";
$sql.= "CONVERT(uniqueidentifier,'".$pid."'),";

$sql.= "-50,";
$sql.= "GETUTCDATE(),";
$sql.= "'".$deliver_by_date."',";
$sql.= "'".$orderReference." - #####',";
$sql.= "'".$ref."',";

$sql.= "'".$det."',";
$sql.= "CONVERT(uniqueidentifier,'".$RecipientID."'),";
$sql.= "GETUTCDATE(),";
$sql.= "'false', 'false', 'false', 'false', 'false', 'false', ";
$sql.= "CONVERT(uniqueidentifier,'".$SubOwner."'),";

if($SubOwner2 != ""){
    $sql.= "CONVERT(uniqueidentifier,'".$SubOwner2."'),";
}

$sql.= "CONVERT(uniqueidentifier,'".$DesciplineID."'),";
$sql.= "CONVERT(uniqueidentifier,'".$effectID."'),";
$sql.= "CONVERT(uniqueidentifier,'".$reasonID."'),";
$sql.= "'".$pairedid."',";
$sql.= "1)";
fwrite($fp,$sql);
try{
    $db = new db();
    $db = $db->connect();  
    $statement = $db->prepare($sql);
    $statement->execute();
    $lastid = $db->lastInsertId(); 
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}
fwrite($fp,$lastid);

///////////////////////Get BranchOrder ID///////////////////////////////
$sql = "Select OrderID from Branchorders where SytemOrderNumber = ".$lastid;
fwrite($fp,$sql);
try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $lastbranchid = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$lastBranchID = $lastbranchid[0]->OrderID;

fwrite($fp,$lastBranchID);



























////////////////////Location Image/////////////////////////////////////////////////////////////
$uploadPath = "//filesrv-1/websites/SV/projectvaultuk.com/PublicPics/"; 

$limg  = substr($limg, strpos($limg, ',') + 1);
$limg  = base64_decode($limg);
$ltype = "jpg";

$target_path = $uploadPath.$cid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/".$pid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/"."LocationImages";
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$loctarget_path = $target_path."/".$lastBranchID.".".$ltype;
fwrite($fp,$loctarget_path);
file_put_contents($loctarget_path, $limg);

///////////////////////////////////////////////////////////////////////////////////////////////

////////////////////PreImage///////////////////////////////////////////////////////////////////

$pimg  = substr($pimg, strpos($pimg, ',') + 1);
$pimg  = base64_decode($pimg);
$ptype = "jpg";

$target_path = $uploadPath.$cid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/".$pid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/"."DFX";
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$target_path = $target_path."/".$lastBranchID;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true); echo "Made: ".$target_path."<br>";}

$pretarget_path = $target_path."/".$lastBranchID.".".$ptype;
fwrite($fp,$pretarget_path);
file_put_contents($pretarget_path , $pimg);

///////////////////////////////////////////////////////////////////////////////////////////////

//$scaleX = this.canvas.width / image.width;
//$scaleY = this.canvas.width / (image.height * (image.width / image.height));

$out = prepareImageDBString($pretarget_path);

header('Content-Type: image/jpg');
list($imwidth, $imheight) = getimagesize($pretarget_path);
$imthumb  = imagecreatetruecolor(200, 200);
$imsource = imagecreatefromjpg($pretarget_path);
imagecopyresized($imthumb, $imsource, 0, 0, 0, 0, 200, 200, $imwidth, $imheight);
imagejpg($imthumb,'thumbtemp.jpg');

$imthumb = prepareImageDBString('thumbtemp.jpg');


$sql = "INSERT INTO RFIImages (SnapShot,SnapShotThumb,RFIID,FileExt,Type) VALUES (";
$sql.= "CONVERT(VARBINARY(max), ".$out."),";
$sql.= "CONVERT(VARBINARY(max), ".$imthumb."),";
$sql.= "CONVERT(uniqueidentifier,'".$lastBranchID."'),";
$sql.= "'.jpg',";
$sql.= "0)";
fwrite($fp,$sql);
try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $rfiimages = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

fclose('000iuploadpre.txt');

function prepareImageDBString($filepath){
    $out = 'null';
    $handle = @fopen($filepath, 'rb');
    if ($handle)
    {
        $content = @fread($handle, filesize($filepath));
        //echo $filepath;
        //echo $content;
        $content = bin2hex($content);
        @fclose($handle);
        $out = "0x".$content;
    }
    return $out;
}


?>