<?php
require 'db.php';
session_start();

$stmt = $pdo->prepare("SELECT * FROM diamonds");
$stmt->execute();
$diamonds = $stmt->fetchAll();
?>

<?php include 'header.php'; ?>
<link rel="stylesheet" href="styles.css">
<h2>Diamonds</h2>
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Carat</th>
            <th>Cut</th>
            <th>Color</th>
            <th>Clarity</th>
            <th>Shape</th>
            <th>Certificate</th>
            <th>Price</th>
            <th>Image</th>
            <th>Video</th>
            <?php if(isset($_SESSION['user']) && $_SESSION['user']['role'] == 'admin'): ?>
                <th>Actions</th>
            <?php endif; ?>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($diamonds as $diamond): ?>
            <tr>
                <td><?= htmlspecialchars($diamond['name']) ?></td>
                <td><?= htmlspecialchars($diamond['carat']) ?></td>
                <td><?= htmlspecialchars($diamond['cut']) ?></td>
                <td><?= htmlspecialchars($diamond['color']) ?></td>
                <td><?= htmlspecialchars($diamond['clarity']) ?></td>
                <td><?= htmlspecialchars($diamond['shape']) ?></td>
                <td><?= htmlspecialchars($diamond['certificate']) ?></td>
                <td><?= htmlspecialchars($diamond['price']) ?></td>
                <td>
                    <?php if ($diamond['image_url']): ?>
                        <img src="<?= htmlspecialchars($diamond['image_url']) ?>" alt="Diamond Image" width="100">
                    <?php endif; ?>
                </td>
                <td>
                    <?php if ($diamond['video_url']): ?>
                        <a href="<?= htmlspecialchars($diamond['video_url']) ?>" target="_blank">Watch Video</a>
                    <?php endif; ?>
                </td>
                <?php if(isset($_SESSION['user']) && $_SESSION['user']['role'] == 'admin'): ?>
                    <td>
                        <a href="edit_diamond.php?id=<?= $diamond['id'] ?>">Edit</a>
                        <a href="delete_diamond.php?id=<?= $diamond['id'] ?>" onclick="return confirm('Are you sure you want to delete this diamond?');">Delete</a>
                    </td>
                <?php endif; ?>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?php include 'footer.php'; ?>
