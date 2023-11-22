<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <table>
        <thead>
            <tr>
                <td>Root</td>
                <td>Size</td>
                <td>Elapsed time</td>
                <td>Request date</td>
            </tr>
        </thead>
        <tbody>
            <?php
            $servername = "localhost";
            $username = "root";
            $password = "password";
            $database = "statistics";

            $connect = mysqli_connect($servername, $root, $password, $database);

            if ($connect->connect_error){
                die("Connection failed: " . $connect->connect_error);
            }

            $files_info = mysqli_query($connect, "SELECT * FROM time_stat");

            if (!$files_info){
                echo "Couldn't get information about files from database: " . mysqli_error($connect);
            }

            while ($row = mysqli_fetch_row($files_info)){
                echo '<tr>';
                foreach($row as $value){
                    echo '<td>' . htmlspecialchars($value) . '</td>';
                }
                echo '</tr>';
            }

            mysqli_close($connect);
        ?>
        </tbody>
    </table>
</body>
</html>