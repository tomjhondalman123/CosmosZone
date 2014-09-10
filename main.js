// Initialise Phaser et créer un canvas de 900 x 550
var game = new Phaser.Game(900, 550, Phaser.AUTO, 'cosmos-zone');

// On créer le main qui contiendra notre jeu
var mainState = {



    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.rocket = this.game.add.sprite(50, 250, 'bird');

        // mettre le centre de gravité au milieu de la fusée
        this.rocket.anchor.setTo(-0.2, 0.5);
        game.physics.arcade.enable(this.rocket);

        cursors = game.input.keyboard.createCursorKeys();

        this.pipes = game.add.group(); // Create a group
        this.pipes.enableBody = true;  // Add physics to the group
        this.pipes.createMultiple(50, 'pipe'); // Create 20 pipes

        this.timer = game.time.events.loop(600, this.addRowOfPipes, this);
        this.timerPts = game.time.events.loop(100, this.addPoints, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        this.gameoverSong = game.add.audio('gameover');
        this.ambient = game.add.audio('ambient');
        //this.ambient.play();
    },

    update: function() {

        this.rocket.body.velocity.setTo(0, 0);
        this.rocket.angle = 0;
        if (cursors.up.isDown){
            this.rocket.body.velocity.y = -500;
            this.rocket.angle -= 10;
        }
        else if (cursors.down.isDown){
            this.rocket.body.velocity.y = 500;
            this.rocket.angle += 10;

        }
        else if(cursors.right.isDown){
            this.rocket.body.velocity.x = 500;
        }
        else if(cursors.left.isDown) {
            this.rocket.body.velocity.x = -500;
        }


        if (this.rocket.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.rocket, this.pipes, this.hitAsteroid, null, this);
    },
    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        // Pick where the hole will be
        var asteroid = Math.floor(Math.random() * 10);

        // Add the 8 pipes
        for (var i = 0; i < 8; i++)
            if (i == asteroid)
                this.addOnePipe(900, i * 75);

    },

    addPoints: function(){
        this.score += 1;
        this.labelScore.text = this.score;
    },

    hitAsteroid: function(){
        if (this.rocket.alive == false)
            return;

        this.rocket.alive = false;
        this.gameOver();

        // Stop l'interval des points
        game.time.events.remove(this.timerPts);
    },

    gameOver: function(){
        this.gameoverSong.play();
        this.gameOverTxt = game.add.text(100, 100, "0", { font: "30px Arial", fill: "#ffffff" });
        this.gameOverTxt.text = "Game Over ! Try again";
    }
};

// On lance le main et le jeu
game.state.add('main', mainState);
game.state.start('main');