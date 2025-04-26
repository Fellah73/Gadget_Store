<?php

header("Access-Control-Allow-Methods:GET, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Origin: *");
require_once "db.php";


// Sécurisation des données
$user_id = intval($_GET['user_id']);
$all = isset($_GET["all"]) ? $_GET["all"] : "false";

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
            "message" => "User not found",
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if (!empty($all) && $all === "true") {

        // get all the orders
        $stmt = $pdo->prepare("SELECT * FROM orders");
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $all_orders = $stmt->fetchAll();

        $stm = $pdo->prepare("SELECT * FROM cancelled_orders");
        $stm->execute();
        $stm->setFetchMode(PDO::FETCH_ASSOC);
        $all_orders = array_merge($all_orders, $stm->fetchAll());

        if (empty($all_orders)) {
            echo json_encode([
                "success" => false,
                "message" => "no orders found",
            ], JSON_PRETTY_PRINT);
            exit;
        }

        // return all the orders
        echo json_encode([
            "success" => true,
            "message" => "All orders",
            "length" => count($all_orders),
            "orders" => $all_orders
        ], JSON_PRETTY_PRINT);
        exit;
    }



    $stmt = $pdo->prepare("SELECT id,total,created_at,status,shipped_at FROM orders WHERE user_id = ? and status != 'cancelled'");
    $stmt->execute([$user_id]);
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $orders = $stmt->fetchAll();

    // si aucun order
    if (count($orders) === 0) {
        echo json_encode([
            "success" => true,
            "message" => "User does not have any orders",
            "user" => $user["name"],
            "length" => count($orders),
        ], JSON_PRETTY_PRINT);
        exit;
    }

    // update order status to delivered

    foreach ($orders as $order) {
        $current_date = new DateTime();
        if ($order['status'] == 'shipped') {
            $shipped_date = new DateTime($order["shipped_at"]);
            if ($shipped_date->diff($current_date)->days >=  2) {
                $stmt = $pdo->prepare("UPDATE orders SET status = 'delivered' WHERE id = ?");
                $stmt->execute([$order["id"]]);
            }
        }
    }

    $order_data = [];
    foreach ($orders as $order) {
        $order_details = $order;
        $stmt = $pdo->prepare("SELECT p.name,p.price_discounted,p.category_id,o.quantity,o.subtotal FROM order_items o,products p WHERE order_id = ? and o.product_id = p.id");
        $stmt->execute([$order["id"]]);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $order_items = $stmt->fetchAll();
        $order_details["items"] = $order_items;
        $order_data[] = $order_details;
    }

    echo json_encode([
        "success" => true,
        "message" => "User orders",
        "user" => $user["name"],
        "length" => count($orders),
        "orders" => $order_data,
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
