<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>High Scores</title>
    <link rel="icon" type="image/x-icon" href="<?= base_url('assets/') ?>tetrislogo.png" />
    <link rel="stylesheet" href="<?php echo base_url('assets/css/mainstyle.css'); ?>">
</head>

<body>
    <div id="highscores" class="text-center align-middle">
        <h1>High Scores</h1>
        <table class="table table-bordered table-striped table-hover">
            <tr>
                <th>Player Name</th>
                <th>Score</th>
            </tr>
            <?php foreach ($highscores as $score): ?>
                <tr>
                    <td><?php echo htmlspecialchars($score['player_name']); ?></td>
                    <td><?php echo htmlspecialchars($score['score']); ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
        <button onclick="location.href='<?php echo site_url('game'); ?>'">Back to Menu</button>
    </div>
</body>

</html>