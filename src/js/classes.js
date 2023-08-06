class Sprite {
    constructor({ position, fileName, frames = { numFrames: 1, numFramesPerAnimation: 20 }, sprites = null, animate = false }) {
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

    }
    
    render() {
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
        if (!this.animate) {
            this.frames.currentFrame = 0;
            return;
        }
        if (this.frames.numFrames > 1) this.frames.elapsedFrames++;
        if (this.frames.elapsedFrames % this.frames.numFramesPerAnimation === 0) this.frames.currentFrame = (this.frames.currentFrame < this.frames.numFrames - 1) ? this.frames.currentFrame + 1 : 0;
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