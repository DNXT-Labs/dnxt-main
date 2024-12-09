<?php
require 'db.php';
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
    header('Location: login.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $carat = $_POST['carat'];
    $cut = $_POST['cut'];
    $color = $_POST['color'];
    $clarity = $_POST['clarity'];
    $shape = $_POST['shape'];
    $certificate = $_POST['certificate'];
    $price = $_POST['price'];
    $image_url = $_POST['image_url'];
    $video_url = $_POST['video_url'];

    $stmt = $pdo->prepare("INSERT INTO diamonds (name, carat, cut, color, clarity, shape, certificate, price, image_url, video_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $carat, $cut, $color, $clarity, $shape, $certificate, $price, $image_url, $video_url]);

    header('Location: diamonds.php');
    exit;
}
?>

<?php include 'header.php'; ?>
<link rel="stylesheet" href="styles.css">
<h2>Add Diamond</h2>
<form action="add_diamond.php" method="post">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="carat">Carat:</label>
    <input type="number" step="0.01" id="carat" name="carat" required>
    <label for="cut">Cut:</label>
    <input type="text" id="cut" name="cut" required>
    <label for="color">Color:</label>
    <input type="text" id="color" name="color" required>
    <label for="clarity">Clarity:</label>
    <input type="text" id="clarity" name="clarity" required>
    <label for="shape">Shape:</label>
    <input type="text" id="shape" name="shape" required>
    <label for="certificate">Certificate:</label>
    <input type="text" id="certificate" name="certificate">
    <label for="price">Price:</label>
    <input type="number" step="0.01" id="price" name="price" required>
    <label for="image_url">Image URL:</label>
    <input type="text" id="image_url" name="image_url">
    <label for="video_url">Video URL:</label>
    <input type="text" id="video_url" name="video_url">
    <button type="submit">Add Diamond</button>
</form>
<?php include 'footer.php'; ?>
