<!-- Functions file for daveainsworth.net -->

<?php

/**************************** DATABASE CONFIGURATION / SETUP ****************************/
// NOTE: set constant variables for database connectivity
defined("DB_HOST") ? null : define("DB_HOST", "localhost");
defined("DB_USER") ? null : define("DB_USER", "u761281023_sder");
defined("DB_PASS") ? null : define("DB_PASS", "webSitePasswordForSQLDatabase31082019");
defined("DB_NAME") ? null : define("DB_NAME", "u761281023_daveainsworth");

// NOTE: open a connection to the database.
$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASS,DB_NAME);

// Obtain the last ID from the database insert
function last_id (){
    global $connection;
    return mysqli_insert_id($connection);
}

function query($sql) {
    global $connection;
    return mysqli_query($connection,$sql);
}

function escape_string($sql) {
    global $connection;
    return mysqli_real_escape_string($connection, $sql);
}


function fetch_array($result){
    return mysqli_fetch_array($result);
}

function confirm($result) {
    global $connection;

    if(!$result) {
        die ("Query Failed " .  mysqli_error($connection));
    }
}

// function to query database and return data for all images
function get_bing_images(){

    $bing_query = query("SELECT * FROM bing ORDER BY DATE desc");
    confirm($bing_query);

    while ($row = fetch_array($bing_query)) {

        $images = <<<DELIMETER

    <div class="image_container">
        <tr>
            <td>{$row['bing_id']}</td>
            <td>{$row['date']}</td>
            <td>{$row['image_name']}</td>
            <td><a href="./downloads/{$row['image_name']}" target="_blank">
                <img style="width:100px; margin:5px" class="img-responsive" src="./downloads/{$row['image_name']}" alt="">
            </a>
               <!--  <div class="caption">
                     <p>{$row['image_name']}</P>
                 </div> -->
            </td>
           
            </td>
        </tr>
    </div>
DELIMETER;

echo $images;
// remove the remove button
// <td><a class="btn btn-danger image_container" href="./delete_image.php?id={$row['bing_id']}">Remove</a>
    }
}

// function to store the image details into the mysql table.
function insert_image($image_name) {

    $today = date('Y-m-d');

    $insert_query = query("INSERT INTO bing (image_name, date) VALUES('{$image_name}','{$today}')");
    confirm($insert_query);
}


/************************ PHP HELPER FUNCTIONS **********************/
function redirect($location) {
    header("Location: $location ");
}
?>