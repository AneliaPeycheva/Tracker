<?php

header("Access-Control-Allow-Origin: *");

header('Content-Type: text/html; charset=utf-8'); 

$servername = "sql-server";
$username = "root";
$password = "root";
$dbname = "tasks";

session_start();

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");
mysqli_set_charset($conn, 'utf-8');

$response = array();

function ReturnStageById($stageId) {
    $stageName;
    switch ($stageId) {
        case 1:
            $stageName = "среща";
            break;
        case 2:
            $stageName = "оферта";
            break;
        case 3:
            $stageName = "чакаме отговор";
            break;
        case 4:
            $stageName = "проектиране";
            break;
        case 5:
            $stageName = "разработка";
            break;
        case 6:
            $stageName = "завършен";
            break;
    }
    return $stageName;
}

if (isset($_GET["action"])) {
    $action = $_GET['action'];

    if (isset($_SESSION['username'])) {

        $response['logged'] = true;
        $response['username'] = $_SESSION['username'];
        // $response['uid'] = $_SESSION['uid'];

        if ($action == "get_projects") {
            $response['projects'] = array();
            $sql_get_projects = "SELECT * FROM tasks.projects";
            $result_get_projects =  $conn->query($sql_get_projects);
            while ($project = $result_get_projects -> fetch_assoc()) { 
                $types = explode(",", $project['type']);           
                $project['type'] = $types;
                $members = explode(";",$project['members']);
                $project['members'] = $members;
                array_push($response['projects'], $project);
            } 
    
        } else if ($action == "get_project_type") {      
            $response['project_type'] = array();
            $sql_get_project_type = "SELECT * FROM tasks.project_type ";     
            $result_get_project_type =  $conn->query($sql_get_project_type);
            while ($project_type = $result_get_project_type -> fetch_assoc()) {             
                array_push($response['project_type'], $project_type);
            } 
    
        } else if ($action == "get_boards") {
            $response['boards'] = array();
            $sql_get_boards = "SELECT * FROM tasks.boards";
            $result_get_boards =  $conn->query($sql_get_boards);
            while ($board = $result_get_boards -> fetch_assoc()) {             
                array_push($response['boards'], $board);
            } 
    
        } else if ($action == "get_notes") {
            $response['notes'] = array();
            $sql_get_notes = "SELECT * FROM tasks.notes";
            $result_get_notes =  $conn->query($sql_get_notes);
            while ($note = $result_get_notes -> fetch_assoc()) {  
                $members = explode(";",$note['members']);
                $note['members'] = $members;           
                array_push($response['notes'], $note);
            } 
    
        } else if ($action == "edit_note_boardId") {
            $noteId = $_GET['uid'];        
            $newBoardId = $_GET['boardId'];      
            // $sql_edit_note = "UPDATE notes SET `boardId`='" . $newBoardId . "' WHERE `uid` = " . $noteId; 
            $sql_edit_note = "UPDATE tasks.notes SET `boardId` = '$newBoardId' WHERE `uid` = " . $noteId;        
            $result_edit_note = $conn->query($sql_edit_note);
    
        } else if ($action == "create_new_note") {
            $projectId = $_GET['projectId'];
            $title = $_GET['title'];
            $boardId = $_GET['boardId'];
            // $type = $_GET['type'];
            // $description=$_GET['description'];
            $date = date("d-m-Y");  
           // $sql_add_note = "INSERT INTO axion.notes (`projectId`,`boardId`, `members`,`title`, `type`, `description`,`deleted`, `created_at`,`done_time`) VALUES ($projectId, $boardId, '', '$title', '$type', '$description', 0, '$date', '')";
            $sql_add_note = "INSERT INTO tasks.notes (`projectId`,`boardId`, `members`,`title`, `type`, `description`,`deleted`, `created_at`,`done_time`) VALUES ($projectId, $boardId, '', '$title', '', '', 0, '$date', '')";
            $result_add_note = $conn->query($sql_add_note);
    
        } else if ($action == "create_new_board") {
            $projectId = $_GET['projectId'];
            $title = $_GET['title'];
            $sql_add_board = "INSERT INTO tasks.boards (`projectId`,`title`) VALUES ($projectId, '$title')";
            $result_add_board = $conn->query($sql_add_board);
            
        } else if ($action == "get_note_types") {
            $response['note_types'] = array();
            $sql_get_note_types = "SELECT * FROM tasks.note_type";     
            $result_get_note_types =  $conn->query($sql_get_note_types);
            while ($note_type = $result_get_note_types -> fetch_assoc()) {             
                array_push($response['note_types'], $note_type);
            } 
    
        } else if ($action == "delete_note") {
            $noteId = $_GET['noteId'];   
            $sql_delete_note = "UPDATE tasks.notes SET `deleted` = 1 WHERE `uid` = " . $noteId; 
            $result_delete_note = $conn->query($sql_delete_note);

        } else if ($action == "edit_note") {           
            $projectId = $_GET['projectId'];
            $noteId = $_GET['uid'];
            $boardId = $_GET['boardId'];
            $title = $_GET['title'];
            $description = $_GET['description'];
            $type = $_GET['type'];           
            $sql_edit_note = "UPDATE tasks.notes SET `boardId`= '$boardId', `title` = '$title', `description` = '$description', `type` = '$type' WHERE `uid` = " . $noteId;
            $result_edit_note = $conn->query($sql_edit_note);

        } else if ($action == "get_members") {
            $response['members'] = array();
            $sql_get_members = "SELECT `uid`, `username`, `name`, `title` FROM tasks.members";
            $result_get_members =  $conn->query($sql_get_members);
            while ($member = $result_get_members -> fetch_assoc()) {  
                array_push($response['members'], $member);
            } 
        } else if ($action == "get_projects_by_user") {
            $userId = $_GET['uid'];
            $response['projects'] = array();
            $sql_get_projects = "SELECT * FROM tasks.projects WHERE `members` LIKE '%$userId%'";
            $result_get_projects =  $conn->query($sql_get_projects);
            while ($project = $result_get_projects -> fetch_assoc()) { 
                $types = explode(",", $project['type']);           
                $project['type'] = $types;
                $members = explode(";",$project['members']);
                $project['members'] = $members;
                $stageId = $project['stageId'];
                $stage = ReturnStageById($stageId);              
                $project['stage'] = $stage;
                array_push($response['projects'], $project);
            } 
    
        } else if ($action == "logout") {
            $_SESSION = array();    
            session_destroy();     
            $response['logged'] = false;  
        }

    } else {
        $response['logged'] = false;   
        if ($action == "login") {    
          $username = $_GET['username'];
          $password = $_GET['password'];     
       
          $sql_get_user = "SELECT * FROM tasks.members WHERE `username` = '$username' AND `password` = '$password'";       
          $result_get_user = $conn->query($sql_get_user);       
          if ($result_get_user) {
              if ($result_get_user->num_rows > 0) {
                $row_user = $result_get_user -> fetch_assoc();
              
                $_SESSION['username'] = $username;
                $_SESSION['uid'] = $row_user['uid'];
                $response['username'] = $_SESSION['username'];
                $response['uid'] = $_SESSION['uid'];             
                $response['name'] = $row_user['name'];           
                $response['logged'] = true;
              }
          }   
        }
    }
    

}

echo json_encode($response);
$conn->close();

?>