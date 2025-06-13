<?php
session_start();

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
    $password = $_POST["password"];
    $confirm_password = $_POST["confirm_password"];
    $terms = isset($_POST["terms"]) ? true : false;
    
    // Validar campos
    if (empty($name) || empty($email) || empty($password) || empty($confirm_password)) {
        header("Location: login.html?tab=register&error=empty_fields");
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: login.html?tab=register&error=invalid_email");
        exit();
    }
    
    if ($password !== $confirm_password) {
        header("Location: login.html?tab=register&error=passwords_dont_match");
        exit();
    }
    
    if (!$terms) {
        header("Location: login.html?tab=register&error=terms_not_accepted");
        exit();
    }
    
    try {
        // Verificar si el email ya está registrado
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            header("Location: login.html?tab=register&error=email_exists");
            exit();
        }
        
        // Hash de la contraseña
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insertar nuevo usuario
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (:name, :email, :password, NOW())");
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->execute();
        
        // Obtener el ID del usuario recién creado
        $user_id = $conn->lastInsertId();
        
        // Iniciar sesión automáticamente
        $_SESSION["user_id"] = $user_id;
        $_SESSION["user_name"] = $name;
        $_SESSION["user_email"] = $email;
        
        // Redirigir al dashboard o página principal
        header("Location: index.html?register=success");
        exit();
    } catch(PDOException $e) {
        header("Location: login.html?tab=register&error=database_error");
        exit();
    }
}
?>
