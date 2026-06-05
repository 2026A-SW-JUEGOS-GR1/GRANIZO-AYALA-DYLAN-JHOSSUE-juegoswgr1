export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Assets de Kenney Tiny Dungeon
    this.load.image('tiles', 'assets/tiles/tilemap.png');
    this.load.tilemapTiledJSON('map', 'assets/map/level1.json');
    
    // Spritesheet del personaje (TinyPackAddOn Sprites-16x16.png)
    // El spritesheet es un grid grande; calcularemos las columnas automáticamente
    this.load.spritesheet('player', 'assets/player/hero_spritesheet.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    // Objetos de juego y obstáculos
    this.load.image('gem', 'assets/objects/gem.png');
    this.load.image('hazard', 'assets/objects/spike.png');
    this.load.image('enemy', 'assets/objects/enemy.png');

    // Audio BGM
    this.load.audio('bgm', 'assets/audio/bgm.mp3');

    // Audio SFX en formato OGG
    this.load.audio('collect', 'assets/audio/collect.ogg');
    this.load.audio('hit', 'assets/audio/hit.ogg');
    this.load.audio('win', 'assets/audio/win.ogg');
    this.load.audio('lose', 'assets/audio/loose.ogg');

    const loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Cargando assets...', {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      loadingText.setText(`Cargando assets... ${Math.round(value * 100)}%`);
    });
  }

  create() {
    window.bootSceneCreateCalled = true;
    // Animaciones direccionales para el personaje principal.
    // El spritesheet de Kenney debe contener filas con animaciones de caminar.
    // Animaciones del personaje (extraídas de la primera fila del spritesheet)
    // Cada personaje ocupa una posición en el grid; usamos los primeros 8 frames
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'idle-down',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: 'idle-left',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: 'idle-right',
      frames: [{ key: 'player', frame: 6 }],
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: 'idle-up',
      frames: [{ key: 'player', frame: 8 }],
      frameRate: 1,
      repeat: -1
    });

    window.launchMenuCalled = true;
    this.scene.manager.start('MenuScene');
    this.scene.manager.stop('BootScene');
  }
}
