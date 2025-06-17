<?php
// Configuración de la base de datos
$host = "localhost";
$dbname = "maudev_db";
$username = "root";
$password = "";

// Conexión a la base de datos
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    
    // Validar email
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?newsletter=invalid_email");
        exit();
    }
    
    try {
        // Verificar si el email ya está suscrito
        $stmt = $conn->prepare("SELECT id FROM newsletter_subscribers WHERE email = :email");
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            header("Location: index.html?newsletter=already_subscribed");
            exit();
        }
        
        // Insertar nuevo suscriptor
        $stmt = $conn->prepare("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (:email, NOW())");
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        // Redirigir con mensaje de éxito
        header("Location: index.html?newsletter=success");
        exit();
    } catch(PDOException $e) {
        header("Location: index.html?newsletter=error");
        exit();
    }
}
?>
