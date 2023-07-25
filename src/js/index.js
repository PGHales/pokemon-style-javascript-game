const UP_KEY = 'w';
const LEFT_KEY = 'a';
const DOWN_KEY = 's';
const RIGHT_KEY = 'd';
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const CANVAS_OFFSET_X = -2080;
const CANVAS_OFFSET_Y = -860;//-825
//Map is 100 x 74 tiles
const MAP_WIDTH = 100;
const MAP_HEIGHT= 74;
//400% zoom in
const MAP_ZOOM_FACTOR = 4;
//12x12 pixel tiles
const MAP_DIMENSION = 12;
const MAP_TILE_SIZE= MAP_DIMENSION * MAP_ZOOM_FACTOR;
const MOVEMENT_SPEED = 3;
const BOUNDARIES_VISIBLE = true;

const ctx = getCanvasContext();

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

class Sprite {
    constructor({ position, fileName, frames = 1 }) {
        this.position = position;
        this.image = getImage(fileName);
        this.frames = frames;
        this.image.onload = () => {
            this.width = this.image.width / this.frames;
            this.height = this.image.height;
        }
    }
    
    render() {
        ctx.drawImage(
            this.image,
            //Cropping location and width/height
            0,
            0,
            this.image.width / this.frames,
            this.image.height,
            //Actual location and width/height
            this.position.x,
            this.position.y,
            this.image.width / this.frames,
            this.image.height
        );
    }
}

//4 in this constructor represents number of frames
//192x68 image for the player sprite, where 192 is width, 68 is height
const player = new Sprite({
    position: {
        x: CANVAS_WIDTH / 2 - 192 / 4 / 2,
        y: CANVAS_HEIGHT / 2 - 68 / 2
    },
    fileName: 'playerDown.png',
    frames: 4
});

const background = new Sprite({ 
    position: {
        x: CANVAS_OFFSET_X,
        y: CANVAS_OFFSET_Y
    },
    fileName: 'map.png'
});

const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    last: ''
};

const boundaries = getBoundaries();

const movables = [background, ...boundaries];

window.addEventListener('keydown', e => {
    switch (e.key) {
        case UP_KEY:
            keys.up = true;
            keys.last = UP_KEY;
            break;
        case LEFT_KEY:
            keys.left = true;
            keys.last = LEFT_KEY;
            break;
        case DOWN_KEY:
            keys.down = true;
            keys.last = DOWN_KEY;
            break;
        case RIGHT_KEY:
            keys.right = true;
            keys.last = RIGHT_KEY;
            break;
    }
});

window.addEventListener('keyup', e => {
    switch (e.key) {
        case UP_KEY:
            keys.up = false;
            break;
        case LEFT_KEY:
            keys.left = false;
            break;
        case DOWN_KEY:
            keys.down = false;
            break;
        case RIGHT_KEY:
            keys.right = false;
            break;
    }
});

animate();

function getCanvasContext() {
    const canvas = document.querySelector('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return canvas.getContext('2d');
}

function getImage(name) {
    const image = new Image();
    image.src = `../../assets/img/${name}`;
    return image;
}

function getBoundaries() {
    const myBoundaries = [];
    let rowIndex = 0;
    for (let i = 0; i < COLLISIONS.length; i += MAP_WIDTH) {
        const row = COLLISIONS.slice(i, i + MAP_WIDTH);
        row.forEach((value, j) => {
            if (value === COLLISION_VALUE) {
                myBoundaries.push(new Boundary({
                    position: {
                        x: j * MAP_TILE_SIZE + CANVAS_OFFSET_X,
                        y: rowIndex * MAP_TILE_SIZE + CANVAS_OFFSET_Y
                    },
                    visible: true
                }));
            }
        });
        rowIndex++;
    }
    return myBoundaries;
}

function playerBoundaryCollisionDetected(boundary, boundaryXOffset, boundaryYOffset) {
    const boundaryX = boundary.position.x + boundaryXOffset;
    const boundaryY = boundary.position.y + boundaryYOffset;
    return player.position.x + player.width > boundaryX &&
    player.position.x < boundaryX + MAP_TILE_SIZE &&
    player.position.y + player.height > boundaryY &&
    player.position.y + player.height * 0.5 < boundaryY + MAP_TILE_SIZE;
}

function animate() {
    window.requestAnimationFrame(animate);
    background.render();
    boundaries.forEach(b => b.render());
    player.render();
    if (keys.up && keys.last === UP_KEY &&
        !boundaries.some(b => playerBoundaryCollisionDetected(b, 0, MOVEMENT_SPEED))) {
        movables.forEach(m => m.position.y += MOVEMENT_SPEED);
    }
    else if (keys.down && keys.last === DOWN_KEY &&
        !boundaries.some(b => playerBoundaryCollisionDetected(b, 0, -MOVEMENT_SPEED))) {
        movables.forEach(m => m.position.y -= MOVEMENT_SPEED);
    }
    else if (keys.left && keys.last === LEFT_KEY &&
        !boundaries.some(b => playerBoundaryCollisionDetected(b, MOVEMENT_SPEED, 0))) {
        movables.forEach(m => m.position.x += MOVEMENT_SPEED);
    }
    else if (keys.right && keys.last === RIGHT_KEY &&
        !boundaries.some(b => playerBoundaryCollisionDetected(b, -MOVEMENT_SPEED, 0))) {
        movables.forEach(m => m.position.x -= MOVEMENT_SPEED);
    }
}