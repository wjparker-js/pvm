<?php

class db{
    public function connect(){
        $dbConnection = new PDO("sqlsrv:Server=172.16.44.21; Database=PV", "", "");  
        $dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
        return $dbConnection; 
    }       
}
