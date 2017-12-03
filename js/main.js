const gameField = document.querySelector('.game-field');

const game = new Phaser.Game(800, 600, Phaser.AUTO, gameField, {preload: preload, create: create, update: update, render: render});

function preload() {
    game.load.image('space', 'assets/space.jpg');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('rocket', 'assets/rocket.png');
    game.load.image('fuelBar', 'assets/fuelBar.png');
}

let rocket;
let ground;
let cursors;
let fuelBar;jghj

function create() {
    // common game settings
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1920, 1080);
    
    // add the background
    game.add.sprite(0, 0, 'space');
    
    // create the ground
    ground = game.add.sprite(0, game.world.height - 50, 'ground');
    ground.scale.setTo(192, 5);
    game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    
    // create the rocket
    rocket = game.add.sprite(300, game.world.height - 75, 'rocket');
    rocket.anchor.set(0.5);
    game.physics.enable(rocket, Phaser.Physics.ARCADE);
    rocket.body.drag.set(20);
    rocket.body.maxVelocity.set(300);
    rocket.angle = -90;
    rocket.body.collideWorldBounds = true;
    
    // create controls
    cursors = game.input.keyboard.createCursorKeys();

    // camera following
    game.camera.follow(rocket);

    // create fuelBar
    fuelBar = new FuelBar();
    fuelBar.x = 0;
    fuelBar.y = game.world.height - game.height;

}
function update() {

    // collision of the rocket with the ground
    game.physics.arcade.collide(rocket, ground);

    // enable controls
    if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(rocket.rotation, 100, rocket.body.acceleration);
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

    game.physics.arcade.velocityFromRotation( rocket.rotation, rocket.body.velocity.getMagnitude(), rocket.body.velocity );
}


function render() {
    
}

class FuelBar extends Phaser.Group {
    constructor() {
        super(game);
        let bar = this.create(0, 0, 'fuelBar');
        bar.scale.setTo(30, 3);
    }
}