<?php
// Autoriser les requêtes venant de n'importe où (*), ou préciser l'origine exacte
header("Access-Control-Allow-Origin: *");

// Autoriser les méthodes HTTP
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Autoriser les en-têtes personnalisés
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Spécifier que la réponse est en JSON
header("Content-Type: application/json");

require_once "db.php";  // Importer la connexion


try {
    $name = isset($_GET['name']) ? $_GET['name'] : null;

    if (!empty($name)) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE name LIKE :name");
        $searchTerm = '%' . $name . '%';
        $stmt->bindParam(":name", $searchTerm, PDO::PARAM_STR);
        $stmt->execute();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No search term provided"
        ], JSON_PRETTY_PRINT);
        return;
    }

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($products) || count($products) == 0) {
        echo json_encode([
            "success" => false,
            "message" => "No products found"
        ], JSON_PRETTY_PRINT);
        return;
    }

    echo json_encode(["success" => true, "products" => $products], JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
