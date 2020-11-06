<?php

include_once("./functions/functions.php");

if(isset($_GET['id'])) {

    // remove image file from server.
    $save_folder = './downloads/';

    $image_query = query("SELECT image_name FROM bing WHERE bing_id = " . $_GET['id'] . " LIMIT 1");
    $row = fetch_array($image_query);

    $image_name = $row['image_name'];

    $save_path = $save_folder.$image_name;
    
    //echo $save_path;

    // this will delete the file from the server.
    unlink($save_path); 

    // remove data from database.
    $query = query("DELETE FROM bing where bing_id =" . escape_string($_GET['id']) ." ");
    confirm($query);

    redirect("./index.php");

} else {

    redirect("./index.php");

}




?>

