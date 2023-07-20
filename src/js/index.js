const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const map = new Image();
map.src = '../../assets/img/map.png';
map.onload = () => ctx.drawImage(map, -2100, -750);