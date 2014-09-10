var endgame_state = {
    create: function() {
        // Ajout du background
        this.stars = game.add.tileSprite(0, 0, 900, 550, 'bgmenu');
        game.stage.backgroundColor = "#572788";


        // On defini le style du texte
        var style = { font: "30px Arial", fill: "#ffffff" };
        var x = game.world.width/2, y = game.world.height/2;

        var button = game.add.button(x - 166, 240, 'buttonreplay', this.start, this, 2, 1, 0);
        var buttonmenu = game.add.button(x - 166, 350, 'buttonmenu', this.menu, this, 2, 1, 0);


        //Afficher le score
        var graphics = game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xd97c29, 1);
        graphics.drawCircle(x, y -100 ,70);
        var score_label = this.game.add.text(x, y-100, score, style);
        score_label.anchor.setTo(0.5, 0.5);
    },

    // Start the actual game
    start: function() {
        this.game.state.start('play');
    },

    // Retour au menu
    menu: function() {
        this.game.state.start('menu');
    }
};