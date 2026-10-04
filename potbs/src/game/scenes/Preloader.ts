import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        // Dark background matching the game theme
        this.cameras.main.setBackgroundColor('#0f172a');

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Progress bar outline
        this.add.rectangle(centerX, centerY, 468, 32).setStrokeStyle(2, 0xffffff);

        // Progress bar fill (anchored to grow from left to right)
        const bar = this.add.rectangle(centerX - 230, centerY, 4, 24, 0x38bdf8);

        // Update fill bar based on load progress
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (456 * progress);
        });
    }

    preload ()
    {
        // Set the path for your game assets
        this.load.setPath('assets');

        // Add your custom assets to load here (e.g., this.load.image('player', 'player.png');)
    }

    create ()
    {
        // Transition directly to the MainMenu scene once assets are loaded
        this.scene.start('MainMenu');
    }
}