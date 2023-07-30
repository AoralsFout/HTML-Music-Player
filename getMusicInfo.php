<?php
require_once '../databaseConnectConfig.php';

// 创建数据库连接
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

// 检查连接是否成功
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

// 要执行的SQL查询语句
$sql = "SELECT * FROM musics";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // 将结果转换为关联数组
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // 将关联数组转换为JSON格式
    $json = json_encode($data);

    // 输出JSON数据
    echo $json;
} else {
    echo "[".$id."]";
}

// 关闭连接
$conn->close();
?>