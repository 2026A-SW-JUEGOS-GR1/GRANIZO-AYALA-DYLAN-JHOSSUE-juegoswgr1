export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.timeRemaining = 90;
    this.gameOver = false;
    this.lastDirection = 'down';
    this.hazardCooldown = 0;
    this.enemyCooldown = 0;

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    this.groundLayer = map.createLayer('Ground', tileset, 0, 0);
    this.groundLayer.setScale(1.5);
    this.groundLayer.setCollision(1);

    const objectLayer = map.getObjectLayer('Objects');
    const startPoint = objectLayer.objects.find((obj) => obj.name === 'Start');
    const exitPoint = objectLayer.objects.find((obj) => obj.name === 'Exit');
    const SCALE = 1.5;

    this.player = this.physics.add.sprite((startPoint.x + startPoint.width / 2) * SCALE, (startPoint.y + startPoint.height / 2) * SCALE, 'player', 2);
    this.player.setScale(2.5);
    this.player.setTint(0x00ff00);
    this.player.setSize(12, 14);
    this.player.setOffset(2, 1);
    this.player.body.setCollideWorldBounds(true);

    this.physics.world.bounds.width = map.widthInPixels * SCALE;
    this.physics.world.bounds.height = map.heightInPixels * SCALE;

    const exit = this.add.rectangle((exitPoint.x + exitPoint.width / 2) * SCALE, (exitPoint.y + exitPoint.height / 2) * SCALE, 120, 120, 0x00ff88).setOrigin(0.5);
    exit.setStrokeStyle(4, 0xffffff, 1);
    exit.setAlpha(0.9);
    this.physics.add.existing(exit, true);
    this.exit = exit;
    console.log('Exit created at:', (exitPoint.x + exitPoint.width / 2) * SCALE, (exitPoint.y + exitPoint.height / 2) * SCALE);

    this.physics.add.collider(this.player, this.groundLayer);

    const overlapCollider = this.physics.add.overlap(this.player, exit, this.reachExit, null, this);
    console.log('Overlap with exit registered:', overlapCollider);

    this.gems = this.physics.add.group();
    this.hazards = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();

    objectLayer.objects.forEach((obj) => {
      if (obj.name === 'Gem') {
        const gem = this.gems.create((obj.x + (obj.width || 0) / 2) * SCALE, (obj.y + (obj.height || 0) / 2) * SCALE, 'gem');
        gem.setScale(3);
        gem.setTint(0xffdd00);
        gem.body.setCircle(12);
      }

      if (obj.name === 'Hazard') {
        const hazard = this.hazards.create((obj.x + (obj.width || 0) / 2) * SCALE, (obj.y + (obj.height || 0) / 2) * SCALE, 'hazard');
        hazard.setScale(2.0);
        hazard.setTint(0xff00ff);
        hazard.refreshBody();
      }

      if (obj.name === 'Enemy') {
        const enemy = this.enemies.create((obj.x + (obj.width || 0) / 2) * SCALE, (obj.y + (obj.height || 0) / 2) * SCALE, 'enemy');
        enemy.setScale(2.2);
        enemy.setTint(0xff4444);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1, 1);
        enemy.body.setSize(obj.width || 28, obj.height || 28);

        const patrolProp = obj.properties ? obj.properties.find((p) => p.name === 'patrol') : null;
        const speedProp = obj.properties ? obj.properties.find((p) => p.name === 'speed') : null;
        const speed = speedProp ? speedProp.value : 80;
        const patrolDirection = patrolProp ? patrolProp.value : 'horizontal';

        if (patrolDirection === 'vertical') {
          enemy.setVelocity(0, speed * SCALE);
        } else {
          enemy.setVelocity(speed * SCALE, 0);
        }
      }
    });

    this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);
    this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
    this.physics.add.collider(this.enemies, this.groundLayer);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels * SCALE, map.heightInPixels * SCALE);

    this.hudScore = this.add.text(16, 16, '💎 Puntaje: 0', {
      fontSize: '22px',
      fill: '#ffdd00',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 12, y: 8 },
      fontStyle: 'bold'
    }).setScrollFactor(0);

    this.hudLives = this.add.text(16, 50, '❤️ Vidas: 3', {
      fontSize: '22px',
      fill: '#ff6666',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 12, y: 8 },
      fontStyle: 'bold'
    }).setScrollFactor(0);

    this.hudTime = this.add.text(16, 84, '⏱️ Tiempo: 90', {
      fontSize: '22px',
      fill: '#66ddff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 12, y: 8 },
      fontStyle: 'bold'
    }).setScrollFactor(0);

    this.destinationText = this.add.text(16, 125, '✨ Recolecta gemas y dirígete a la salida verde', {
      fontSize: '16px',
      fill: '#88ff88',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 12, y: 8 },
      fontStyle: 'italic'
    }).setScrollFactor(0);

    const bgmKey = 'bgm';
    if (this.cache.audio.exists(bgmKey)) {
      this.bgm = this.sound.add(bgmKey, { volume: 0.3, loop: true });
      this.bgm.play();
    } else {
      this.bgm = null;
    }

    this.sfxCollect = this.sound.add('collect', { volume: 0.7 });
    this.sfxHit = this.sound.add('hit', { volume: 0.8 });
    this.sfxWin = this.sound.add('win', { volume: 0.8 });
    this.sfxLose = this.sound.add('lose', { volume: 0.8 });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');

    this.input.keyboard.on('keydown-V', () => {
      console.log('V pressed - testing victory screen');
      this.testVictory();
    });

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true
    });
  }

  collectGem(player, gem) {
    gem.destroy();
    this.score += 1;
    this.sfxCollect.play();
    this.updateHUD();

    if (this.score >= 5) {
      this.destinationText.setText('🎉 ¡EXCELENTE! ¡YA PUEDES ESCAPAR! Ve hacia la salida verde →');
      this.destinationText.setFill('#ff00ff');
    }
  }

  hitHazard(player, hazard) {
    if (this.gameOver || this.hazardCooldown > 0) {
      return;
    }

    this.hazardCooldown = 30;
    this.lives -= 1;
    this.sfxHit.play();
    this.updateHUD();
    this.player.setTint(0xff0000);

    this.time.delayedCall(200, () => {
      this.player.clearTint();
    });

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  hitEnemy(player, enemy) {
    if (this.gameOver || this.enemyCooldown > 0) {
      return;
    }

    this.enemyCooldown = 30;
    this.lives -= 1;
    this.sfxHit.play();
    this.updateHUD();
    this.player.setTint(0xff0000);

    this.player.body.velocity.x *= -0.3;
    this.player.body.velocity.y *= -0.3;

    this.time.delayedCall(200, () => {
      this.player.clearTint();
    });

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  reachExit() {
    console.log('reachExit called - Score:', this.score, 'GameOver:', this.gameOver);
    if (this.score < 5) {
      console.log('No enough gems. Need 5, have:', this.score);
      return;
    }
    console.log('Victory condition met!');
    this.endGame(true);
  }

  testVictory() {
    console.log('testVictory called - forcing victory screen');
    this.endGame(true);
  }

  endGame(won) {
    console.log('endGame called with won:', won);
    if (this.gameOver) {
      console.log('Game already over, returning');
      return;
    }

    this.gameOver = true;
    if (this.bgm) {
      this.bgm.stop();
    }
    this.timerEvent.remove(false);

    const data = {
      won,
      score: this.score,
      lives: this.lives,
      time: this.timeRemaining
    };

    if (won) {
      console.log('Playing win sound');
      this.sfxWin.play();
    } else {
      console.log('Playing lose sound');
      this.sfxLose.play();
    }

    console.log('Starting GameOverScene with data:', data);
    this.scene.start('GameOverScene', data);
  }

  onTimerTick() {
    this.timeRemaining -= 1;
    this.updateHUD();

    if (this.timeRemaining <= 0) {
      this.endGame(false);
    }
  }

  updateHUD() {
    this.hudScore.setText(`Puntaje: ${this.score}`);
    this.hudLives.setText(`Vidas: ${this.lives}`);
    this.hudTime.setText(`Tiempo: ${this.timeRemaining}`);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.hazardCooldown > 0) {
      this.hazardCooldown--;
    }
    if (this.enemyCooldown > 0) {
      this.enemyCooldown--;
    }

    const speed = 140;
    const direction = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown || this.keys.A.isDown) {
      direction.x = -1;
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      direction.x = 1;
    }

    if (this.cursors.up.isDown || this.keys.W.isDown) {
      direction.y = -1;
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      direction.y = 1;
    }

    direction.normalize();
    this.player.body.setVelocity(direction.x * speed, direction.y * speed);

    if (direction.x !== 0 || direction.y !== 0) {
      if (Math.abs(direction.x) > Math.abs(direction.y)) {
        if (direction.x < 0) {
          this.player.play('walk-left', true);
          this.lastDirection = 'left';
        } else {
          this.player.play('walk-right', true);
          this.lastDirection = 'right';
        }
      } else {
        if (direction.y < 0) {
          this.player.play('walk-up', true);
          this.lastDirection = 'up';
        } else {
          this.player.play('walk-down', true);
          this.lastDirection = 'down';
        }
      }
    } else {
      this.player.body.setVelocity(0, 0);
      this.player.play(`idle-${this.lastDirection}`, true);
    }
  }
}
