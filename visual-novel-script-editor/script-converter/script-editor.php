<?php
$directory = '../media/text/';

if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }

switch($_POST['functionname']) {
	case 'fetchFolderFiles':
		$arrfiles = scandir($_POST['folderPath']);
		echo json_encode(array_values(array_diff($arrfiles, array('.', '..'))));
	break;
    case 'fetchFiles':
    	$files = scandir($directory."scripts");
		echo json_encode(array_values(array_diff($files, array('.', '..'))));
	break;
	case 'exportScript':
		$fileLoc=$directory."translate/".$_POST['filename'];
		$myfile = fopen($fileLoc, "w") or die("Unable to open file!");		
		fwrite($myfile, $_POST['file']);		
		fclose($myfile);
	break;
	case 'exportFile':
		$fileLoc=$_POST['filename'];
		$myfile = fopen($fileLoc, "w") or die("Unable to open file!");		
		fwrite($myfile, $_POST['file']);		
		fclose($myfile);
	break;
	default:
		echo "no functionname";
	break;
	
}
?>