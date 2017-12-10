const CONFIGS = {
    mapWidth: 2000,
    mapHeight: 4000,
    skyHeight: 1000,
    groundHeight: 50,
    rocketMaxVelocity: 300
};

const gameField = document.querySelector('.game-field');

const game = new Phaser.Game(800, 600, Phaser.AUTO, gameField, {preload: preload, create: create, update: update, render: render});

function preload() {
    game.load.image('sky', 'assets/img/sky.jpg');
    game.load.image('space', 'assets/img/space.jpg');
    game.load.image('ground', 'assets/img/ground.png');
    game.load.spritesheet('rocket', 'assets/img/rocket-spritesheet.png', 50, 50);
    game.load.spritesheet('asteroid', 'assets/img/asteroid-spritesheet.png', 75, 75);
    game.load.image('fuelBar', 'assets/img/fuelBar.png');
    game.load.image('fuelCan', 'assets/img/fuelCan.png');
    game.load.image('clouds', 'assets/img/clouds.png');
}

let rocket;
let ground;
let cursors;
let fuelBar;
let fuelCans;
let asteroids;
let collision;

function create() {
    // common game settings
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, CONFIGS.mapWidth, CONFIGS.mapHeight);
    
    // add the background
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'sky');
    game.add.tileSprite(0, 0, game.world.width, game.world.height - CONFIGS.skyHeight, 'space');
    
    // create the ground
    ground = game.add.tileSprite(0, game.world.height - CONFIGS.groundHeight, game.world.width, CONFIGS.groundHeight, 'ground');
    game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    
    // create the rocket
    rocket = game.add.sprite(300, game.world.height - 75, 'rocket');
    rocket.anchor.set(0.5);
    game.physics.enable(rocket, Phaser.Physics.ARCADE);
    rocket.body.drag.set(35);
    rocket.body.maxVelocity.set(CONFIGS.rocketMaxVelocity);
    rocket.angle = -90;
    rocket.body.collideWorldBounds = true;
    rocket.body.setCircle(10, 15, 15);
    rocket.animations.add('move', makeArray(16), 12, true);
    
    // create controls
    cursors = game.input.keyboard.createCursorKeys();

    // camera following
    game.camera.follow(rocket);

    // add asteroids on the map 
    asteroids = game.add.group();
    asteroids.enableBody = true;

    for (let i = 0; i < 20; i++ ) {
        let asteroid = asteroids.create( game.world.randomX, game.world.randomY - (CONFIGS.skyHeight + 100), 'asteroid' );
        let size = 0.5 + Math.random();
        asteroid.body.setCircle(30, 7, 8);
        asteroid.scale.setTo(size);
        asteroid.animations.add('spin', makeArray(48), 8, true);
        asteroid.animations.play('spin');
    }
    asteroids.setAll('body.immovable', true);

    // add fuel cans on the map 
    fuelCans = game.add.group();
    fuelCans.enableBody = true;
    for (let i = 0; i < 40; i++ ) {
        let fuelCan = fuelCans.create( game.world.randomX, game.world.randomY - 100, 'fuelCan' );
        fuelCan.body.setSize(46, 58, -9, -9);
    }

    // create clouds
    const clouds = game.add.tileSprite(0, game.world.height - CONFIGS.skyHeight, game.world.width, 100, 'clouds');
    clouds.scale.setTo(2);
    clouds.anchor.set(0.5);
    

    // create the fuelBar
    fuelBar = new FuelBar();
    fuelBar.x = 0;
    fuelBar.y = 0;  
    fuelBar.fixedToCamera = true;
}
function update() {

    // animations
    rocket.animations.play('move');

    // collisions
    game.physics.arcade.collide(rocket, ground);
    collision = game.physics.arcade.collide(rocket, asteroids);

    // enable controls
    rocket.body.acceleration.set(0);
    rocket.body.angularVelocity = 0;

    if (fuelBar.fuelAmount > 0) {
        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(rocket.rotation, 150, rocket.body.acceleration);
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

    // collecting of fuelCans
    game.physics.arcade.overlap(rocket, fuelCans, collectFuel, null, this);
}

function collectFuel(rocket, fuelCan) {
    fuelBar.increaseFuel();
    fuelCan.kill();
}

function render() {
    // game.debug.body(rocket);
    // asteroids.children.forEach( asteroid => game.debug.body(asteroid));
    // fuelCans.children.forEach( fuelCan => game.debug.body(fuelCan));
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
        this.fuelAmount += 10;
        if (this.fuelAmount > 80) {
            this.fuelAmount = 80;
        }
        this.bar.scale.setTo(this.fuelAmount, 3);
    }  
}
function makeArray(n) {
    return Array(n).fill().map((el,i) => i);
}