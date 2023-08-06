class Sprite {
    constructor({ position, fileName, frames = { numFrames: 1, numFramesPerAnimation: 20 }, sprites = null, animate = false, isEnemy = false }) {
        this.sprites = sprites === null ? null : {
            up: getImage(sprites.up),
            down: getImage(sprites.down),
            left: getImage(sprites.left),
            right: getImage(sprites.right),
        };
        this.position = position;
        this.image = sprites === null ? getImage(fileName) : this.sprites.down;
        this.frames = {
            ...frames,
            currentFrame: 0,
            elapsedFrames: 0
        };
        this.image.onload = () => {
            this.width = this.image.width / this.frames.numFrames;
            this.height = this.image.height;
        }
        this.animate = animate;
        this.opacity = 1;
        this.totalHealth = 100;
        this.health = this.totalHealth;
        this.isEnemy = isEnemy;
    }
    
    render() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            this.image,
            //Cropping location and width/height
            this.width * this.frames.currentFrame,
            0,
            this.image.width / this.frames.numFrames,
            this.image.height,
            //Actual location and width/height
            this.position.x,
            this.position.y,
            this.image.width / this.frames.numFrames,
            this.image.height
        );
        ctx.restore();
        if (!this.animate) {
            this.frames.currentFrame = 0;
            return;
        }
        if (this.frames.numFrames > 1) this.frames.elapsedFrames++;
        if (this.frames.elapsedFrames % this.frames.numFramesPerAnimation === 0) this.frames.currentFrame = (this.frames.currentFrame < this.frames.numFrames - 1) ? this.frames.currentFrame + 1 : 0;
    }

    attack({attack, recipient}) {
        const timeline = gsap.timeline();
        const movementDistance = this.isEnemy ? 20 : -20;
        this.health = Math.max(this.health - attack.damage, 0);
        timeline.to(this.position, {
            x: this.position.x + movementDistance
        }).to(this.position, {
            x: this.position.x + movementDistance * -2,
            duration: 0.1,
            onComplete: () => {
                gsap.to(this.isEnemy ? "#playerHealthBar" : "#opponentHealthBar", {
                    width: (this.health * 100 / this.totalHealth) + '%'
                })
                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08
                });
                gsap.to(recipient, {
                    opacity: 0,
                    repeat: 5,
                    yoyo: true,
                    duration: 0.08
                });
            }
        }).to(this.position, {
            x: this.position.x
        });
    }
}

class Boundary {
    constructor({ position, visible }) {
        this.position = position;
        this.fillStyle = `rgba(255, 0, 0, ${visible ? '0.4' : '0'})`
    }

    render() {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.position.x, this.position.y, MAP_TILE_SIZE, MAP_TILE_SIZE);
    }
}

class BattleZone {
    constructor({ position, visible }) {
        this.position = position;
        this.fillStyle = `rgba(0, 0, 255, ${visible ? '0.4' : '0'})`
    }

    render() {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.position.x, this.position.y, MAP_TILE_SIZE, MAP_TILE_SIZE);
    }
}