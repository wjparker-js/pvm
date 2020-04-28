<?php

header('Access-Control-Allow-Origin: *');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/api/contacts/{apikey}/{pid}/{uid}/{segment}', function (Request $request, Response $response, $args) {

        $ApiKey    = $args['apikey'];
        $ProjectID = $args['pid'];
        $UserName  = $args['uid'];
        $Segment   = $args['segment'];


        if($Segment == "1"){

            $sql  = "SELECT  ";
            $sql .= "ProjectUsers.ProjectID, ProjectUsers.UserID, ProjectRoles.RoleName, ProjectUsers.Email, ";
            $sql .= "ProjectUsers.PFirstName, ProjectUsers.PLastName, ProjectUsers.PPosition, ProjectUsers.PDepartment, ";
            $sql .= "ProjectUsers.PCompanyName, ProjectUsers.PTelephone, ProjectUsers.PMobile ";
            $sql .= "FROM ProjectUsers INNER JOIN ProjectRoles ON ProjectUsers.ProjectRoleID = ProjectRoles.ProjectRoleID ";
            $sql .= "where ProjectUsers.ProjectID = '".$ProjectID."' ";
            $sql .= "AND (ProjectUsers.PLastName IS NOT NULL) AND (ProjectUsers.PFirstName IS NOT NULL) ";
            $sql .= "order by ProjectUsers.PLastName,ProjectUsers.PFirstName,ProjectUsers.Email";

            try{
                $db = new db();
                $db = $db->connect();
                $stmt = $db->query($sql);
                $contacts = $stmt->fetchALL(PDO::FETCH_OBJ);
                $db = null;
            } catch(PDOException $e){
                echo '("Contacts error": {"text": '.$e->getMessage().'}';
            }

            $placeholdavatar = "https://go.projectvaultuk.com/PublicPics/avatar.png";

            foreach( $contacts as &$row) {

                $avatarname = "https://go.projectvaultuk.com/PublicPics/".$row->UserID.".jpg";
                $checkavatarname = "//filesrv-1/Websites/SV/projectvaultuk.com/PublicPics/".$row->UserID.".jpg";

                if (file_exists($checkavatarname)) {
                    $row->avatar = $avatarname;
                } else {
                    $row->avatar = $placeholdavatar;
                }

            }

            $contactsj = json_encode($contacts);

            return $contactsj;  
        }      



        if($Segment == "2"){

            $userEmailDomain = trim($UserName);
            $length          = strpos($userEmailDomain, "@");
            $userEmailDomain = substr($userEmailDomain, -$length);

            $sql  = "SELECT  ";
            $sql .= "SystemUserID, Email, Password, Salutation, FirstName as PFirstName, LastName as PLastName, Telephone as PTelephone, ";
            $sql .= "Mobile as PMobile, Active FROM SystemUsers WHERE (Active = 'True') AND ";
            $sql .= "(Email LIKE '%".$userEmailDomain."%') ORDER BY LastName, FirstName";

            try{
                $db = new db();
                $db = $db->connect();
                $stmt = $db->query($sql);
                $contacts = $stmt->fetchALL(PDO::FETCH_OBJ);
                $db = null;
            } catch(PDOException $e){
                echo '("Contacts error": {"text": '.$e->getMessage().'}';
            }

            $placeholdavatar = "https://go.projectvaultuk.com/PublicPics/avatar.png";

            foreach( $contacts as &$row) {

                $avatarname = "https://go.projectvaultuk.com/PublicPics/".$row->SystemUserID.".jpg";
                $checkavatarname = "//filesrv-1/Websites/SV/projectvaultuk.com/PublicPics/".$row->SystemUserID.".jpg";

                if (file_exists($checkavatarname)) {
                    $row->avatar = $avatarname;
                } else {
                    $row->avatar = $placeholdavatar;
                }

            }

            $contactsj = json_encode($contacts);

            return $contactsj;  
        }   


});

