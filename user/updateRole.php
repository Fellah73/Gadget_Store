<?php

header("Access-Control-Allow-Methods:PATCH, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Origin: *");
require_once "db.php";

$body = json_decode(file_get_contents("php://input"), true);
if ($body === null) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON data or no data provided'
    ], JSON_PRETTY_PRINT);
    exit;
}


$user_id = intval($body["user_id"]);
$promoted_user_id = intval($body["promoted_user_id"]);
$action = $body["action"];

if (!isset($action) || !isset($user_id)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid data provided'
    ], JSON_PRETTY_PRINT);
    exit;
}



if ($user_id <= 0 || $promoted_user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "invalid Data"
    ], JSON_PRETTY_PRINT);
    exit;
}

if ($action !== "promote" && $action !== "demote") {
    echo json_encode([
        "success" => false,
        "message" => "invalid action"
    ], JSON_PRETTY_PRINT);
    exit;
}

try {

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? ");
    $stmt->execute([$user_id]);
    $adminUser = $stmt->fetch();

    if ($adminUser["role"] != "super_admin") {
        echo json_encode([
            "success" => false,
            "message" => "user cannot access this route",
        ], JSON_PRETTY_PRINT);
        exit;
    }

    $stmt = $pdo->prepare("select * from users where id = ?");
    $stmt->execute([$promoted_user_id]);
    $promotedUser = $stmt->fetch();

    if (!$promotedUser) {
        echo json_encode([
            "success" => false,
            "message" => "user does not exist",
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if ($action === "promote") {
        if ($promotedUser["role"] === "admin") {
            $stmt = $pdo->prepare("UPDATE users SET role = 'super_admin' WHERE id = ?");
            $stmt->execute([$promoted_user_id]);
        } else if ($promotedUser["role"] === "stock_manager") {
            $stmt = $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
            $stmt->execute([$promoted_user_id]);
        }
    } else if ($action === "demote") {
        if ($promotedUser["role"] === "admin") {
            $stmt = $pdo->prepare("UPDATE users SET role = 'stock_manager' WHERE id = ?");
            $stmt->execute([$promoted_user_id]);
        } else if ($promotedUser["role"] === "stock_manager") {
            $stmt = $pdo->prepare("UPDATE users SET role = 'user' WHERE id = ?");
            $stmt->execute([$promoted_user_id]);
        } else if ($promotedUser["role"] === "super_admin") {
            $stmt = $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
            $stmt->execute([$promoted_user_id]);
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Role updated successfully'
    ], JSON_PRETTY_PRINT);
    exit;
} catch (PDOException $e) {
    // probleme depuis le serveur
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
    exit;
}
