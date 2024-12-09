<?php
// Start or resume session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Include database connection or configuration file
require 'db.php';

// Get the requested URL
$request = $_SERVER['REQUEST_URI'];

// Remove leading and trailing slashes, then split the URL into segments
$params = explode('/', trim($request, '/'));

// Default to home if no params are given
if (empty($params[0])) {
    $params[0] = 'home';
}

// Handle routing based on the first parameter
switch ($params[0]) {
    case 'home':
        include 'home.php';
        break;
    case 'register':
        include 'register.php';
        break;
    case 'login':
        include 'login.php';
        break;
    case 'logout':
        include 'logout.php';
        break;
    case 'diamonds':
        include 'diamonds.php';
        break;
    case 'add':
        include 'add_diamond.php';
        break;
    case 'edit':
        // Pass the ID parameter to the edit_diamond.php file
        $_GET['id'] = $params[1];
        include 'edit_diamond.php';
        break;
    case 'delete':
        // Pass the ID parameter to the delete_diamond.php file
        $_GET['id'] = $params[1];
        include 'delete_diamond.php';
        break;
    default:
        // Return a 404 error page
        http_response_code(404);
        include '404.php'; // Provide a 404 error page if desired
        break;
}
?>
