// configurar contagem

const span = document.querySelector('span');
let qtd_bolas = 1;

// configurar canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// função para gerar números aleatórios

function random(min, max) {
const num = Math.floor(Math.random() * (max - min + 1)) + min;
return num;
}

class Shape {
    constructor(x, y, velX, velY,  existe) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.existe = existe;
        }
}

class EvilCircle extends Shape {
    constructor(x, y, velX, velY, existe) {
        super(x, y, 20, 20, true);
        this.color = 'white';
        this.size = 10;
    }
}

EvilCircle.prototype.draw = function(){
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checarBordas = function() {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y += this.size;
    }
}

EvilCircle.prototype.setControls = function() {
    var _this = this;
    window.onkeydown = function(e) {
        if (e.keyCode === 37) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 39) {
            _this.x += _this.velX;
        } else if (e.keyCode === 38) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 40) {
            _this.y += _this.velY;
        }
    }
}

EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].existe) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j]['existe'] = false;
                qtd_bolas--;
                this.crescer();
            }
        }
    }
}

EvilCircle.prototype.crescer = function() {
    this.size++;
}

class Ball extends Shape {
    constructor(x, y, velX, velY, existe, color, size) {
        super(x, y, velX, velY, true, color, size);
        this.color = color;
        this.size = size;
    }
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

let balls = [];

let circulo = new EvilCircle(20, 20, 20, 20, true);
circulo.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    while (balls.length < 25) {
        let size = random(10,20);
        let ball = new Ball(
                //  bola sempre será desenhada com pelo menos a largura de uma bola
                // de distancia longe das bordas da tela para evitar erros
            random(0 + size,width - size),
            random(0 + size,height - size),
            random(-7,7),
            random(-7,7),
            true,
            'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
            size
            );
        balls.push(ball);
    }
                                                    
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].existe){
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
        if (qtd_bolas === 0) {
            ganhou = true;
            botao.hidden = false;
            msg.hidden = false;
        }
    }
    circulo.draw();
    circulo.checarBordas();
    circulo.collisionDetect();
    
    span.textContent = qtd_bolas;

    if (ganhou) {
        cancelAnimationFrame(requestAnimationFrame(loop));
    }

    requestAnimationFrame(loop);
}

// pré configurar jogo
let botao = document.querySelector('button');
let msg = document.querySelector('#msg-vencedor');
msg.hidden = true;
let ganhou = false;
ctx.fillStyle = 'rgba(0, 0, 0, 1)';
ctx.fillRect(0, 0, width, height);

function rodarJogo(){

    // configurar jogo
    ganhou = false;
    
    balls = [];
    circulo = new EvilCircle(20, 20, 20, 20, true);
    circulo.setControls();

    qtd_bolas = 25;

    botao.hidden = true;
    msg.hidden = true;

    
    loop();
}

botao.addEventListener("click", rodarJogo);