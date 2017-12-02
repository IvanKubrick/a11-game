const gameField = document.querySelector('.game-field');

const game = new Phaser.Game(800, 600, Phaser.AUTO, gameField, {preload: preload, create: create, update: update, render: render});
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
    game.world.setBounds(0, 0, 1920, 1080);
    game.add.sprite(0, 0, 'space');

    // // create the ground
    // ground = game.add.sprite(0, game.height - 50, 'ground');
    // ground.scale.setTo(80, 5);
    // game.physics.enable(ground, Phaser.Physics.ARCADE);
    // ground.body.immovable = true;

    // create the rocket
    rocket = game.add.sprite(300, 300, 'rocket');
    rocket.anchor.set(0.5);
    game.physics.enable(rocket, Phaser.Physics.ARCADE);
    rocket.body.drag.set(100);
    rocket.body.maxVelocity.set(100);
    rocket.angle = -90;

    // create controls
    cursors = game.input.keyboard.createCursorKeys();

    // camera following
    game.camera.follow(rocket);
}
function update() {

    // // collision of the rocket with the ground
    // game.physics.arcade.collide(rocket, ground);

    // enable controls
    if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(rocket.rotation, 50, rocket.body.acceleration);
    } else {
        rocket.body.acceleration.set(0);
    }

    if (cursors.left.isDown) {
        rocket.body.angularVelocity = -100;
    } else if (cursors.right.isDown) {
        rocket.body.angularVelocity = 100;
    } else {
        rocket.body.angularVelocity = 0;
    }

    //screenWrap(rocket);
}

function screenWrap (sprite) {   
    if (rocket.x < 0) {
        rocket.x = game.width;
    } else if (rocket.x > game.width) {
        rocket.x = 0;
    }

    if (rocket.y < 0) {
        rocket.y = game.height;
    } else if (rocket.y > game.height) {
        rocket.y = 0;
    }
}

function render() {
    
}