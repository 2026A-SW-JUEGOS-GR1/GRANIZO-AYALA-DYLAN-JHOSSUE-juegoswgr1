export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    window.menuSceneCreateCalled = true;
    const title = this.add.text(this.cameras.main.centerX, 100, 'EXAMEN PRÁCTICO: TOP-DOWN', {
      fontSize: '34px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const description =
      'Eres Dylan, un explorador del sistema. Tu misión es recolectar las gemas doradas, escapar del laberinto y llegar a la salida antes de que el tiempo se agote.';

    this.add.text(this.cameras.main.centerX, 180, description, {
      fontSize: '18px',
      fill: '#cccccc',
      align: 'center',
      wordWrap: { width: 760 }
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 300, 'Reglas del examen:', {
      fontSize: '22px',
      fill: '#ffff77',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const rules = [
      '1) Usa las flechas o WASD para mover al personaje en X e Y.',
      '2) Las paredes del mapa bloquean el paso.',
      '3) Recolecta 5 gemas para ganar y evade enemigos móviles.',
      '4) Evita las trampas; pierdes vidas con cada choque.',
      '5) Tienes 90 segundos para completar el objetivo.'
    ];

    this.add.text(this.cameras.main.centerX, 340, rules.join('\n'), {
      fontSize: '18px',
      fill: '#dddddd',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 760 }
    }).setOrigin(0.5, 0);

    const startText = this.add.text(this.cameras.main.centerX, 520, 'Presiona ESPACIO o haz clic para comenzar', {
      fontSize: '22px',
      fill: '#88ff88',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const canvas = this.sys.game.canvas;
    if (canvas) {
      canvas.tabIndex = 0;
      canvas.style.outline = 'none';
      canvas.focus();
      canvas.addEventListener('mousedown', () => canvas.focus());
    }

    this.input.keyboard.on('keydown-SPACE', () => {
      console.log('MenuScene: SPACE pressed');
      this.startGame();
    });

    this.input.keyboard.on('keydown', (event) => {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
        console.log('MenuScene: ENTER pressed');
        this.startGame();
      }
    });

    this.input.on('pointerdown', () => {
      console.log('MenuScene: pointerdown');
      this.startGame();
    });
  }

  startGame() {
    if (this.scene.isActive('GameScene')) {
      return;
    }
    this.scene.start('GameScene');
  }
}
