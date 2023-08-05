class Sprite {
    constructor({ position, fileName, numFrames = 1, sprites = null }) {
        this.sprites = sprites === null ? null : {
            up: getImage(sprites.up),
            down: getImage(sprites.down),
            left: getImage(sprites.left),
            right: getImage(sprites.right),
        };
        this.position = position;
        this.image = sprites === null ? getImage(fileName) : this.sprites.down;
        this.numFrames = numFrames;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.image.onload = () => {
            this.width = this.image.width / this.numFrames;
            this.height = this.image.height;
        }
        this.moving = false;
    }
    
    render() {
        ctx.drawImage(
            this.image,
            //Cropping location and width/height
            this.width * this.currentFrame,
            0,
            this.image.width / this.numFrames,
            this.image.height,
            //Actual location and width/height
            this.position.x,
            this.position.y,
            this.image.width / this.numFrames,
            this.image.height
        );
        if (!this.moving) {
            this.currentFrame = 0;
            return;
        }
        if (this.numFrames > 1) this.elapsedFrames++;
        if (this.elapsedFrames % 20 === 0) this.currentFrame = (this.currentFrame < this.numFrames - 1) ? this.currentFrame + 1 : 0;
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