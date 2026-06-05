export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.won = data.won;
    this.score = data.score || 0;
    this.lives = data.lives || 0;
    this.time = data.time || 0;
  }

  create() {
    const titleText = this.won ? '¡VICTORIA!' : 'DERROTA';
    const titleColor = this.won ? '#88ff88' : '#ff8888';

    this.add.text(this.cameras.main.centerX, 140, titleText, {
      fontSize: '44px',
      fill: titleColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const subtitle = this.won
      ? 'Has recolectado las gemas y escapado del laberinto.'
      : 'No lograste completar el objetivo a tiempo o perdiste todas las vidas.';

    this.add.text(this.cameras.main.centerX, 220, subtitle, {
      fontSize: '20px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 760 }
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 300, `Puntaje: ${this.score}`, {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 340, `Vidas restantes: ${this.lives}`, {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 380, `Tiempo restante: ${this.time}s`, {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 460, 'Presiona ESPACIO para reiniciar', {
      fontSize: '20px',
      fill: '#88ccff'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
