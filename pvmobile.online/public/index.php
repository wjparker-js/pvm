<?php
header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

$_SESSION['PA5053'] = "";

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../src/config/db.php';

$app = new \Slim\App;
require '../src/routes/users.php';
require '../src/routes/documents.php';
require '../src/routes/documentaudit.php';
require '../src/routes/documentview.php';
require '../src/routes/documentsummary.php';
require '../src/routes/projects.php';
require '../src/routes/project.php';
require '../src/routes/dashboard.php';
require '../src/routes/t3.php';
require '../src/routes/t4.php';
require '../src/routes/t5.php';
require '../src/routes/issuesaudittrail.php';
require '../src/routes/contacts.php';
require '../src/routes/avatar.php';
require '../src/routes/qrroom.php';
require '../src/routes/qrdefects.php';
require '../src/routes/writeaudit.php';
require '../src/routes/sendemail.php';
require '../src/routes/groups.php';
require '../src/routes/snags.php';
require '../src/routes/defects.php';
require '../src/routes/defectsnotes.php';
require '../src/routes/locationmap.php';
require '../src/routes/locationmapimage.php';
require '../src/routes/locationcity.php';
require '../src/routes/discipline.php';
require '../src/routes/defectsreasons.php';
require '../src/routes/defectseffects.php';
require '../src/routes/defectssubtypes.php';
require '../src/routes/documentsfields.php';
require '../src/routes/defectsqr.php';
require '../src/routes/documentscustomfields.php';
require '../src/routes/documentinfo.php';
require '../src/routes/confirm.php';
require '../src/routes/loginprojectuserdetails.php';


$app->run();
