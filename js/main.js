const gameField = document.querySelector('.game-field');

const game = new Phaser.Game(800, 600, Phaser.AUTO, gameField, {preload: preload, create: create, update: update, render: render});

function preload() {
    game.load.image('space', 'assets/space.jpg');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('rocket', 'assets/rocket.png');
    game.load.image('fuelBar', 'assets/fuelBar.png');
    game.load.image('fuelCan', 'assets/fuelCan.png');
    game.load.image('asteroid', 'assets/asteroid.png');
}

let rocket;
let ground;
let cursors;
let fuelBar;
let fuelCans;
let asteroids;

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
    rocket.body.drag.set(35);
    rocket.body.maxVelocity.set(300);
    rocket.angle = -90;
    rocket.body.collideWorldBounds = true;
    rocket.body.setCircle(10, 15, 15);
    //rocket.body.bounce.set(1);
    
    // create controls
    cursors = game.input.keyboard.createCursorKeys();

    // camera following
    game.camera.follow(rocket);

    // create the fuelBar
    fuelBar = new FuelBar();
    fuelBar.x = 0;
    fuelBar.y = 0;  
    fuelBar.fixedToCamera = true;

    // add asteroids on the map 
    asteroids = game.add.group();
    asteroids.enableBody = true;

    for (let i = 0; i < 10; i++ ) {
        let asteroid = asteroids.create( game.world.randomX, game.world.randomY - 200, 'asteroid' );
        let size = 0.5 + Math.random();
        asteroid.body.setCircle(35, 0, 0);
        asteroid.scale.setTo(size);
    }
    asteroids.setAll('body.immovable', true);

    // add fuel cans on the map 
    fuelCans = game.add.group();
    fuelCans.enableBody = true;
    for (let i = 0; i < 20; i++ ) {
        let can = fuelCans.create( game.world.randomX, game.world.randomY - 150, 'fuelCan' );
        can.body.setSize(40, 50, -6, -5);
    }
    //fuelCans.callAll('')
}
function update() {

    // collisions
    game.physics.arcade.collide(rocket, ground);
    game.physics.arcade.collide(rocket, asteroids);

    // enable controls
    rocket.body.acceleration.set(0);
    rocket.body.angularVelocity = 0;

    if (fuelBar.fuelAmount > 0) {
        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(rocket.rotation, 100, rocket.body.acceleration);
            fuelBar.decreaseFuel();
        }
    }

    if (cursors.left.isDown) {
        rocket.body.angularVelocity = -100;
    } else if (cursors.right.isDown) {
        rocket.body.angularVelocity = 100;
    } else {
        rocket.body.angularVelocity = 0;
    }

    game.physics.arcade.velocityFromRotation( rocket.rotation, rocket.body.velocity.getMagnitude(), rocket.body.velocity );


    // // enable controls
    // if (cursors.up.isDown) {
    //     if (fuelBar.fuelAmount <= 0) {
    //         return;
    //     }
    //     game.physics.arcade.accelerationFromRotation(rocket.rotation, 100, rocket.body.acceleration);
    //     fuelBar.decreaseFuel();
    // } else {
    //     rocket.body.acceleration.set(0);
    // }

    // if (cursors.left.isDown) {
    //     rocket.body.angularVelocity = -100;
    // } else if (cursors.right.isDown) {
    //     rocket.body.angularVelocity = 100;
    // } else {
    //     rocket.body.angularVelocity = 0;
    // }

    // game.physics.arcade.velocityFromRotation( rocket.rotation, rocket.body.velocity.getMagnitude(), rocket.body.velocity );


    // collecting of fuelCans
    game.physics.arcade.overlap(rocket, fuelCans, collectFuel, null, this);
}

function collectFuel(rocket, fuelCan) {
    fuelBar.fuelAmount += 10;
    fuelBar.increaseFuel();
    fuelCan.kill();
}

function render() {
    game.debug.body(rocket);
    asteroids.children.forEach( asteroid => game.debug.body(asteroid));
    fuelCans.children.forEach( fuelCan => game.debug.body(fuelCan));
}

class FuelBar extends Phaser.Group {
    constructor() {
        super(game);
        this.bar = this.create(0, 0, 'fuelBar');
        this.fuelAmount = 80;
        this.bar.scale.setTo(this.fuelAmount, 3);
    }
    decreaseFuel() {
        this.fuelAmount -= 0.2;
        this.bar.scale.setTo(this.fuelAmount, 3);
    } 
    increaseFuel() {
        this.fuelAmount += 5;
        if (this.fuelAmount > 80) {
            this.fuelAmount = 80;
        }
        this.bar.scale.setTo(this.fuelAmount, 3);
    }  
}