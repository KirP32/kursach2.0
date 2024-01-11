<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Score_Sudoku";

$conn = @new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_errno) {
exit('Ошибка подключения');
}
echo "Connected successfully to MySQL server. Server version: " . $conn->server_info;

$playername = trim($_POST['PlayerName']);
$playerscore = trim($_POST['PlayerScore']);
$conn->query("INSERT INTO `Players_score` (`name`, `score`)
VALUES ('$playername', '$playerscore')");
$conn->close();
?>