<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="diamonds.php">Diamonds</a></li>
        <?php if (isset($_SESSION['user'])): ?>
            <?php if ($_SESSION['user']['role'] == 'admin'): ?>
                <li><a href="add_diamond.php">Add Diamond</a></li>
            <?php endif; ?>
            <li><a href="logout.php">Logout</a></li>
        <?php else: ?>
            <li><a href="login.php">Login</a></li>
            <li><a href="register.php">Register</a></li>
        <?php endif; ?>
    </ul>
</nav>
