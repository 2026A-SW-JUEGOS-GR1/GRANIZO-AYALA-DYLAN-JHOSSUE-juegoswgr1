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
    const titleText = this.won ? '🏆 ¡VICTORIA! 🏆' : '💀 DERROTA 💀';
    const titleColor = this.won ? '#00ff88' : '#ff6666';
    const titleBg = this.won ? 'rgba(0,128,0,0.5)' : 'rgba(128,0,0,0.5)';

    this.add.text(this.cameras.main.centerX, 100, titleText, {
      fontSize: '52px',
      fill: titleColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      backgroundColor: titleBg,
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    const subtitle = this.won
      ? '✨ ¡Lograste recolectar todas las gemas y escapar del calabozo! ¡Eres un verdadero héroe!'
      : '⚠️ No lograste completar la misión. Ya sea por falta de tiempo o por perder todas tus vidas. ¡Intenta de nuevo!';

    this.add.text(this.cameras.main.centerX, 190, subtitle, {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 760 },
      lineSpacing: 5
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 280, '━━━━━━━━━ ESTADÍSTICAS ━━━━━━━━━', {
      fontSize: '18px',
      fill: '#ffdd00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 330, `💎 Gemas Recolectadas: ${this.score} / 5`, {
      fontSize: '20px',
      fill: '#ffdd00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 370, `❤️ Vidas Restantes: ${Math.max(0, this.lives)} / 3`, {
      fontSize: '20px',
      fill: this.lives > 0 ? '#ff6666' : '#666666',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 410, `⏱️ Tiempo Restante: ${this.time}s / 90s`, {
      fontSize: '20px',
      fill: '#66ddff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 480, '━━━━━━━━━━━━━━━━━━━━━━━━━', {
      fontSize: '16px',
      fill: '#666666'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 540, 'Presiona ESPACIO para reintentar', {
      fontSize: '22px',
      fill: '#88ff88',
      fontStyle: 'bold',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
