<h1> File Manager </h1>

<?php
	$username = $_SERVER['PHP_AUTH_USER'];
	echo "<p>Hello {$username}.</p>";
	echo "Checking if your folder exists... ";
	
	chdir("Users/");

	$folderExists = file_exists($username);
	$userFolder;

	if ($folderExists)
	{
		$userFolder = getcwd() . "/" . $username;
		echo "Your folder does exist!";
		listFiles($userFolder);
		
	}
	else
	{
		echo "No folder found Sorry.";
		echo "<p>Making a new folder, with a test file</p>";
		makeNewUser($username);
		$userFolder = getcwd() . "/" . $username;
		listFiles($userFolder);
	}

	function makeNewUser($username)	
   	{
		mkdir($username);
		$file = fopen($username . "/userinfo","w");
		fwrite($file,"date created: " . time());
		fclose($file);
	}

	function listFiles($directory) 
	{
		$files = scandir($directory);
		echo "<h3>Files in {$directory}: </h3>";
		foreach ($files as $file) 
		{
			if ($file == "." || $file == "..") continue;
			echo "<p>{$file}</p>";
		}
	}
?>


