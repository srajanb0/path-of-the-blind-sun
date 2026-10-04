import { AUTO, Game } from 'phaser';
import { MainMenu } from './scenes/MainMenu';
import { Game as MainGame } from './scenes/Game';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#0f172a',
    scene: [
        MainMenu,
        MainGame
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;