<?php

// register.php - User registration endpoint


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods:POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once "db.php";  // Importer la connexion


// Retrieve form data from the request body
$body = json_decode(file_get_contents("php://input"), true);

$name = isset($body['name']) ? trim($body['name']) : '';
$email = isset($body['email']) ? trim($body['email']) : '';
$password = isset($body['password']) ? $body['password'] : '';

// Validate inputs
if (empty($name || $email || $password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields.'
    ], JSON_PRETTY_PRINT);
    die();
}
try {

    // Check if email already exists
    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $userExists = (bool)$stmt->fetchColumn();

    if ($userExists) {
        // Email already registered
        echo json_encode([
            'success' => false,
            'message' => 'Email address is already registered change it'
        ], JSON_PRETTY_PRINT);
        die();
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user
        $stmt = $db->prepare("INSERT INTO users (name, email, password, createdAt) VALUES (?, ?, ?, NOW())");
        $result = $stmt->execute([$name, $email, $hashedPassword]);

        if ($result) {

            echo json_encode([
                'success' => true,
                'message' => 'Registration successful!',
                'user' => [
                    'id' => $db->lastInsertId(),
                    'name' => $name,
                    'email' => $email
                ]
            ], JSON_PRETTY_PRINT);
            die();



            // Optional: Create session for auto-login
            //session_start();
            //$_SESSION['user_id'] = $db->lastInsertId();
            //$_SESSION['user_name'] = $name;
            //$_SESSION['user_email'] = $email;
        } else {
            // Registration failed by the database
            echo json_encode([
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ], JSON_PRETTY_PRINT);
            die();
        }
    }
} catch (PDOException $e) {
    // registration failed by the server
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
    die();
}
