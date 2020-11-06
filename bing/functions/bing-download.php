<?php require_once("functions.php"); ?>

<?php

// Set location for file to be saved in
$save_folder = '../downloads/';

$url = 'https://www.bing.com';
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);

// required as we using https url
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// instead of output to screen it can save it to a variable.
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$content = curl_exec($ch);
//  echo $content;

// regular expressions to match url
// first part will parse the $content for the text match
// it then stores the result in the $image_match array.
// make sure you esape any special char wtih \ e.g. \?
preg_match("!/th\?id=OHR.(.*?).jpg!", $content, $image_match);

// print_r($image_match);

$image_url = $url . $image_match[0]; // full image url.
$image_name = $image_match[1].'.jpg';  //file name
// print_r($image_url);
// print_r($image_name);

$save_path = $save_folder.$image_name;
// echo $save_path;

// initialise cURL to save the image
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $image_url);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// set binary transfer to true, so we can get the image
// curl_setopt($ch, CURL_BINARYTRANSFER, true);

$binary_data = curl_exec($ch);
curl_close($ch);

// save binary data to a file

if (file_exists($save_path)) {

    // echo "file exists already";
    // echo "<br> filepath : " . $save_folder;
    // echo "<br> filename : " . $image_name;
 redirect("../index.php?already_exists/" . $image_path);

} else {

$fh = fopen($save_path, 'x');  //create an open for writing only.
fwrite($fh, $binary_data);
fclose($fh);

insert_image($image_name);

echo "file " . $save_path . " copied successfully. ";

redirect("../index.php?success");

}

?>
