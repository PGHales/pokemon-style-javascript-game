const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const map = getImage('map.png');
const player = getImage('playerDown.png');
map.onload = () => {
    ctx.drawImage(map, -2080, -825);
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
}

function getImage(name) {
    const image = new Image();
    image.src = `../../assets/img/${name}`;
    return image;
}