const CONFIGS = {
    planetDistance: 1000,
    mapWidth: 2000,
    mapHeight: 12000,
    skyHeight: 1000,
    groundHeight: 50,
    rocketMaxVelocity: 300,
    fuelIncreaseAmount: 10
};

const gameField = document.querySelector('.game-field');

const game = new Phaser.Game(800, 600, Phaser.AUTO, gameField, {preload: preload, create: create, update: update, render: render});

function preload() {
    game.load.audio('accelerationSound', 'assets/audio/acceleration.wav');
    game.load.audio('explosionSound', 'assets/audio/explosion.mp3');
    game.load.audio('fuelCollectionSound', 'assets/audio/fuelCollection.mp3');

    game.load.image('sky', 'assets/img/sky.jpg');
    game.load.image('space', 'assets/img/space.jpg');
    game.load.image('ground', 'assets/img/ground.png');
    game.load.spritesheet('rocket', 'assets/img/rocket-spritesheet.png', 50, 50);
    game.load.spritesheet('asteroid', 'assets/img/asteroid-spritesheet.png', 150, 150);
    game.load.image('fuelBar', 'assets/img/fuelBar.png');
    game.load.spritesheet('fuelCan', 'assets/img/fuelCan-spritesheet.png', 35, 40);
    game.load.image('clouds', 'assets/img/clouds.png');

    game.load.image('mercury', 'assets/img/planets/1-mercury.png');
    game.load.image('venus', 'assets/img/planets/2-venus.png');
    game.load.image('mars', 'assets/img/planets/3-mars.png');
    game.load.image('jupiter', 'assets/img/planets/4-jupiter.png');
    game.load.image('saturn', 'assets/img/planets/5-saturn.png');
    game.load.image('uranus', 'assets/img/planets/6-uranus.png');
    game.load.image('neptune', 'assets/img/planets/7-neptune.png');
    game.load.image('pluto', 'assets/img/planets/8-pluto.png');
    game.load.image('sun', 'assets/img/planets/9-sun.png');
    game.load.image('moon', 'assets/img/planets/10-moon.png');
}

let rocket;
let ground;
let cursors;
let fuelBar;
let fuelCans;
let asteroids;
let clouds;

let accelerationSound;
let fuelCollectionSound;
let explosionSound;


function create() {
    // general game settings
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, CONFIGS.mapWidth, CONFIGS.mapHeight);
    
    // background
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'sky');
    game.add.tileSprite(0, 0, game.world.width, game.world.height - CONFIGS.skyHeight, 'space');

    // planets
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 2 * CONFIGS.planetDistance, 'mercury');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 3 * CONFIGS.planetDistance, 'venus');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 4 * CONFIGS.planetDistance, 'mars');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 5 * CONFIGS.planetDistance, 'jupiter');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 6 * CONFIGS.planetDistance, 'saturn');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 7 * CONFIGS.planetDistance, 'uranus');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 8 * CONFIGS.planetDistance, 'neptune');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 9 * CONFIGS.planetDistance, 'pluto');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 10 * CONFIGS.planetDistance, 'sun');
    game.add.sprite(CONFIGS.mapWidth / 2, CONFIGS.mapHeight - 11 * CONFIGS.planetDistance, 'moon');
    
    // ground
    ground = game.add.tileSprite(0, game.world.height - CONFIGS.groundHeight, game.world.width, CONFIGS.groundHeight, 'ground');
    game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    
    // rocket
    rocket = game.add.sprite(CONFIGS.mapWidth / 2, game.world.height - 75, 'rocket');
    rocket.anchor.set(0.5);
    game.physics.enable(rocket, Phaser.Physics.ARCADE);
    rocket.body.drag.set(35);
    rocket.body.maxVelocity.set(CONFIGS.rocketMaxVelocity);
    rocket.angle = -90;
    rocket.body.collideWorldBounds = true;
    rocket.body.setCircle(10, 15, 15);
    rocket.animations.add('rotation', makeArray(16), 12, true);
    
    // controls
    cursors = game.input.keyboard.createCursorKeys();

    // camera following
    game.camera.follow(rocket);

    // asteroids
    asteroids = game.add.group();
    asteroids.enableBody = true;
    for (let i = 0; i < 100; i++ ) {
        let asteroid = asteroids.create( game.world.randomX, game.world.randomY - (CONFIGS.skyHeight + 100), 'asteroid' );
        let size = 0.5 + Math.random();
        asteroid.body.setCircle(25, 51, 51);
        asteroid.scale.setTo(size);
        asteroid.destroyed = false;
        asteroid.animations.add('rotation', makeArray(48), 8, true);
        asteroid.animations.add('explosion', [48, 49, 50, 51, 52, 53, 54, 55, 56, 57], 8, false);
        asteroid.animations.play('rotation');
        //asteroid.body.gravity.y = 10;
    }

    // fuel cans
    fuelCans = game.add.group();
    fuelCans.enableBody = true;
    for (let i = 0; i < 300; i++ ) {
        let fuelCan = fuelCans.create( game.world.randomX, game.world.randomY - 100, 'fuelCan' );
        fuelCan.body.setSize(46, 58, -9, -9);
        fuelCan.animations.add('rotation', [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1], 10, true);
        fuelCan.animations.play('rotation');
    }

    // clouds
    clouds = game.add.tileSprite(0, game.world.height - CONFIGS.skyHeight, game.world.width, 100, 'clouds');
    clouds.scale.setTo(2);
    clouds.anchor.set(0.5);
    
    // fuel bar
    fuelBar = new FuelBar();
    fuelBar.x = 0;
    fuelBar.y = 0;  
    fuelBar.fixedToCamera = true;

    // sounds
    fuelCollectionSound = game.add.audio('fuelCollectionSound');
    explosionSound = game.add.audio('explosionSound');
    accelerationSound = game.add.audio('accelerationSound');
}

function update() {
    window.console.log(rocket.body.velocity.getMagnitude());
    // animations
    if (rocket.body.velocity.getMagnitude() > 50) {
        rocket.animations.play('rotation');
    }
    clouds.x += 0.4;

   
    // collisions
    game.physics.arcade.collide(rocket, ground);

    // enable controls
    rocket.body.acceleration.set(0);
    rocket.body.angularVelocity = 0;

    if (fuelBar.fuelAmount > 0) {
        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(rocket.rotation, 150, rocket.body.acceleration);
            fuelBar.decreaseFuel(0.2);
            //accelerationSound.play('', 0, 1);
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

    // overlapping
    game.physics.arcade.overlap(rocket, fuelCans, collectFuel, null, this);
    game.physics.arcade.overlap(rocket, asteroids, destroyAsteroid, null, this);
}

function collectFuel(rocket, fuelCan) {
    fuelCollectionSound.play('', 0, 0.3);
    fuelBar.increaseFuel();
    fuelCan.destroy();
}
function destroyAsteroid(rocket, asteroid) {

    explosionSound.play('', 0, 0.3);
    window.console.log(asteroid.destroyed);
    if (asteroid.destroyed === false) {
        fuelBar.decreaseFuel(10);
        asteroid.destroyed = true;
    } 
    window.console.log(asteroid.destroyed);
    asteroid.animations.play('explosion');
    setTimeout(() => {
        asteroid.destroy();
    }, 700); 
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
        this.bar.scale.setTo(this.fuelAmount, 2);
    }
    decreaseFuel(n) {
        this.fuelAmount -= n;
        if (this.fuelAmount < 0) {
            this.fuelAmount = 0;
        }
        this.bar.scale.setTo(this.fuelAmount, 2);
    } 
    increaseFuel() {
        this.fuelAmount += CONFIGS.fuelIncreaseAmount;
        if (this.fuelAmount > 80) {
            this.fuelAmount = 80;
        }
        this.bar.scale.setTo(this.fuelAmount, 2);
    }  
}
function makeArray(n) {
    return Array(n).fill().map((el,i) => i);
}