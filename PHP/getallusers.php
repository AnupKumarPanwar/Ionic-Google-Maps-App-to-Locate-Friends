<?php

// http://stackoverflow.com/questions/18382740/cors-not-working-php

if (isset($_SERVER['HTTP_ORIGIN']))
	{
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400'); // cache for 1 day
	}

// Access-Control headers are received during OPTIONS requests

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
	{
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	exit(0);
	}



$servername = "localhost";
$username = "root";
$password = "";
$dbname = "locations";

$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection


// http://stackoverflow.com/questions/15485354/angular-http-post-to-php-and-undefined

$postdata = file_get_contents("php://input");

if (isset($postdata))
	{
	$request = json_decode($postdata);
	
	$id=$request->id;
	$name=$request->name;
	$lat=$request->latitude;
	$lon=$request->longitude;

	// echo "$id";
	$checkuser="SELECT * FROM users WHERE id='$id'";
	$updatelocation="UPDATE users SET latitude='$lat', longitude='$lon' WHERE id='$id'";

	$adduser="INSERT INTO users (id, name, latitude, longitude) VALUES ('$id', '$name', '$lat', '$lon')";

	echo mysqli_num_rows(mysqli_query($conn, $checkuser));

	if(mysqli_num_rows(mysqli_query($conn, $checkuser))<1)
	{
		mysqli_query($conn, $adduser);
	}

	else
	{
		mysqli_query($conn, $updatelocation);
	}


	$getallusers="SELECT * FROM users WHERE 1";

	$result=mysqli_query($conn, $getallusers);
	$row=array();
	while ($r=mysqli_fetch_assoc($result)) {
		$row[]=$r;
	}

	echo json_encode(array('data'=>$row));

	
	
	}
 

mysqli_close($conn);
?>	