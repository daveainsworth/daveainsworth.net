<?php require('./functions/functions.php'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Bing Wallpaper Download</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
	<!-- <link rel="stylesheet" href="./css/style.css"> -->
    
</head>
<body>
    <h1>Bing Wallpaper capture</h1>
    <a class="btn btn-primary" href="./functions/bing-download.php">Obtain Image</a>


    <div class="jumbotron">
        <h3>Backgrounds:</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Date</th>
                    <th>Image Name</th>
                </tr>
            </thead>
            <tbody>
                <?php get_bing_images(); ?>
            </tbody>
        </table>
    </div>
    <!-- jQuery -->
    <script src="./js/jquery.js"></script>

    <!-- Custom Javascript code -->
    <script src="./js/scripts.js"></script>
    
</body>
</html>