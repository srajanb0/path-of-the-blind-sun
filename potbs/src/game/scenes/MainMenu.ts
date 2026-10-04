import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Dark background color so you don't need any preloaded images
        this.cameras.main.setBackgroundColor('#0f172a');

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Title
        this.add.text(centerX, centerY - 80, 'My Game', {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Start Game Button
        const startButton = this.add.text(centerX, centerY + 40, 'Start Game', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#38bdf8',
            backgroundColor: '#1e293b',
            padding: { x: 24, y: 12 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Hover feedback
        startButton.on('pointerover', () => {
            startButton.setStyle({ color: '#ffffff', backgroundColor: '#2563eb' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ color: '#38bdf8', backgroundColor: '#1e293b' });
        });

        // Click to start game
        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Required by the Next.js template to notify React the scene is active
        EventBus.emit('current-scene-ready', this);
    }
}