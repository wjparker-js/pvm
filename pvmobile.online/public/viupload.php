 <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
  <link href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
  <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
  <title>PVM Camera Upload</title>
</head>
<body>
<h1>PVM Camera Uploads</h1>
  <?php
  
  /*
  $scan = scandir('idocs');

  foreach($scan as $file)
  {
    if (!is_dir($file))
    {
      echo '<h3>'.$file.'</h3>';
      echo '<img src="idocs/'.$file.'" style="width: 400px;"/><br />';
    }
  }
  */

    if ($handle = opendir('idocs')) {
        while (false !== ($file = readdir($handle)))
        {
            if (($file != ".") 
             && ($file != ".."))
            {
                $thelist .= '<img src="idocs/'.$file.'" height="250"/>';
            }
        }

        closedir($handle);
    }


  ?>


    <P>List of files:</p>
    <UL>
    <P><?=$thelist?></p>
    </UL>
    
</body>
</html>





<!--
<p><h1>PVM Camera Uploads</h1></p>

<div class="container">
    <div id="main_area">

        <div class="row">
            <div class="col-sm-6" id="slider-thumbs">

                <ul class="hide-bullets">
                    <li class="col-sm-3">
                        <a class="thumbnail" id="carousel-selector-0">
                            <img src="">
                        </a>
                    </li>

                    <li class="col-sm-3">
                        <a class="thumbnail" id="carousel-selector-1"><img src="" style="width:100px;height:100px;"></a>
                    </li>
                </ul>
            </div>
            <div class="col-sm-6">
                <div class="col-xs-12" id="slider">
                    <div class="row">
                        <div class="col-sm-12" id="carousel-bounding-box">
                            <div class="carousel slide" id="myCarousel">
                                <div class="carousel-inner">
                                    <div class="active item" data-slide-number="0">
                                        <img src="http://placehold.it/470x480&text=zero"></div>
                                <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                                    <span class="glyphicon glyphicon-chevron-left"></span>
                                </a>
                                <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                                    <span class="glyphicon glyphicon-chevron-right"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>
-->