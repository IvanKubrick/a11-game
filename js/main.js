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
    rocket = game.add.sprite(400, game.world.height - 75, 'rocket');
    rocket.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(rocket);
    rocket.body.bounce.y = 0;
    rocket.body.gravity.y = 2;
    rocket.body.collideWorldBounds = true;

    // create controls
    cursors = game.input.keyboard.createCursorKeys();
}
function update() {
    // collision of the rocket with the ground
    game.physics.arcade.collide(rocket, ground);

    // reset rocket's speed
    //rocket.body.velocity.x = 0;

    // enable controls
    if (cursors.up.isDown) {
        if (rocket.body.velocity.y > -50) {
            rocket.body.velocity.y -= 0.4;
        }
    } else if (cursors.down.isDown) {
        if (rocket.body.velocity.y < 0) {
            rocket.body.velocity.y += 0.4;
        }
    } else if (!cursors.up.isDown) {
        if (rocket.body.velocity.y < 0) {
            rocket.body.velocity.y += 0.05;
        }
    } 

    if (cursors.left.isDown && !rocket.body.touching.down) {
        rocket.body.velocity.x = -50;
        if (rocket.angle > -45){
            rocket.angle -= 5;
        }
    } else if (cursors.right.isDown && !rocket.body.touching.down) {
        rocket.body.velocity.x = 50;
        if (rocket.angle < 45){
            rocket.angle += 5;
        }
    } else if (!cursors.left.isDown || !cursors.right.isDown || rocket.body.touching.down) {
        rocket.body.velocity.x = 0;
        //rocket.angle = 0;
        if (rocket.angle < 0){
            rocket.angle += 5;
        }
        if (rocket.angle > 0) {
            rocket.angle -= 5;
        }
    }
}