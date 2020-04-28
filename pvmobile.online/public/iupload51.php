<?php
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


///////////////////////////////// Set image upload location ////////////

//testing
$uploadPath = "//filesrv-1/websites/SV/dev.wowow.es/PublicPics/";

//production
//$uploadPath = "//filesrv-1/websites/SV/projectvaultuk.com/PublicPics/";

/////////////////////////////////////////////////////////////////////////


$fp  = fopen('51.txt', 'w');

$api = $_POST['api'];
$uid = $_POST['uid'];
$pid = $_POST['pid'];
$son = $_POST['son'];
$det = $_POST['det'];
$det = str_replace("'", "", $det);
$cid = $_POST['cid'];

fwrite($fp, "uid");
fwrite($fp, $uid);
fwrite($fp, "pid");
fwrite($fp, $pid);
fwrite($fp, "son");
fwrite($fp, $son);
fwrite($fp, "det");
fwrite($fp, $det);
fwrite($fp, "cid");
fwrite($fp, $cid);
fwrite($fp, "");



class dbClient{
    public $dbname;
    public function __construct($proj) {
            $this->dbname  = $proj;            
       }
    public function connectToClientDB(){
        $dbConnection = new PDO("sqlsrv:server=172.16.44.21; Database=".$this->dbname."", "", "");  
        $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
        return $dbConnection; 
    }
};

class db{
    public function connect(){
        $dbConnection = new PDO("sqlsrv:Server=172.16.44.21; Database=PV", "", "");  
        $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
        return $dbConnection; 
    }       
}










$sql = "Select Name from Projects where ProjectID = '".$pid."'";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $projects = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$projectname = $projects[0]->Name;










$sql = "Select OrderID,ownerID,subowner,subowner2,OrderReference from Branchorders where SytemOrderNumber = ".$son;

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $branchids = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

$BranchID  = $branchids[0]->OrderID;
$Owner     = $branchids[0]->ownerID;
$subOwner  = $branchids[0]->subowner;
$subOwner1 = $branchids[0]->subowner2;
$oref      = $branchids[0]->OrderReference;


fwrite($fp, "branch order stuff  -");
fwrite($fp, $sql);
fwrite($fp, "       ");
fwrite($fp, $BranchID);
fwrite($fp, "       ");
fwrite($fp, $oref);
fwrite($fp, "       ");
fwrite($fp, $uid);
fwrite($fp, "       ");
fwrite($fp, $Owner);
fwrite($fp, "       ");
fwrite($fp, $subOwner);
fwrite($fp, "       ");
fwrite($fp, $subOwner1);
fwrite($fp, "       ");











/////////// Set at top of app ////////////////

$target_path = $uploadPath.$cid;
if (!file_exists($target_path)) {
    mkdir($target_path, 0777, true);
}

$target_path = $target_path."/".$pid;
if (!file_exists($target_path)) {
    mkdir($target_path, 0777, true);
}

$target_path = $target_path."/"."DFX";
if (!file_exists($target_path)) {
    mkdir($target_path, 0777, true);
}

$target_path = $target_path."/".$BranchID;
if (!file_exists($target_path)) {
    mkdir($target_path, 0777, true);
}

$target_path = $target_path."/".$BranchID."Post.jpg";
$thumb_path  = $target_path."/"."thumbtemp.jpg";
 
if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
    echo "Upload and move success";
} else {
    echo $target_path;
    echo "There was an error uploading the file, please try again!";
}













$sql = "Update BranchOrders set ";
$sql.= "OrderStatus = 52, ";
$sql.= "EndFixDate = GETUTCDATE(), ";
$sql.= "LastModified = GETUTCDATE() ";
$sql.= "where SytemOrderNumber = ".$son; 

try{
    $db = new db();
    $db = $db->connect();  
    $statement = $db->prepare($sql);
    $statement->execute();
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}

fwrite($fp, "update branch order   -");
fwrite($fp, $sql);
fwrite($fp, "                       ");













$sql = "INSERT into Notes (ObjectID, ObjectType, OwnerID, DateCreated, Subject, Note, Active) values (";
$sql.= "'".$BranchID."',";
$sql.= "1,"; 
$sql.= "'".$uid."',"; 
$sql.= "GETUTCDATE(),";
$sql.= "'',";
$sql.= "'".$det."',";
$sql.= "1)";

try{
    $dbc = new dbClient($cid);
    $dbc = $dbc->connectToClientDB();
    $addnotes = $dbc->query($sql);
    $dbc = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
} 

fwrite($fp, "INSERT into Notes sql    - ");
fwrite($fp, $sql);
fwrite($fp, "                           ");











$sql="Select top(1) NoteID from Notes where ObjectID = '".$BranchID."' and Note = '".$det."'";

fwrite($fp, "NoteID sql ");
fwrite($fp, $sql);

try{
    $dbc = new dbClient($cid);
    $dbc = $dbc->connectToClientDB();
    $stmt = $dbc->query($sql);
    $getnotes = $stmt->fetchALL(PDO::FETCH_OBJ);
    $dbc = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
} 

$noteid = $getnotes[0]->NoteID;

fwrite($fp, $noteid);
fwrite($fp, "                       ");














$sql = "INSERT into Audit (EntityID, SystemUserID, ActionID, ActionDate, ActionText, PrivateAction) values (";
$sql.= "'".$BranchID."',";
$sql.= "'".$uid."',"; 
$sql.= "30,"; 
$sql.= "GETUTCDATE(),";
$sql.= "'Note Added',";
$sql.= "0)";

try{
    $dbc = new dbClient($cid);
    $dbc = $dbc->connectToClientDB();
    $auditnotes = $dbc->query($sql);
    $dbc = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
} 


fwrite($fp, "INSERT into Audit sql   - ");
fwrite($fp, $sql);
fwrite($fp, "                          ");








writeNote($uid,$noteid,$det,$son,$pid,$cid,$uid,$BranchID,$projectname,$oref6);
writeNote($Owner,$noteid,$det,$son,$pid,$cid,$uid,$BranchID,$projectname,$oref);
writeNote($subOwner,$noteid,$det,$son,$pid,$cid,$uid,$BranchID,$projectname,$oref);
writeNote($subOwner1,$noteid,$det,$son,$pid,$cid,$uid,$BranchID,$projectname,$oref);









$out = prepareImageDBString($target_path);

header('Content-Type: image/jpeg');
list($width, $height) = getimagesize($target_path);
$thumb  = imagecreatetruecolor(200, 200);
$source = imagecreatefromjpeg($target_path);
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








////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////


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


function writeNote($recipient,$noteid,$det,$son,$pid,$cid,$uid,$BranchID,$projectname,$oref){

    $outfile = "51".$recipient.".txt";
    
    $fp1  = fopen($outfile, 'w');

    $sql = "INSERT into EmailPreProcess (";

    $sql.= "RecipientsUserID, TemplateType, Note, PackageID, ";
    $sql.= "IssueID, IssueType, ArchiveID, SystemClientID, ";
    $sql.= "SystemUserID, Archive, PID, ";
    $sql.= "OrderID, ArchiveConectionString, ArchiveName, OrderReference, ";
    $sql.= "IssueTypeName, URLHost, ArchiveNamesString, ArchiveRoleID, ";
    $sql.= "NoteID, ArchiveOwningSystemClientID, PA5061, DateCreated ";

    $sql.= ") values (";
    $sql.= "CAST('".$recipient."' AS UNIQUEIDENTIFIER),";
    $sql.= "124,";
    $sql.= "'".$det."',";
    $sql.= "CAST('".$BranchID."' AS UNIQUEIDENTIFIER),";

    $sql.= "CAST('".$BranchID."' AS UNIQUEIDENTIFIER),";
    $sql.= "5,";
    $sql.= "CAST('".$pid."' AS UNIQUEIDENTIFIER),";
    $sql.= "CAST('".$cid."' AS UNIQUEIDENTIFIER),";

    $sql.= "CAST('".$uid."' AS UNIQUEIDENTIFIER),";
    $sql.= "0,";
    $sql.= "CAST('".$pid."' AS UNIQUEIDENTIFIER),";

    $sql.= "CAST('".$BranchID."' AS UNIQUEIDENTIFIER),";
    $sql.= "'Data Source=SQL-1.spuk.local;Initial Catalog=a968060b-2af6-4170-a1de-fd94344f7abf;Persist Security Info=True;Integrated Security=True;',";
    $sql.= "'".$projectname."',";
    $sql.= "'".$oref."',";

    $sql.= "'QA Forms',"; //ask Felipe IssueTypeNamw
    $sql.= "'go.projectvaultuk.com',"; //ask Felipe URLHost
    $sql.= "'',"; //ask Felipe ArchiveNamesString
    $sql.= "CAST('bb6454e9-41f2-4170-b9ee-4778792ec4f0' AS UNIQUEIDENTIFIER),"; //ask Felipe ArchiveRoleID
    $sql.= "CAST('".$noteid."' AS UNIQUEIDENTIFIER),";
    $sql.= "CAST('a968060b-2af6-4170-a1de-fd94344f7abf' AS UNIQUEIDENTIFIER),"; //ask Felipe ArchiveOwningSystemClientID
    $sql.= "0,";
    $sql.= "GETUTCDATE())";

   
    fwrite($fp1, $sql);

    fclose($outfile);


    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $addnotetoemail = $stmt->fetchALL(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        echo '("error": {"text": '.$e->getMessage().'}';
    }

}


fclose('51.txt');


?>