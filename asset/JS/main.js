
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'myGame', { preload: preload, create: create, update: update, render: render, addTile: addTile, addPlatform: addPlatform, initPlatforms: initPlatforms });

function preload() {

    game.load.spritesheet('dude', 'asset/image/rogue.png', 32, 33, 100);
    game.load.spritesheet('platform', 'asset/image/A_World_01.png', 32, 33);
    game.load.image('floor', 'asset/image/floor.png');
    game.load.image('floor2', 'asset/image/floor2.png');
    game.load.image('floor3', 'asset/image/floor3.png');
    game.load.image('background', 'asset/image/sky2.jpg');
    game.load.image('background2', 'asset/image/sky3.png');
    game.load.image('background3', 'asset/image/sky5.png');
    game.load.image('background4', 'asset/image/sky4.png');

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
    var me = this;

    me.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Set le background de base à l'emplacement 0 0 et de dimension 800x600
    bg = me.game.add.tileSprite(0, 0, 800, 600, "background");

    // Set le sol de base à l'emplacement i (une frame du sol fait 102px, 714px = taille pour mettre du sol sur tout l'écran)
    // for (var i = 0; i <= 714; i = i + 102) {
    //     floor = game.add.image(i, 568, 'floor');
    // }
    me.tileWidth = me.game.cache.getImage('floor').width;
    me.tileHeight = me.game.cache.getImage('floor').height;

    me.platforms = me.game.add.group();
    me.platforms.enableBody = true;
    me.platforms.createMultiple(25, 'floor');

    me.game.physics.arcade.gravity.y = 30;


    player = me.game.add.sprite(200, 340, 'dude');
    player.scale.setTo(1.5, 1.5);

    me.game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 1000;
    player.body.maxVelocity.y = 500;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = me.game.input.keyboard.createCursorKeys();
    jumpButton = me.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    me.timer = me.game.time.events.loop(2000, me.addPlatform, me);

    //The spacing for the initial platforms
    me.spacing = 300;

//Create the inital on screen platforms
    me.initPlatforms();

}

function addTile(x, y){

    var me = this;

    //Get a tile that is not currently on screen
    var tile = me.platforms.getFirstDead();

    //Reset it to the specified coordinates
    tile.reset(x, y);
    tile.body.velocity.y = 150;
    tile.body.immovable = true;

    //When the tile leaves the screen, kill it
    tile.checkWorldBounds = true;
    tile.outOfBoundsKill = true;
}

function addPlatform(y){

    var me = this;

    //If no y position is supplied, render it just outside of the screen
    if(typeof(y) == "undefined"){
        y = -me.tileHeight;
    }

    //Work out how many tiles we need to fit across the whole screen
    var tilesNeeded = Math.ceil(me.game.world.width / me.tileWidth);

    //Add a hole randomly somewhere
    var hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;

    //Keep creating tiles next to each other until we have an entire row
    //Don't add tiles where the random hole is
    for (var i = 0; i < tilesNeeded; i++){
        if (i != hole && i != hole + 1){
            this.addTile(i * me.tileWidth, y);
        }
    }

}

function initPlatforms(){

    var me = this,
        bottom = me.game.world.height - me.tileHeight,
        top = me.tileHeight;

    //Keep creating platforms until they reach (near) the top of the screen
    for(var y = bottom; y > top - me.tileHeight; y = y - me.spacing){
        me.addPlatform(y);
    }

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

    // if (jumpMany === 1) {
    //     bg.loadTexture('background2');
    //     floor.loadTexture('floor2');
    //     // for (var i = 0; i <= 714; i = i + 102) {
    //     //     floor = game.add.image(i, 568, 'floor2');
    //     // }
    // }
    // if (jumpMany === 2) {
    //     bg.loadTexture('background3');
    //     for (var i = 0; i <= 714; i = i + 102) {
    //         floor = game.add.image(i, 557, 'floor3');
    //     }
    // }
    // if (jumpMany === 3) {
    //     bg.loadTexture('background4');
    // }


}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
