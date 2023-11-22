<?php
    $servername = "localhost";
    $username = "root";
    $password = "password";
    $database = "statistics";

    $connect = mysqli_connect($servername, $root, $password, $database);

    if ($connect->connect_error){
        die("Connection failed: " . $connect->connect_error);
    }

    $json_files_info = file_get_contents('php://input');

    $files_info = json_decode($json_files_info);

    foreach($files_info as $field) {
        $query = "INSERT INTO time_stat(root, size, elapsed_time, request_date)
        VALUES('".$field["root"]."', '".$field["size"]."', 
               '".$field["elapsed_time"]."', '".$field["request_date"]."')";

        if (mysqli_query($connect, $query)){
                echo "Record inserted succesfully";
        }else{
            echo "Couldn't insert record: " . mysqli_error($connect);
        }
    }

    mysqli_close($connect);
?>