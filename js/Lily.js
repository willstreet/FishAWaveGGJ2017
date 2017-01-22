var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });


function preload(){
	
    game.load.image('waves', 'assets/waves.png')
	game.load.image('player', 'assets/captain.png')
	game.load.image('sky', 'assets/sky1.png');
	game.load.image('hook', 'assets/hook.png');
	
	// added
	game.load.image('fish', 'assets/fish.png');
	game.load.image('menu', 'assets/blackbox.png', 300, 180);
	game.load.image('pirate', 'assets/pirate-red.png');
	
	
}

var NORMAL_SPEED = -5;
var HOFFSET=100;
var waves;
var sky;
var player;
var hook;
var fishline;
var score;
var scoreText;

// added
var fish;
var menu;
var pirate;


function create() {
	
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  sky
    sky = game.add.tileSprite(0, 0, 800, 600,'sky');

    //  waves
    waves = game.add.tileSprite(0, game.world.centerY-50, 800, 300, 'waves');
	console.log(waves);
	game.physics.arcade.enable(waves);
	waves.body.immovable = true;

    // Player
    player = game.add.sprite(100, 50, 'player');

	console.log(player);
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
	player.body.bounce.y = 0.2;
    player.body.gravity.y = 200;
    player.body.collideWorldBounds = true;
	
	// hook 
	hook = game.add.sprite(player.x+HOFFSET,player.y+player.height*2,'hook');
	game.physics.arcade.enable(hook);
	hook.body.gravity.y = 1;
	hook.body.collideWorldBounds = true;
	
	// line
	//  Create a BitmapData just to plot to
	fishline = new Phaser.Line(player.x+HOFFSET, player.y+20, hook.x, hook.y);

    //  The score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    //The fish count
    fishText = game.add.text(16, 32, 'Fish: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();


    //  The first parameter is how long to wait before the event fires. In this case 5 seconds (you could pass in 2000 as the value as well.)
    //  The second parameter is how many times the event will run in total. Here we'll run it 2 times.
    //  The next two parameters are the function to call ('createBall') and the context under which that will happen.

    //  Once the event has been called 2 times it will never be called again.

}



function update() {
	//  Reset the players velocity (movement)
    player.body.velocity.x = 0;
	waves.tilePosition.x += NORMAL_SPEED;
	sky.tilePosition.x+= NORMAL_SPEED;
	updateHook();
	fishline.setTo(player.x+HOFFSET,player.y+20,hook.x,hook.y);
	
	// Collisions
	game.physics.arcade.collide(player, waves);
	

	// Added
	game.physics.arcade.collide(pirate, waves);
	if (cursors.up.isDown && player.body.touching.down)
	{
		player.body.velocity.y = -300;
	}
	game.physics.arcade.overlap(player, fish, collectFish, null, this);
	game.physics.arcade.overlap(player, shark, endGame, null, this);
	game.physics.arcade.overlap(player, pirate, endGame, null, this);

}

function render() {
	
	game.debug.geom(fishline,'black');

}

function updateHook() {
	hook.body.velocity.y = 0;
	if (cursors.down.isDown) {
		hook.body.velocity.y += 150;
	} else {
		if (! (hook.y < (player.y+player.height))){
			hook.body.velocity.y -= 150;
		} else {
			hook.body.velocity.y = 0;
		}
	}
}


// Added
function createFish()
{
	try {
		fish.kill();
	} catch (err){
		
	}
	
	
	fish = game.add.sprite(900, 500, 'fish');
	game.physics.arcade.enable(fish);
	fish.body.velocity.x = -150;
	
}

function createPirate()
{
	pirate = game.add.sprite(900, 100, 'pirate');
	game.physics.arcade.enable(pirate);
	pirate.body.velocity.x = -200;
	game.physics.arcade.collide(pirate, waves);
	pirate.body.gravity.y = 400;
}

function collectFish() {
	
	//todo
}

function endGame() {
	
	game.paused = true;
	var w = game.world.width;
	var h = game.world.height;

	// Then add the menu
	var menu = game.add.sprite(w/2, h/2, 'menu');
	menu.anchor.setTo(0.5, 0.5);
	
	var endMessage = "GAME OVER";
	var endText = game.add.text(game.world.centerX, game.world.centerY, endMessage,{fill: '#fff' });
	endText.anchor.setTo(0.5,0.5);

	// And a label to illustrate which menu item was chosen. (This is not necessary)
	var choiseLabel = game.add.text(game.world.centerX, game.world.centerY + menu.height/2+30, 'Click here to restart', {fill: '#000000' });
	choiseLabel.anchor.setTo(0.5, 0.5);

	
	// Add a input listener that can help us return from being paused
    game.input.onDown.add(restart, self);
	function restart(event){
		location.reload();
	}
	
}
