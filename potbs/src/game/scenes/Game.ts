import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Simple dark background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Confirmation text that the scene loaded
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Scene', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Required by the Next.js template to notify React the scene is active
        EventBus.emit('current-scene-ready', this);
    }
}