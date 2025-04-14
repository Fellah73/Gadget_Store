<?php

header("Access-Control-Allow-Methods:GET, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Origin: *");
require_once "db.php";


// Check if query parameters are set
$limit = isset($_GET["limit"]) ? intval($_GET["limit"]) : null;
$user_id = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : null;
$discount = isset($_GET["discount"]) ? intval($_GET["discount"]) : null;

if (is_null($limit) || is_null($discount)) {
    echo json_encode([
        'success' => false,
        'message' => 'no query params'
    ], JSON_PRETTY_PRINT);
    exit;
}

if ($discount <= 0 || $limit <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'query params must be greater than 0'
    ], JSON_PRETTY_PRINT);
    exit;
}

try {

    // Cast $limit to an integer before using it in the query
    $limit = (int) $limit;
    $limit = $limit % 2 == 1 ? $limit + 1 : $limit;

    $stmt = $pdo->prepare("SELECT * FROM products WHERE discount >= ? ORDER BY discount DESC LIMIT $limit");
    $stmt->execute([$discount]);
    $products_discounted = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($products_discounted) === 0 && !$user_id) {
        echo json_encode([
            'success' => false,
            'message' => 'no discounted products found in that discount range'
        ], JSON_PRETTY_PRINT);
        exit;
    }

    // if no userId return the most popular products
    if (!$user_id) {
        echo json_encode([
            'success' => true,
            'message' => 'most popular products',
            'products' => $products_discounted,
        ], JSON_PRETTY_PRINT);
        exit;
    }

    // chaeck if the user had a cart
    $stmt = $pdo->prepare("SELECT * FROM cart_items WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($cart_items) === 0) {
        echo json_encode([
            'success' => true,
            'message' => 'no cart items found for that user',
            'products' => $products_discounted
        ], JSON_PRETTY_PRINT);
        exit;
    }

    $half_limit = $limit / 2;

    // get the brands
    $stmt = $pdo->prepare("SELECT DISTINCT p.brand FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
    $stmt->execute([$user_id]);
    $brands = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // nombre de recommandation par marque de produit existant dans le panier
    $perBrand = max(1, floor($half_limit / count($brands)));

    //fetch des recommendation de chaque marque
    $recommended_products = [];
    foreach ($brands as $brand) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE brand = ? and ID NOT IN (select product_id from cart_items where user_id = ?) LIMIT $perBrand");
        $stmt->execute([$brand, $user_id]);
        $recommended_products = array_merge($recommended_products, $stmt->fetchAll(PDO::FETCH_ASSOC));
    }


    // get the the popular products that are not in the recommended products
    $recommendedIds = array_column($recommended_products, 'id');
    $placeholders = implode(',', array_fill(0, count($recommendedIds), '?'));

    $query = "SELECT * FROM products WHERE discount >= ? AND id NOT IN ($placeholders) order by discount DESC LIMIT $half_limit";
    $params = array_merge([$discount], $recommendedIds);
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $popular_products = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $all_products = array_merge($recommended_products, $popular_products);

    // Get product IDs in the cart
    $stmt = $pdo->prepare("SELECT product_id FROM cart_items WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $cart_product_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Filter $all_products to exclude products in the cart
    $filtered_products = array_filter($all_products, function ($product) use ($cart_product_ids) {
        return !in_array($product['id'], $cart_product_ids);
    });

    // Return the filtered products in the response
    echo json_encode([
        'success' => true,
        'message' => 'Recommended and popular products excluding cart items',
        'products' => array_values($filtered_products), // Reindex the array
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
