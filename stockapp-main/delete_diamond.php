<?php
require 'db.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
    header('Location: login.php');
    exit;
}

$id = $_GET['id'];
$stmt = $pdo->prepare("DELETE FROM diamonds WHERE id = ?");
$stmt->execute([$id]);

header('Location: diamonds.php');
exit;
?>