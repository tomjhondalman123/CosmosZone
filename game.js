// Initialise Phaser et créer un canvas de 900 x 550
var game = new Phaser.Game(900, 550, Phaser.AUTO, 'cosmos-zone');

// Définition de tous les statuts
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('play', play_state);
game.state.add('endgame', endgame_state);

// On charge le statut load pour charger les assets
game.state.start('load');