var game = new Phaser.Game(500, 900, Phaser.CANVAS, 'myGame', {
    preload: preload, create: create, update: update, render: render, addTile: addTile,
    addPlatform: addPlatform, initPlatforms: initPlatforms, createPlayer: createPlayer,
    gameOver: gameOver, createScore: createScore,incrementScore: incrementScore
});

function preload() {

    this.game.load.image('tile', 'asset/image/floor.png');
    this.game.load.image('player', 'asset/image/player.png',);
    this.game.state.start("myGame");

}

var player;
var cursors;
var floor;

function create() {
    var me = this;

    me.tileWidth = me.game.cache.getImage('tile').width;
    me.tileHeight = me.game.cache.getImage('tile').height;


    me.game.stage.backgroundColor = '479cde';

    me.game.physics.startSystem(Phaser.Physics.ARCADE);

    me.platforms = me.game.add.group();
    me.platforms.enableBody = true;
    me.platforms.createMultiple(200, 'tile');
    me.timer = game.time.events.loop(2000, me.addPlatform, me);
    me.createPlayer();

    me.cursors = me.game.input.keyboard.createCursorKeys();
    me.score = 0;

    me.createScore();
    me.spacing = 200;
    me.initPlatforms();
    me.score = 0;
    me.createScore();
}

function addTile(x, y) {

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

function addPlatform(y) {

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
    if(typeof(y) == "undefined"){
        y = -me.tileHeight;
        //Increase the players score
        me.incrementScore();
    }
}

function initPlatforms() {

    var me = this,
        bottom = me.game.world.height - me.tileHeight,
        top = me.tileHeight;

    //Keep creating platforms until they reach (near) the top of the screen
    for(var y = bottom; y > top - me.tileHeight; y = y - me.spacing){
        me.addPlatform(y);
    }

}

function createPlayer() {

    var me = this;

    //Add the player to the game by creating a new sprite
    me.player = me.game.add.sprite(me.game.world.centerX, me.game.world.height - (me.spacing * 2 + (3 * me.tileHeight)), 'player');

    //Set the players anchor point to be in the middle horizontally
    me.player.anchor.setTo(0.5, 1.0);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player);

    //Make the player fall by applying gravity
    me.player.body.gravity.y = 2000;

    //Make the player collide with the game boundaries
    me.player.body.collideWorldBounds = true;

    //Make the player bounce a little
    me.player.body.bounce.y = 0.1;

}

function gameOver() {
    this.game.state.start('myGame');
}

function createScore() {
    var me = this;
    var scoreFont = "100px Arial";
    me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
    me.scoreLabel.anchor.setTo(0.5, 0.5);
    me.scoreLabel.align = 'center';

}

function incrementScore () {

    var me = this;

    me.score += 1;
    me.scoreLabel.text = me.score;

}

function update() {
    var me = this;

    //Make the sprite collide with the ground layer
    me.game.physics.arcade.collide(me.player, me.platforms);


    //Check if the player is touching the bottom
    if(me.player.body.position.y >= me.game.world.height - me.player.body.height){
        me.gameOver();
    }
    if(me.cursors.up.isDown && me.player.body.wasTouching.down) {
        me.player.body.velocity.y = -1400;
    }
//Make the player go left
    if(me.cursors.left.isDown){
        me.player.body.velocity.x += -30;
    }
//Make the player go right
    if(me.cursors.right.isDown){
        me.player.body.velocity.x += 30;
    }
}

function render() {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
