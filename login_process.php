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
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $password = $_POST["password"];
    $remember = isset($_POST["remember"]) ? true : false;
    
    // Validar campos
    if (empty($email) || empty($password)) {
        header("Location: login.html?error=empty_fields");
        exit();
    }
    
    try {
        // Buscar usuario por email
        $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = :email");
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verificar contraseña
            if (password_verify($password, $user["password"])) {
                // Iniciar sesión
                $_SESSION["user_id"] = $user["id"];
                $_SESSION["user_name"] = $user["name"];
                $_SESSION["user_email"] = $user["email"];
                
                // Si seleccionó "recordarme", crear cookie
                if ($remember) {
                    $token = bin2hex(random_bytes(32));
                    $expires = time() + (86400 * 30); // 30 días
                    
                    // Guardar token en la base de datos
                    $stmt = $conn->prepare("INSERT INTO remember_tokens (user_id, token, expires) VALUES (:user_id, :token, :expires)");
                    $stmt->bindParam(":user_id", $user["id"]);
                    $stmt->bindParam(":token", $token);
                    $stmt->bindParam(":expires", $expires);
                    $stmt->execute();
                    
                    // Crear cookie
                    setcookie("remember_token", $token, $expires, "/", "", true, true);
                }
                
                // Redirigir al dashboard o página principal
                header("Location: index.html?login=success");
                exit();
            } else {
                header("Location: login.html?error=wrong_password");
                exit();
            }
        } else {
            header("Location: login.html?error=user_not_found");
            exit();
        }
    } catch(PDOException $e) {
        header("Location: login.html?error=database_error");
        exit();
    }
}
?>
