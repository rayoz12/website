<?php
	class Folder 
	{
		public $name = "";
		public $type = "folder";
		public $length = 0;
		public $files  = [];
	}

	class CustomFile
	{
		public $name = "";
		public $type = "file";
		function  __construct($fileName) 
		{
			$this->name = $fileName;
		}
	}


	$username = $_SERVER['PHP_AUTH_USER'];

	//change directory to the same one the UI manages
	chdir("../Users/");
	
	$folderExists = file_exists($username);
	if (!$folderExists) 
	{
		respond("User does not exist!");		
	}
	else
	{
		$userFolder = getcwd() . "/" . $username;
		respond(folderScanner($userFolder));
	}

	function folderScanner($directory) 
	{
		$files = scandir($directory);
		$folderContents = new Folder();
		//$folderContents->name = $directory;
		$folderContents->name = basename($directory);
		foreach ($files as $file) 
		{
			if ($file == "." || $file == "..") continue;
			if (is_dir($directory . "/" . $file))
			{
				$folderBeingScanned = $directory . "/" . $file;
				$folderScan = folderScanner($folderBeingScanned);
				//respond("scanning: {$folderBeingScanned}");
				array_push($folderContents->files, $folderScan);
			}
			else
				array_push($folderContents->files, new CustomFile($file));
			$folderContents->length++;
		}
		return $folderContents;
	}

	function respond($text)
	{
		header('Content-Type: application/json');
		echo json_encode($text);
	}

?>


