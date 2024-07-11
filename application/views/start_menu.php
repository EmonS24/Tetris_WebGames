<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tetris</title>
    <link rel="icon" type="image/x-icon" href="<?= base_url('assets/') ?>tetrislogo.png" />
    <link rel="stylesheet" href="<?php echo base_url('assets/css/mainstyle.css'); ?>">
</head>

<body>
    <div id="main-menu">
        <h1>Tetris</h1>
        <button onclick="location.href='<?php echo site_url('game/play'); ?>'">Start Game</button>
        <button onclick="location.href='<?php echo site_url('game/high_scores'); ?>'">High Scores</button>
    </div>
</body>

</html>