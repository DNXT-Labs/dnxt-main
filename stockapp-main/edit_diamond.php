<?php
require 'db.php';
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
    header('Location: login.php');
    exit;
}

$id = isset($_GET['id']) ? $_GET['id'] : null; // Check if id is set
if (!$id) {
    // Handle the case when id is not provided
    // Redirect or display an error message
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM diamonds WHERE id = ?");
$stmt->execute([$id]); 

$diamond = $stmt->fetch();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $carat = isset($_POST['carat']) ? $_POST['carat'] : '';
    $cut = isset($_POST['cut']) ? $_POST['cut'] : '';
    $color = isset($_POST['color']) ? $_POST['color'] : '';
    $clarity = isset($_POST['clarity']) ? $_POST['clarity'] : '';
    $shape = isset($_POST['shape']) ? $_POST['shape'] : '';
    $certificate = isset($_POST['certificate']) ? $_POST['certificate'] : '';
    $price = isset($_POST['price']) ? $_POST['price'] : '';
    $image_url = isset($_POST['image_url']) ? $_POST['image_url'] : '';
    $video_url = isset($_POST['video_url']) ? $_POST['video_url'] : '';

    $stmt = $pdo->prepare("UPDATE diamonds SET name = ?, carat = ?, cut = ?, color = ?, clarity = ?, shape = ?, certificate = ?, price = ?, image_url = ?, video_url = ? WHERE id = ?");
    $stmt->execute([$name, $carat, $cut, $color, $clarity, $shape, $certificate, $price, $image_url, $video_url, $id]);

    header('Location: /home.php');
    exit;
}
?>

<?php include 'header.php'; ?>
<link rel="stylesheet" href="styles.css">
<h2>Edit Diamond</h2>
<form action="/edit/<?= $id ?>" method="post">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" value="<?= $diamond['name'] ?? '' ?>" required>
    <label for="carat">Carat:</label>
    <input type="number" step="0.01" id="carat" name="carat" value="<?= $diamond['carat'] ?? '' ?>" required>
    <label for="cut">Cut:</label>
    <input type="text" id="cut" name="cut" value="<?= $diamond['cut'] ?? '' ?>" required>
    <label for="color">Color:</label>
    <input type="text" id="color" name="color" value="<?= $diamond['color'] ?? '' ?>" required>
    <label for="clarity">Clarity:</label>
    <input type="text" id="clarity" name="clarity" value="<?= $diamond['clarity'] ?? '' ?>" required>
    <label for="shape">Shape:</label>
    <input type="text" id="shape" name="shape" value="<?= $diamond['shape'] ?? '' ?>" required>
    <label for="certificate">Certificate:</label>
    <input type="text" id="certificate" name="certificate" value="<?= $diamond['certificate'] ?? '' ?>">
    <label for="price">Price:</label>
    <input type="number" step="0.01" id="price" name="price" value="<?= $diamond['price'] ?? '' ?>" required>
    <label for="image_url">Image URL:</label>
    <input type="text" id="image_url" name="image_url" value="<?= $diamond['image_url'] ?? '' ?>">
    <label for="video_url">Video URL:</label>
    <input type="text" id="video_url" name="video_url" value="<?= $diamond['video_url'] ?? '' ?>">
    <button type="submit">Update Diamond</button>
</form>
<?php include 'footer.php'; ?>
