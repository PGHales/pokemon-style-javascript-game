const ctx = getCanvasContext();

//4 in this constructor represents number of frames
//192x68 image for the player sprite, where 192 is width, 68 is height
const player = new Sprite({
    position: {
        x: CANVAS_WIDTH / 2 - 192 / 4 / 2,
        y: CANVAS_HEIGHT / 2 - 68 / 2
    },
    frames: {
        numFrames: 4,
        numFramesPerAnimation: 20
    },
    sprites: {
        up: 'playerUp.png',
        down: 'playerDown.png',
        left: 'playerLeft.png',
        right: 'playerRight.png'
    }
});

const background = new Sprite({ 
    position: {
        x: CANVAS_OFFSET_X,
        y: CANVAS_OFFSET_Y
    },
    fileName: 'map.png'
});

const foreground = new Sprite({ 
    position: {
        x: CANVAS_OFFSET_X,
        y: CANVAS_OFFSET_Y
    },
    fileName: 'foreground.png'
});

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    fileName: 'battleBackground.png'
});

const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    fileName: 'draggleSprite.png',
    frames: {
        numFrames: 4,
        numFramesPerAnimation: 60
    },
    animate: true
});

const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    fileName: 'embySprite.png',
    frames: {
        numFrames: 4,
        numFramesPerAnimation: 60
    },
    animate: true
});

const battle = {
    initiated: false
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    last: ''
};

const boundaries = getBoundaries();
const battleZones = getBattlezones();
const movables = [background, foreground, ...boundaries, ...battleZones];

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

//animate();
animateBattle();

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
    return parseJsonArrayDataIntoObjects(COLLISIONS, COLLISION_VALUE, (rowIndex, columnIndex) => new Boundary({
        position: {
            x: columnIndex * MAP_TILE_SIZE + CANVAS_OFFSET_X,
            y: rowIndex * MAP_TILE_SIZE + CANVAS_OFFSET_Y
        },
        visible: BOUNDARIES_VISIBLE
    }));
}

function getBattlezones() {
    return parseJsonArrayDataIntoObjects(BATTLEZONES, BATTLEZONE_VALUE, (rowIndex, columnIndex) => new BattleZone({
        position: {
            x: columnIndex * MAP_TILE_SIZE + CANVAS_OFFSET_X,
            y: rowIndex * MAP_TILE_SIZE + CANVAS_OFFSET_Y
        },
        visible: BATTLEZONES_VISIBLE
    }));
}

function parseJsonArrayDataIntoObjects(jsonArray, jsonValue, valueToObjectMapFunction) {
    const objectArray = [];
    let rowIndex = 0;
    for (let i = 0; i < jsonArray.length; i += MAP_WIDTH) {
        const row = jsonArray.slice(i, i + MAP_WIDTH);
        row.forEach((value, columnIndex) => {
            if (value === jsonValue) {
                objectArray.push(valueToObjectMapFunction(rowIndex, columnIndex));
            }
        });
        rowIndex++;
    }
    return objectArray;
}

function playerBoundaryCollisionDetected(boundary, boundaryXOffset, boundaryYOffset) {
    const boundaryX = boundary.position.x + boundaryXOffset;
    const boundaryY = boundary.position.y + boundaryYOffset;
    return player.position.x + player.width > boundaryX &&
    player.position.x < boundaryX + MAP_TILE_SIZE &&
    player.position.y + player.height > boundaryY &&
    player.position.y + player.height * 0.5 < boundaryY + MAP_TILE_SIZE;
}

function getPlayerBoundaryOverlappingArea(boundary) {
    return (Math.min(player.position.x + player.width, boundary.position.x + boundary.width) - Math.max(player.position.x, boundary.position.x)) *
        (Math.min(player.position.y + player.height, boundary.position.y + boundary.height) - Math.max(player.position.y, boundary.position.y));
}

function animate() {
    //Start animation loop
    const animationId = window.requestAnimationFrame(animate);
    background.render();
    boundaries.forEach(b => b.render());
    battleZones.forEach(b => b.render());
    player.render();
    foreground.render();

    player.animate = false;

    if (battle.initiated) return;

    if ((keys.up || keys.down || keys.left || keys.right) && battleZones.some(b => playerBoundaryCollisionDetected(b, 0, 0)) && Math.random() < BATTLE_CHANCE) {
        //Stop current animation loop
        window.cancelAnimationFrame(animationId);
        battle.initiated = true;
        gsap.to("#battleBackground", {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete() {
                gsap.to('#battleBackground', {
                    opacity: 1,
                    duration: 0.4,
                    oncComplete() {
                        //Start battle animation loop
                        animateBattle();
                        gsap.to('#battleBackground', {
                            opacity: 0,
                            duration: 0.4
                        });
                    }
                });
            }
        });
    }

    if (keys.up && keys.last === UP_KEY && !boundaries.some(b => playerBoundaryCollisionDetected(b, 0, MOVEMENT_SPEED))) {
        movables.forEach(m => m.position.y += MOVEMENT_SPEED);
        player.animate = true;
        player.image = player.sprites.up;
    }
    else if (keys.down && keys.last === DOWN_KEY && !boundaries.some(b => playerBoundaryCollisionDetected(b, 0, -MOVEMENT_SPEED))) {
        movables.forEach(m => m.position.y -= MOVEMENT_SPEED);
        player.animate = true;
        player.image = player.sprites.down;
    }
    else if (keys.left && keys.last === LEFT_KEY && !boundaries.some(b => playerBoundaryCollisionDetected(b, MOVEMENT_SPEED, 0))) {
        movables.forEach(m => m.position.x += MOVEMENT_SPEED);
        player.animate = true;
        player.image = player.sprites.left;
    }
    else if (keys.right && keys.last === RIGHT_KEY && !boundaries.some(b => playerBoundaryCollisionDetected(b, -MOVEMENT_SPEED, 0))) {
        movables.forEach(m => m.position.x -= MOVEMENT_SPEED);
        player.animate = true;
        player.image = player.sprites.right;
    }
}

function animateBattle() {
    //Start animation loop
    window.requestAnimationFrame(animateBattle);
    battleBackground.render();
    draggle.render();
    emby.render();
}