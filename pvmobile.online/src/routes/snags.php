<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/snags/{pid}', function (Request $request, Response $response, $args) {

//Add the APIKey check here and die if not current

$ProjectID = $args['pid'];

$sql = "SELECT ";
$sql.= "BranchOrders.OrderID, BranchOrders.ParentOrderID, BranchOrders.SytemOrderNumber, ";
$sql.= "BranchOrders.Type, BranchOrders.SubType, BranchOrders.OwnerID, BranchOrders.ProjectID, ";
$sql.= "BranchOrders.OrderStatus, BranchOrders.DateCreated, BranchOrders.DateIsssued, ";
$sql.= "BranchOrders.DeliverBy, BranchOrders.ReturnByMethod, BranchOrders.OrderReference, ";
$sql.= "BranchOrders.OrderSubject, BranchOrders.RecipientID, BranchOrders.RecipientSupplierID, ";
$sql.= "BranchOrders.OwnInstructions, BranchOrders.RecipientBranchID, ";
$sql.= "BranchOrders.RecipientAccountNumber, BranchOrders.LastModified, BranchOrders.Instructions, ";
$sql.= "BranchOrders.Secure, BranchOrders.SubOrderNumber, BranchOrders.PackageID, ";
$sql.= "BranchOrders.TypeOrderNumber, BranchOrders.AutoUpdate, BranchOrders.IsUpdate, ";
$sql.= "BranchOrders.UpdateRemove, BranchOrders.UpdateSupersede, BranchOrders.UpdateNew, ";
$sql.= "BranchOrders.UpdateType, BranchOrders.CreatorID, BranchOrders.OwnerCreator, ";
$sql.= "BranchOrders.SubOwner, BranchOrders.SubOwner2, BranchOrders.DisciplineID, RFIImages.FileExt, ";
$sql.= "BranchOrders.ReasonID, BranchOrders.EffectID, BranchOrders.Bim, RFIImages.SnapShotThumb ";
$sql.= "FROM BranchOrders INNER JOIN RFIImages ON BranchOrders.OrderID = RFIImages.RFIID ";
$sql.= "WHERE (BranchOrders.Type = '5') AND (BranchOrders.ProjectID = '".$ProjectID."') ";
$sql.= "ORDER BY BranchOrders.TypeOrderNumber desc";

       
try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $snags = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}



/*
$sql =  "SELECT LocationMapID,ProjectID,L1ID,L2ID,L3ID,L4ID,Name,LID,";
$sql .= "LocationImage,LocationOwnerID,Latitude,Longitude,Altitude ";
*/

$sql =  "SELECT * ";
$sql .= "From ProjectLocationMap Where ProjectID = '".$ProjectID."' ";
$sql .= "order by LocationMapID desc";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $lmaps = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}





//$sql =  "SELECT ComponentValueID, ProjectID,TextValue,Active ";

$sql =  "SELECT * ";
$sql .= "From ProjectFormComponentsValues Where ProjectID = '".$ProjectID."' ";
$sql .= "order by TextValue";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $comvalues = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}





//$sql =  "SELECT FlatTypeValueID, ProjectID,TextValue,Active ";

$sql =  "SELECT * ";
$sql .= "From ProjectFormFlatTypeValues Where ProjectID = '".$ProjectID."' ";
$sql .= "order by TextValue";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $ftvalues = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}






//$sql =  "SELECT FloorLevelValueID, ProjectID,TextValue,Active ";

$sql =  "SELECT * ";
$sql .= "From ProjectFormFloorLevelValues Where ProjectID = '".$ProjectID."' ";
$sql .= "order by TextValue";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $flvalues = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}






//$sql =  "SELECT PlotFlatValueID, ProjectID,TextValue,Active ";

$sql =  "SELECT * ";
$sql .= "From ProjectFormPlotFlatValues Where ProjectID = '".$ProjectID."' ";
$sql .= "order by TextValue";

try{
    $db = new db();
    $db = $db->connect();
    $stmt = $db->query($sql);
    $fpvalues = $stmt->fetchALL(PDO::FETCH_OBJ);
    $db = null;
} catch(PDOException $e){
    echo '("error": {"text": '.$e->getMessage().'}';
}




header('Content-type:application/json');
$snagsj      = json_encode($snags);
$lmapsj      = json_encode($lmaps);
$comvaluesj  = json_encode($comvalues);
$ftvaluesj   = json_encode($ftvalues);
$flvaluesj   = json_encode($flvalues);
$fpvaluesj   = json_encode($fpvalues);

return '{"structure":{"data":{"inserts":{"M_BranchOrders":'.$snagsj.',"M_LocationMaps":'.$lmapsj.',"M_FlatPlot":'.$fpvaluesj.',"M_FloorLevel":'.$flvaluesj.',"M_FlatTypes":'.$ftvaluesj.',"M_Common":'.$comvaluesj.'}}}}'; 

});