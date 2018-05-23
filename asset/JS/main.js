
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('dude', 'asset/image/rogue.png', 32, 33, 100);
    game.load.spritesheet('platform', 'asset/image/A_World_01.png', 32, 33);
    game.load.image('floor', 'asset/image/floor.png');
    game.load.image('background', 'asset/image/sky2.jpg');
    game.load.image('background2', 'asset/image/sky3.png');

}

var player;
var facing = 'left';
var jumpTimer = 0;
var jumpMany = 0;
var cursors;
var jumpButton;
var bg;
var floor;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Set le background de base à l'emplacement 0 0 et de dimension 800x600
    bg = game.add.tileSprite(0, 0, 800, 600, "background");
    // Set le sol de base à l'emplacement 0 0
    floor = game.add.image(0, 578, 'floor');
    floor = game.add.image(102, 578, 'floor');
    floor = game.add.image(204, 578, 'floor');
    floor = game.add.image(306, 578, 'floor');
    floor = game.add.image(408, 578, 'floor');
    floor = game.add.image(510, 578, 'floor');
    floor = game.add.image(612, 578, 'floor');
    floor = game.add.image(714, 578, 'floor');

    game.physics.arcade.gravity.y = 300;


    player = game.add.sprite(200, 340, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 1000;
    player.body.maxVelocity.y = 500;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    // game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -500;
        jumpTimer = game.time.now + 750;
    }


    if (jumpButton.isDown && player.body.onFloor()) {
        jumpMany++;
    }
    if (jumpMany === 5) {
        bg.loadTexture('background2');
    }


}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
