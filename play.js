var play_state = {
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE); // Démarrage du système

        // Ajout des assets graphiques
        this.mountainsbg = game.add.tileSprite(0, 350, 900, 200, 'mountainsbg');
        this.mountains = game.add.tileSprite(0, 350, 900, 200, 'mountains');
        this.planets = game.add.tileSprite(0, 0, 900, 200, 'planets');
        this.stars = game.add.tileSprite(0, 0, 900, 500, 'stars');
        this.rocket = this.game.add.sprite(50, 250, 'rocket');

        // Ajout de l'animation de la fusée
        this.rocket.animations.add('fire');
        this.rocket.animations.play('fire', 15, true);

        this.rocket.anchor.setTo(-0.2, 0.5); // Mettre le centre de gravité au milieu de la fusée
        game.physics.arcade.enable(this.rocket); // Ajout de la fusée et attributs physiques (colision)

        cursors = game.input.keyboard.createCursorKeys(); // Contient les touches du clavier

        this.asteroids = game.add.group(); // Création d'un groupe
        this.asteroids.enableBody = true;  // Ajouter la physique au groupe
        this.asteroids.createMultiple(50, 'asteroid'); // Création de 50 asteroids

        rapidityCoef = 1; // Coeficient de rapidité
        loopTime = 600; // Interval de nouveaux asteroids
        this.timer = game.time.events.loop(loopTime, this.addRowOfAsteroids, this); //Interval de nouveaux asteroids
        this.timerPts = game.time.events.loop(100, this.addPoints, this); // Interval de points

        alpha = 1; // Opacité de la fusée

        score = 0; // Initialisation des points
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });


        //vies
        lives = game.add.group();
        // Ajout des vues en haut à droite
        for (var i = 0; i < 3; i++)
        {
            var rocket = lives.create(820 + (30 * i), 20, 'life');
            rocket.anchor.setTo(0.5, 0.5);
        }

        //ajout des explosions
        animExplo = false; // Animation d'explosion
        this.explosions = game.add.group(); // Ajout du group des explosions
        this.explosions.createMultiple(30, 'rocket2'); // Création de multiples explosions

        this.gameoverSong = game.add.audio('gameover'); // Ajout du son game over
        this.ambient = game.add.audio('ambient'); //Son d'ambiance
        this.ambient.play();

        // Taille du monde en hauteur (décor du bas)
        game.world.height = 480;
    },

    update: function() {
        var maxRapidityCoef = (rapidityCoef > 2.5) ? 2.5 : rapidityCoef; // Coef max

        // Déplacement des backgrounds
        this.mountains.tilePosition.x -= 2 * rapidityCoef;
        this.stars.tilePosition.x -= 5 * maxRapidityCoef;
        this.mountainsbg.tilePosition.x -= 0.2 * rapidityCoef;
        this.planets.tilePosition.x -= 0.09 * rapidityCoef;

        // Augmentation de la vitesse du jeu au fur et à mesure
        if((rapidityCoef + 0.001).toString()[0] !=  rapidityCoef.toString()[0]){
            loopTime -= 50;
            if(loopTime >= 50)
                this.timer.delay = loopTime;
        }
        // Incrementation du coefficient de rapidité
        rapidityCoef += 0.001;


        this.rocket.body.velocity.setTo(0, 0); // Remise à zero de la vélocité de la fusée

        this.rocket.angle = 0; // Remise à zero de l'angle de la rocket.

        // Lorsqu'on appuie sur la touche haut
        if (cursors.up.isDown){
            this.rocket.body.velocity.y = -500;
            this.rocket.angle -= 10;
        }
        // Lorsqu'on appuie sur la touche bas
        else if (cursors.down.isDown){
            this.rocket.body.velocity.y = 500;
            this.rocket.angle += 10;

        }
        // Lorsqu'on appuie sur la touche droite
        else if(cursors.right.isDown){
            this.rocket.body.velocity.x = 500;
        }
        // Lorsqu'on appuie sur la touche gauche
        else if(cursors.left.isDown) {
            this.rocket.body.velocity.x = -500;
        }

        // Si la fusée sort du décor
        if (this.rocket.inWorld == false)
            this.checkGameOver();

        game.physics.arcade.overlap(this.rocket, this.asteroids, this.checkGameOver, null, this); // En cas de choc avec un asteroid

        // rotation des asteroids
        for(var i = 0; i < this.asteroids.children.length ; i++){
            this.asteroids.children[i].angle -= 1;
        }

        // Fin de l'explosion -> réaparition de la fusée
        if(animExplo && animRef.isFinished){
            animExplo = false;
            this.rocket.alpha = 1;
        }

    },

    addOneAsteroid: function(x, y) {
        var asteroid = this.asteroids.getFirstDead(); // Le premier asteroid mort

        asteroid.reset(x, y); // Nouvelle position de l'asteroid

        // Ajout de la velocité du nouvel asteroid pour le faire se déplacer
        asteroid.body.velocity.x = -200;

        // Centre de gravité de l'asteroid pour la rotation
        asteroid.anchor.setTo(0.5, 0.5);

        // Suppresion de l'asteroid quand il est en dehors du décor
        asteroid.checkWorldBounds = true;
        asteroid.outOfBoundsKill = true;
    },

    addRowOfAsteroids: function() {
        // Rand sur la position x de l'asteroid
        var asteroid = Math.floor(Math.random() * 10);

        // Ajout de 8 asteroids
        for (var i = 0; i < 8; i++)
            if (i == asteroid)
                this.addOneAsteroid(900, i * 65);
    },

    addPoints: function(){
        score += 1; // On incremente score
        this.labelScore.text = score;
    },

    checkGameOver: function(rocket, asteroid){
        if(asteroid)
            asteroid.kill(); // Supprimer l'asteroid percuté

        live = lives.getFirstAlive(); // Get la premiere vie

        if (live)
            live.kill(); // on supprime une vie
        else
            this.gameOver(); // fin du jeu

        if(this.rocket.inWorld == false){
            // On remet la fusée dans le canvas
            this.rocket.x = 50;
            this.rocket.y = 200;
            animAlpha = 4; // Nombre de fois ou l'animation de clignotement apparait
            this.timeRocket = game.time.events.loop(150, this.blinkRocket, this); // Clignotement
        }

        if(asteroid){
            //explosion
            animExplo = true;

            this.rocket.alpha = 0; // On cache la fusée le temps de l'animation
            explosion = this.explosions.getFirstExists(false);
            explosion.reset(rocket.body.x, rocket.body.y); //on met l'animation au niveau de la fusée
            explosion.animations.add('explose');
            animRef = explosion.animations.play('explose',20,false, true); // Lancement de l'animation
        }
    },

    blinkRocket: function(){
        if(animAlpha > 0){
            alpha = (alpha == 1) ? 0.3 : 1; // Si alpha 1 -> 0.3 sinon 1
            this.rocket.alpha = alpha;
            animAlpha--;
        }
        else{
            game.time.events.remove(this.timeRocket); // On arrete l'interval
            alpha = 1;
            animAlpha = 4;
        }

    },

    gameOver: function(){
        // Si la fusée est déjà morte
        if (this.rocket.alive == false)
            return;

        // Changement de status de la fusée (mort)
        this.rocket.alive = false;

        // Stop l'interval des points
        game.time.events.remove(this.timerPts);

        this.gameoverSong.play();
        // Chargement du menu de fin de partie
        this.game.state.start('endgame');
    }
}