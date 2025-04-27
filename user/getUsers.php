<?php

header("Access-Control-Allow-Methods:GET, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Origin: *");
require_once "db.php";



$user_id = intval($_GET['user_id']);

if (empty($user_id) || $user_id <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid userId provided'
    ], JSON_PRETTY_PRINT);
    exit;
}

try {

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $user = $stmt->fetch();


    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "user does not exist",
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if ($user["role"] != "super_admin") {
        echo json_encode([
            "success" => false,
            "message" => "user cannot access this route",
        ], JSON_PRETTY_PRINT);
        exit;
    }


    $stmt = $pdo->prepare("SELECT * FROM users");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $all_users = $stmt->fetchAll();

    if (!$all_users || count($all_users) === 0) {
        echo json_encode([
            "success" => false,
            "message" => "no user found",
        ], JSON_PRETTY_PRINT);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE role = 'super_admin' order by createdAt asc limit 1");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $founder_user = $stmt->fetch();

    $founder = false;
    if ($founder_user["id"] === $user_id) {
        $founder = true;
    }


    echo json_encode([
        "success" => true,
        "message" => "user role",
        'users' => $all_users,
        'length' => count($all_users),
        "founder" => $founder
    ], JSON_PRETTY_PRINT);
    exit;
} catch (PDOException $e) {

    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
    exit;
}
