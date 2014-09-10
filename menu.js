var menu_state = {
    create: function() {
        // Ajout du background
        this.stars = game.add.tileSprite(0, 0, 900, 550, 'bgmenu');
        game.stage.backgroundColor = "#572788";

        // Ajout des 2 boutons
        var button = game.add.button(95, 160, 'buttonplay', this.start, this, 2, 1, 0);
        var buttoncredits = game.add.button(95, 270, 'buttoncredits', this.start, this, 2, 1, 0);

    },

    // Lancer le jeu
    start: function() {
        this.game.state.start('play');
    }
};