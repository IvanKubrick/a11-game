const gameField = document.querySelector('.game-field');

const game = new Phaser.Game(800, 600, Phaser.AUTO, gameField, {preload: preload, create: create, update: update});
//const HEIGHT = game.world.height;

function preload() {
    game.load.image('space', 'assets/space.jpg');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('rocket', 'assets/rocket.png');
}

let rocket;
let ground;
let curcors;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // add the background
    game.add.sprite(0, 0, 'space');
   
    // create the ground
    ground = game.add.sprite(0, game.world.height - 50, 'ground');
    ground.scale.setTo(80, 5);
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;

    // create the rocket
    rocket = game.add.sprite(375, game.world.height - 100, 'rocket');
    game.physics.arcade.enable(rocket);
    rocket.body.bounce.y = 0.2;
    rocket.body.gravity.y = 2;
    rocket.body.collideWorldBounds = true;

    // create controls
    cursors = game.input.keyboard.createCursorKeys();
}
function update() {
    // collision of the rocket with the ground
    game.physics.arcade.collide(rocket, ground);

    // reset rocket's speed
    rocket.body.velocity.x = 0;

    if (cursors.up.isDown && cursors.left.isDown) {
        rocket.body.velocity.y = -50;
        rocket.body.velocity.x = -50;
    } else if (cursors.up.isDown && cursors.right.isDown) {
        rocket.body.velocity.y = -50;
        rocket.body.velocity.x = 50;
    } else if (cursors.up.isDown) {
        rocket.body.velocity.y = -50;
    } else if (cursors.left.isDown && !rocket.body.touching.down) {
        rocket.body.velocity.x = -50;
    } else if (cursors.right.isDown && !rocket.body.touching.down) {
        rocket.body.velocity.x = 50;
    } else if (cursors.down.isDown) {
        rocket.body.velocity.y = 0;
    }
}