<?php
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$fp = fopen('iuploadpre.txt', 'w');



//////////////////////////////////////////////////////////////////////////////////////
class db{
    public function connect(){
        $dbConnection = new PDO("sqlsrv:Server=172.16.44.21; Database=PV", "", "");  
        $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
        return $dbConnection; 
    }       
}
//////////////////////////////////////////////////////////////////////////////////////


header('Access-Control-Allow-Origin: *');


//////////////////////////////////////////////////////////////////////////////////////////////////////
//$uploadPath    = "//filesrv-1/websites/SV/projectvaultuk.com/PublicPics/";
//$uploadPathLoc = "//filesrv-1/websites/SV/projectvaultuk.com/PublicPics/SCID/PID/LocationImages/";
//$uploadPathPre = "//filesrv-1/websites/SV/projectvaultuk.com//PublicPics/SCID/PID//DFX/BOID/";
//////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
$current_timestamp = date('Y-m-d H:i:s');
$deliver_by_date   = date('Y-m-d',strtotime("+7 days"));

$api = $_POST['api'];
$uid = $_POST['uid'];
$pid = $_POST['pid'];

$ref = $_POST['reference'];
if($ref === null){$ref = "No Reference Given."}
$ref = str_replace("'", "", $ref);

$tnid= $_POST['defecttype'];
if($tnid === null){$tnid = "No Defect Type Given."}

$loc = $_POST['location'];
if($loc === null){$loc = "No Location Given."}

$dis = $_POST['discipline'];
if($dis === null){$dis = "No Discipline Given."}

$eff = $_POST['effect'];
if($eff === null){$eff = "No Effect Given."}

$rea = $_POST['reason'];
if($rea === null){$rea = "No Reason Given."}

$det = $_POST['details'];
if($det === null){$det = "No Details Given."}    
$det = str_replace("'", "", $det);
//////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
$limg = $_POST['limg'];
if($limg === null){$limg = "data:image/jpeg;base64,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"}; 

$pimg = $_POST['pimg'];
if($pimg === null){$pimg = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAABiCAIAAACEdDvyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAbNSURBVHhe7Z3pleowDIVfXRQ09VANzVDMPMWWNy2JwxHEw7nfL5BlSZZvwMM2/34BCAWSAsFAUiAYSAoEA0mBYCApEAwkBYKBpEAwkBQIBpICwUBSIBhICgQDSYFgICkQDCQFgoGkQDCQFAjmKyX1fNx/fn7uT74LPsqspB4//4jbn9im5/22FXtBtX+pS2/jD0uKlfPz4PuVZylWjbwbSIr4RkldByRFQFKRQFJErKS2c/EtH2Q2bref+8Oc8aQnJ9+RRoc423gfpxyWBLU6r9iZ8vLcpNOtxuRIkKv0NLAS9wEp/XaH6FfU5RELLRw1pDK2tUM2IwXkMT/cSwRKqt+ADb69tVMspymid+TgvV764S55alw3wNQ8ZrGT5bEC7qWK0ZOdPHYkZQUkx7razizSTDQkkzNtTvT3bietbc5wRdRWJMfqKeO9SJSkyroHudfLr59XPIed3Dy5kzQuL5o2hQ0Jthr7rIudL6/sC9HM5CksNlaXuoA1eYmXqf52msmG8NzeZHaoze0isvFofVMEScrsxYZavLHyCaz0ZsMSynu+vOI6dny251aZLSAbEiWxvaaDNITKlGeKiYaRy1Fds0p/jRhJeXUSokk7nntwlGGaZcvIYufL8xfq2QcsJ2firvm4P2rx2SDiaaPbNHfgNCGS4nLs0aFJu54jdCSlI2QhTRsX7DdBFDtfXr2vfXcbULCcnImOeWdnDxpiBMymIRib8iFqIJ+oDhY4w/slNTRp17NQzziKodN+90Wx8+UR3kJ3G1CwnJyJjtlc1FxDeCoFHY7nQ4rq42F08yzrPUqxP/n0J2mj05YtI4qdL6/e176efcByciY6ZmNR2XPz3W1IcqO/7Jr6tr/zxhOhmzaS5c5SdiJLPpYtI2PMl+fl9+0DlpMz0TE7UlGO0i/fPyiPyNHMVkQRIym/UrllfF97Pu/pipL+jOzghuNKqGKny/MXetCAjOXkTHTMaqGTDSn39+sjcl6jFWEESapUSh79o3Ox9gtotuqYzwo5eF1yFya3K1nZlKiufL+SB/piS9LZ8vRCPfuA5eRMdMxKUux42BB269he4TSe+8rkoRVEej094p32c5KyKKtq68yr4ZtmN+tg51jcapz+lMleQj2tqBSmJrK2a7Y8a+6GZx+wnJyJjpnL7Bc625D6wm0m3WbGvslWdL6iwS8RJylCvHO39UBcIoXBUbkZozm/WnF+fMu0S8zbrpnynLmufcByciZ6NWpJERMNyRNlPHroyfNk59TbncZR/kVmJQXWRiqs4Wj3fUBSX4GvG/th751AUl8BC0c/j2atfVJRkNS3wNoh6FiUKUclOnux00eApL4H+Tm9dOh+PD92iGIgKRAMJAWCgaRAMJAUCAaSAsFAUiAYSAoEA0mBYCApEAwkBYKBpP4cH/+0ykk+Lan67qbzmdTP9au9zypZd7cSkNRIv5HhHxg79dkgSOpNXCkpqy2fltTi8rGApEZyP+pP46jdh6QOgaRGWFIPvqH23+uX+vj9+Ol7FpNkr+/TO3OQOuEF0/ZsSasevovhfAMvJWcf/imj6cIv4hpJpX7km6I3Zr/61ovvCLFf+gpJG0hehPENmMrczhynTnjBtD1b5n4SrbtQmht/WvOo8Ou4UFK1Y30n9R4Ur0Ef9QIfOhv9xDef2gum7dmSaObyEfEhQM3eubGJ0LlW4UpJtf42Eag9sJqdMAQZLKkTqb1g2s5Bae7gyyE7T3aUi9FCW41rJVUbVw3OuKUSvQsvSIrmS8pmn0ktyy5o+6ynvxYvwipcLal61XHvxLiWTUf27br+kqQUnOxUarUsRttnPT2/vZE1uFxSxcT7I8Z391Up6AVJ+TtzKrUXTNtnPf3y/JE1WEBSxZisYnx3X3naFZKSqb1g2j7r6fntjazBEpIq20dbZHfWVIne81BJnUrtBdP2WU8/uxdhFdaQVNuk/PJLN+62VivKMvkc78yJ1GwRrmwdknhpld3JbsVci1UkVVuY0Huw2cYXh7J17LizDSZ+JZUTqZuRPb3XkLy02q5CbqnNmGuxjqTq9UeM491A+pOfb1phyjYkRycPs1NJYz51X33xu/GL5L2zl9ayt9Xsx1yLhSS1bQtfheph5tyPobETpdl5uJqSFPHa77DxG4FZaH2SM5Iiuv9k5Mdci09LCnw9kBQIBpICwUBSIBhICgQDSYFgICkQDCQFgoGkQDCQFAgGkgLBQFIgGEgKBANJgWAgKRAMJAWCgaRAMJAUCAaSAsFAUiAYSAoEA0mBYCApEAwkBYKBpEAwkBQIBpICwUBSIBhICgQDSYFQfn//A0vimayUJFIvAAAAAElFTkSuQmCC"}; 
////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////
if (preg_match('/^data:image\/(\w+);base64,/', $limg, $ltype)) {

    $limg  = substr($limg, strpos($limg, ',') + 1);
    //$ltype = strtolower($ltype[1]);

    $ltype = "png";

    if (!in_array($ltype, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
        throw new \Exception('invalid image type');
    }

    $limg = base64_decode($limg);

    if ($limg === false) {
        throw new \Exception('base64_decode failed');
    }

    //$locimg = "limg.{$ltype}";
    //file_put_contents($locimg , $limg);

} else {
    throw new \Exception('did not match limg URI with image limg');
}

/////////////////////////////////////////////////////////////////////

if (preg_match('/^data:image\/(\w+);base64,/', $pimg, $ptype)) {

    $pimg  = substr($pimg, strpos($pimg, ',') + 1);
    //$ptype = strtolower($ptype[1]);

    $ptype = "png";

    if (!in_array($ptype, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
        throw new \Exception('invalid image type');
    }

    $pimg = base64_decode($pimg);

    if ($pimg === false) {
        throw new \Exception('base64_decode failed');
    }

    //$preimg = "pimg.{$ptype}";
    //file_put_contents($preimg , $pimg);

} else {
    throw new \Exception('did not match pimg URI with image pimg');
}
////////////////////////////////////////////////////////////////////



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
$sql.= "SubOwner, SubOwner2, DisciplineID, EffectID, ReasonID, RFIImage) values (";

$sql.= $locationID.",";
$sql.= "5,";
$sql.= $subType.",";
$sql.= "CONVERT(uniqueidentifier,'".$uid."'),";
$sql.= "CONVERT(uniqueidentifier,'".$pid."'),";
$sql.= "0,";
$sql.= "GETUTCDATE(),";
$sql.= "'".$deliver_by_date."',";
$sql.= "'".$orderReference." - #####',";
$sql.= "'".$ref."',";
$sql.= "'".$det."',";
$sql.= "CONVERT(uniqueidentifier,'".$RecipientID."'),";
$sql.= "GETUTCDATE(),";
$sql.= "'false', 'false', 'false', 'false', 'false', 'false', ";
$sql.= "CONVERT(uniqueidentifier,'".$SubOwner."'),";
$sql.= "CONVERT(uniqueidentifier,'".$SubOwner2."'),";
$sql.= "CONVERT(uniqueidentifier,'".$DesciplineID."'),";
$sql.= "CONVERT(uniqueidentifier,'".$effectID."'),";
$sql.= "CONVERT(uniqueidentifier,'".$reasonID."'),";
$sql.= "1)";

fwrite($fp,$sql);
echo $sql;

try{
    $db = new db();
    $db = $db->connect();  
    $statement = $db->prepare($sql);
    $statement->execute();
    $id = $db->lastInsertId(); 
    //$stmt = $db->query($sql);
    //$branchorders = $stmt->fetchALL(PDO::FETCH_OBJ);
    //$id = $db->lastInsertId();
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}
























///////////////////////Get BranchOrder ID///////////////////////////////

$sql = "Select OrderID from Branchorders where SytemOrderNumber = ".$id;

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $branchids = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$BranchID = $branchids[0]->OrderID;

//////////////////////////////////////////////////////////////////////////////

$uploadPath = "//filesrv-1/websites/SV/projectvaultuk.com/PublicPics/";                                                                                                                                                                                                                                                                                                                                                                                                             = "//filesrv-1/websites/SV/projectvaultuk.com/PublicPics/";

//////////////////////////////////////////////////////////////////////////////

$target_path = $uploadPath.$cid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true);}

$target_path = $target_path."/".$pid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true);}

$target_path = $target_path."/"."LocationImages";
if (!file_exists($target_path)) {mkdir($target_path, 0777, true);}

$loctarget_path = $target_path."/".$BranchID.".".$ltype;
file_put_contents($loctarget_path, $limg);

////////////////////PreImage////////////////////////////////////

$target_path = $uploadPath.$cid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true);}

$target_path = $target_path."/".$pid;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true);}

$target_path = $target_path."/"."DFX";
if (!file_exists($target_path)) {mkdir($target_path, 0777, true);}

$target_path = $target_path."/".$BranchID;
if (!file_exists($target_path)) {mkdir($target_path, 0777, true);}

$pretarget_path = $target_path."/".$BranchID.".".$ptype;
file_put_contents($pretarget_path , $pimg);

////////////////////////////////////////////////////////////////

/*//fwrite($fp, $target_path);
 
if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
    echo "Upload and move success";
} else {
    echo $target_path;
    echo "There was an error uploading the file, please try again!";
}
*/

$out = prepareImageDBString($pretarget_path);

header('Content-Type: image/jpeg');
list($width, $height) = getimagesize($pretarget_path);
$thumb  = imagecreatetruecolor(200, 200);
$source = imagecreatefromjpeg($pretarget_path);
imagecopyresized($thumb, $source, 0, 0, 0, 0, 200, 200, $width, $height);
imagejpeg($thumb,'thumbtemp.jpg');

$thumb = prepareImageDBString('thumbtemp.jpg');


$sql = "INSERT INTO RFIImages (SnapShot,SnapShotThumb,RFIID,FileExt,Type) VALUES (";
$sql.= "CONVERT(VARBINARY(max), ".$out."),";
$sql.= "CONVERT(VARBINARY(max), ".$thumb."),";
$sql.= "CONVERT(uniqueidentifier,'".$BranchID."'),";
$sql.= "'.jpg',";
$sql.= "0)";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $rfiimages = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

fclose('iuploadpre.txt');

function prepareImageDBString($filepath)
{
    $out = 'null';
    $handle = @fopen($filepath, 'rb');
    if ($handle)
    {
        $content = @fread($handle, filesize($filepath));
        $content = bin2hex($content);
        @fclose($handle);
        $out = "0x".$content;
    }
    return $out;
}


?>