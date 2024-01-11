<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Score_Sudoku";

$conn = @new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT name, score FROM Players_score");

if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = ["name" => $row["name"], "score" => $row["score"]];
    }
    echo json_encode($data);
} else {
    echo "0 results";
}
$conn->close();
?>
