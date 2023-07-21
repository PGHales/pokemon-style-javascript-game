const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, fileName }) {
        this.position = position;
        this.image = getImage(fileName);
    }
    
    render() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

const player = getImage('playerDown.png');

const background = new Sprite({ 
    position: {
        x: -2080,
        y: -825
    },
    fileName: 'map.png'
});

const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    last: ''
}

function animate() {
    window.requestAnimationFrame(animate);
    background.render();
    ctx.drawImage(
        player,
        //Cropping location and width/height
        0,
        0,
        player.width / 4,
        player.height,
        //Actual location and width/height
        canvas.width / 2 - player.width / 8,
        canvas.height / 2 - player.height / 2,
        player.width / 4,
        player.height
    );

    if (keys.up && keys.last === 'w') background.position.y += 3;
    else if (keys.down && keys.last === 's') background.position.y -= 3;
    else if (keys.left && keys.last === 'a') background.position.x += 3;
    else if (keys.right && keys.last === 'd') background.position.x -= 3;
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'w':
            keys.up = true;
            keys.last = 'w';
            break;
        case 'a':
            keys.left = true;
            keys.last = 'a';
            break;
        case 's':
            keys.down = true;
            keys.last = 's';
            break;
        case 'd':
            keys.right = true;
            keys.last = 'd';
            break;
    }
});

window.addEventListener('keyup', e => {
    switch (e.key) {
        case 'w':
            keys.up = false;
            break;
        case 'a':
            keys.left = false;
            break;
        case 's':
            keys.down = false;
            break;
        case 'd':
            keys.right = false;
            break;
    }
});

animate();

function getImage(name) {
    const image = new Image();
    image.src = `../../assets/img/${name}`;
    return image;
}