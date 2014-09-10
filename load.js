var load_state = {
    preload: function() {
        // Chargement des différents assets du jeu
        game.stage.backgroundColor = '#50298c';
        game.load.spritesheet('rocket', 'assets/rocket.png', 100, 50, 2);
        game.load.spritesheet('rocket2', 'assets/rocket2.png', 100, 50);
        game.load.image('asteroid', 'assets/asteroid.png');
        game.load.audio('gameover', 'assets/songs/gameover.wav');
        game.load.audio('ambient', 'assets/songs/cosmos.mp3');
        game.load.image('mountains', 'assets/mountains.png');
        game.load.image('bgmenu', 'assets/bgmenu.png');
        game.load.image('buttonplay', 'assets/buttonplay.png');
        game.load.image('buttonsettings', 'assets/buttonsettings.png');
        game.load.image('buttoncredits', 'assets/buttoncredits.png');
        game.load.image('buttonreplay', 'assets/buttonreplay.png');
        game.load.image('buttonmenu', 'assets/buttonmenu.png');
        game.load.image('stars', 'assets/stars.png');
        game.load.image('mountainsbg', 'assets/mountains-bg.png');
        game.load.image('planets', 'assets/planets.png');
        game.load.image('life', 'assets/life.png');
    },

    create: function(){
        // Une fois tout chargé, on lance le menu
        this.game.state.start('menu');
    }
}