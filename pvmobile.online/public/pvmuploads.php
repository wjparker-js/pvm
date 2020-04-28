<!DOCTYPE html>
<?php
 error_reporting(E_ALL);
 ini_set('display_errors', 1);
?>

<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
  <link href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
  <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
  <style>
      .hide-bullets {
        list-style:none;
        margin-left: -40px;
        margin-top:20px;
      }

      .thumbnail {
          padding: 10px;
          width:300px;
          margin:10px;
      }

      .carousel-inner>.item>img, .carousel-inner>.item>a>img {
          width: 100%;
      }
  </style>
  <title>PVM Camera Upload</title>
</head>
<body>

<div class="container">

    <div id="main_area">

        <div class="row">

            <div  id="slider-thumbs">

                <ul class="hide-bullets">                

                  <?php

                    //$baseURL = "http://79.174.171.22/";
                    $baseURL = "idocs/";
                    $thelist = "";
                    $newFiles = scandir("idocs/", 1);
                    $index = 0;

                    foreach($newFiles as $file)
                     { 
                        if (($file != ".") && ($file != "..")) {
                          echo "<li class='col-sm-3'><a class='thumbnail' href='".$baseURL.$file."' id='carousel-selector-".$index."'><img src='".$baseURL.$file."'></a></li>";
                          $index++;
                        }

                        
                     }

                  ?>     

                </ul>
            </div>

            <!--
            <div class="col-sm-6">
                <div class="col-xs-12" id="slider">
                    <div class="row">
                        <div class="col-sm-12" id="carousel-bounding-box">
                            <div class="carousel slide" id="myCarousel">
                                

                                  <?php 
                                  /*

                                    //$index = 0;

                                    echo "<div class='carousel-inner'>";

                                    //foreach($newFiles as $file) {

                                      //if (($file != ".") && ($file != "..")) {

                                        
                                        echo "<div class='active item' data-slide-number='".$index."'>";
                                        echo "<img src='".$baseURL.$file."'>";
                                        echo "</div>";

                                        echo "<a class='left carousel-control' href='#myCarousel' role='button' data-slide='prev'>";
                                        echo "<span class='glyphicon glyphicon-chevron-left'></span>";
                                        echo "</a>";
                                        
                                        echo "<a class='right carousel-control' href='#myCarousel' role='button' data-slide='next'>";
                                        echo "<span class='glyphicon glyphicon-chevron-right'></span>";
                                        echo "</a>";
                                        

                                        //$index++;

                                      //}

                                      echo "</div>";

                                    }
                                  */
                                  ?>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
          -->

        </div>

    </div>
</div>

<script>

  jQuery(document).ready(function($) {
 
        $('#myCarousel').carousel({
                interval: 5000
        });
 
        //Handles the carousel thumbnails
        $('[id^=carousel-selector-]').click(function () {
        var id_selector = $(this).attr("id");
        try {
            var id = /-(\d+)$/.exec(id_selector)[1];
            console.log(id_selector, id);
            jQuery('#myCarousel').carousel(parseInt(id));
        } catch (e) {
            console.log('Regex failed!', e);
        }
    });
        // When the carousel slides, auto update the text
        $('#myCarousel').on('slid.bs.carousel', function (e) {
                 var id = $('.item.active').data('slide-number');
                $('#carousel-text').html($('#slide-content-'+id).html());
        });
  });

</script>

</body>
</html>

