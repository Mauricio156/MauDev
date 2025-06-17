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
    $name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
    
    // Validar campos
    if (empty($name) || empty($email) || empty($message)) {
        header("Location: index.html?contact=error#contact");
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?contact=invalid_email#contact");
        exit();
    }
    
    try {
        // Insertar mensaje en la base de datos
        $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, message, created_at) VALUES (:name, :email, :message, NOW())");
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":message", $message);
        $stmt->execute();
        
        $to = "a21300156@ceti.mx"; // Cambia esto por tu email
        // Enviar correo electrónico
        $subject = "Nuevo mensaje de contacto de $name";
        $email_message = "Nombre: $name\n";
        $email_message .= "Email: $email\n\n";
        $email_message .= "Mensaje:\n$message";
        $headers = "From: $email";
        
        mail($to, $subject, $email_message, $headers);
        
        // Redirigir con mensaje de éxito
        header("Location: index.html?contact=success#contact");
        exit();
    } catch(PDOException $e) {
        header("Location: index.html?contact=error#contact");
        exit();
    }
}
?>
