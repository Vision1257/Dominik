const CONFIG = {
    TILE_SIZE: 20,
    GAME_SPEED: 90,
    INITIAL_SNAKE: [{ x: 5, y: 5 }, { x: 6, y: 5 }],
    INITIAL_APPLES: 5,
    COLORS: {
        background: "#f4f9ff",
        grid: "#d3e5f7",
        snakeHead: "#1b4f9c",
        snakeBody: "#5aa0e6",
        apple: "#e03131"
    }
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start-btn");
const demoBtn = document.getElementById("demo-start-btn");
const pauseBtn = document.getElementById("pause-btn");
const menuBtn = document.getElementById("menu-btn");
const scoreDisplay = document.getElementById("score");
const modeDisplay = document.getElementById("mode");

const GRID_WIDTH = Math.floor(canvas.width / CONFIG.TILE_SIZE);
const GRID_HEIGHT = Math.floor(canvas.height / CONFIG.TILE_SIZE);

const DIRECTIONS = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
];

let snake = [];
let apples = [];
let dirX = 0, dirY = 0;
let nextX = 0, nextY = 0;
let score = 0;
let mode = "player";
let isRunning = false;
let isPaused = false;
let lastTime = 0;
let animationFrameId;

/* ---------- Overlay ---------- */

function showOverlay(title, text, { startLabel, showDemo = true }) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    startBtn.textContent = startLabel;
    demoBtn.classList.toggle("hidden", !showDemo);
    overlay.classList.remove("hidden");
}

function showMenu() {
    cancelAnimationFrame(animationFrameId);
    isRunning = false;
    isPaused = false;
    pauseBtn.textContent = "⏸ Pause";
    showOverlay("Snake", "Winter Edition", { startLabel: "Spiel Starten" });
}

/* ---------- Steuerung ---------- */

function setDirection(x, y) {
    if (x === -dirX && y === -dirY && snake.length > 1) return;
    nextX = x;
    nextY = y;
}

const KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
};

document.addEventListener("keydown", event => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (KEYS[key] || event.code === "Space") event.preventDefault();

    if (KEYS[key] && mode === "player" && isRunning && !isPaused) {
        setDirection(...KEYS[key]);
    }
    if (event.code === "Space") togglePause();
    if (event.key === "Escape" && isRunning) showMenu();
});

function togglePause() {
    if (!isRunning) return;
    isPaused = !isPaused;

    if (isPaused) {
        cancelAnimationFrame(animationFrameId);
        pauseBtn.textContent = "▶ Weiter";
        showOverlay("Pause", "Spiel angehalten", { startLabel: "Weiter spielen", showDemo: false });
    } else {
        overlay.classList.add("hidden");
        pauseBtn.textContent = "⏸ Pause";
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

/* ---------- Spiellogik ---------- */

function createApple() {
    const free = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const taken = snake.some(s => s.x === x && s.y === y) ||
                          apples.some(a => a.x === x && a.y === y);
            if (!taken) free.push({ x, y });
        }
    }
    return free.length ? free[Math.floor(Math.random() * free.length)] : null;
}

function initApples() {
    apples = [];
    for (let i = 0; i < CONFIG.INITIAL_APPLES; i++) {
        const apple = createApple();
        if (apple) apples.push(apple);
    }
}

function checkCollision(head, eating) {
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) return true;
    const body = eating ? snake : snake.slice(0, -1);
    return body.some(s => s.x === head.x && s.y === head.y);
}

function move() {
    dirX = nextX;
    dirY = nextY;
    if (dirX === 0 && dirY === 0) return;

    const newHead = { x: snake[0].x + dirX, y: snake[0].y + dirY };
    const appleIndex = apples.findIndex(a => a.x === newHead.x && a.y === newHead.y);
    const eating = appleIndex !== -1;

    if (checkCollision(newHead, eating)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    if (eating) {
        score += 10;
        apples.splice(appleIndex, 1);
        const apple = createApple();
        if (apple) apples.push(apple);
    } else {
        snake.pop();
    }

    if (snake.length >= GRID_WIDTH * GRID_HEIGHT) gameOver();
}

function gameOver() {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    render();
    showOverlay("Game Over!", "Deine Punkte: " + score, { startLabel: "Nochmal spielen" });
}

/* ---------- Demo-Autopilot (BFS zum nächsten Apfel) ---------- */

function inBounds(p) {
    return p.x >= 0 && p.x < GRID_WIDTH && p.y >= 0 && p.y < GRID_HEIGHT;
}

// Kürzester Weg zum nächsten Apfel; gibt die erste Richtung zurück
function findPathDirection(blocked) {
    const head = snake[0];
    const appleKeys = new Set(apples.map(a => `${a.x},${a.y}`));
    const visited = new Set([`${head.x},${head.y}`]);
    const queue = [];

    for (const d of DIRECTIONS) {
        const p = { x: head.x + d.x, y: head.y + d.y, first: d };
        const key = `${p.x},${p.y}`;
        if (inBounds(p) && !blocked.has(key) && !(d.x === -dirX && d.y === -dirY)) {
            visited.add(key);
            queue.push(p);
        }
    }

    while (queue.length) {
        const cur = queue.shift();
        if (appleKeys.has(`${cur.x},${cur.y}`)) return cur.first;
        for (const d of DIRECTIONS) {
            const p = { x: cur.x + d.x, y: cur.y + d.y, first: cur.first };
            const key = `${p.x},${p.y}`;
            if (inBounds(p) && !visited.has(key) && !blocked.has(key)) {
                visited.add(key);
                queue.push(p);
            }
        }
    }
    return null;
}

// Wie viele freie Felder sind von dieser Position aus erreichbar?
function reachableArea(start, blocked) {
    const visited = new Set([`${start.x},${start.y}`]);
    const stack = [start];
    while (stack.length) {
        const cur = stack.pop();
        for (const d of DIRECTIONS) {
            const p = { x: cur.x + d.x, y: cur.y + d.y };
            const key = `${p.x},${p.y}`;
            if (inBounds(p) && !visited.has(key) && !blocked.has(key)) {
                visited.add(key);
                stack.push(p);
            }
        }
    }
    return visited.size;
}

function autoPilot() {
    if (!apples.length) return;

    // Schwanzspitze wird frei, wenn die Schlange nicht frisst
    const blocked = new Set(snake.slice(0, -1).map(s => `${s.x},${s.y}`));
    const head = snake[0];

    const safe = DIRECTIONS.filter(d => {
        if (d.x === -dirX && d.y === -dirY) return false;
        const next = { x: head.x + d.x, y: head.y + d.y };
        return inBounds(next) && !blocked.has(`${next.x},${next.y}`);
    });
    if (!safe.length) return;

    // 1. Weg zum Apfel, falls danach noch genug Platz bleibt
    const toApple = findPathDirection(blocked);
    if (toApple) {
        const next = { x: head.x + toApple.x, y: head.y + toApple.y };
        const area = reachableArea(next, new Set([...blocked, `${head.x},${head.y}`]));
        if (area > snake.length) {
            nextX = toApple.x;
            nextY = toApple.y;
            return;
        }
    }

    // 2. Sonst: Richtung mit dem meisten Freiraum
    let best = safe[0], bestArea = -1;
    for (const d of safe) {
        const next = { x: head.x + d.x, y: head.y + d.y };
        const area = reachableArea(next, new Set([...blocked, `${head.x},${head.y}`]));
        if (area > bestArea) { bestArea = area; best = d; }
    }
    nextX = best.x;
    nextY = best.y;
}

/* ---------- Zeichnen ---------- */

function drawBackground() {
    const size = CONFIG.TILE_SIZE;
    ctx.fillStyle = CONFIG.COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = CONFIG.COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSnake() {
    const size = CONFIG.TILE_SIZE;
    snake.forEach((segment, i) => {
        ctx.fillStyle = i === 0 ? CONFIG.COLORS.snakeHead : CONFIG.COLORS.snakeBody;
        ctx.globalAlpha = 1 - (i / snake.length) * 0.4;
        ctx.beginPath();
        ctx.roundRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2, 5);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function drawApples() {
    const size = CONFIG.TILE_SIZE;
    apples.forEach(apple => {
        const cx = apple.x * size + size / 2;
        const cy = apple.y * size + size / 2;
        const r = size / 2 - 3;

        const gradient = ctx.createRadialGradient(cx - r / 3, cy - r / 3, 2, cx, cy, r);
        gradient.addColorStop(0, "#ff6b6b");
        gradient.addColorStop(1, CONFIG.COLORS.apple);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawScore() {
    scoreDisplay.textContent = "Punkte: " + score;
}

function render() {
    drawBackground();
    drawApples();
    drawSnake();
    drawScore();
}

/* ---------- Game Loop ---------- */

function gameLoop(time) {
    if (!isRunning || isPaused) return;

    animationFrameId = requestAnimationFrame(gameLoop);

    const elapsed = time - lastTime;
    if (elapsed < CONFIG.GAME_SPEED) return;
    lastTime = time - (elapsed % CONFIG.GAME_SPEED);

    if (mode === "demo") autoPilot();
    move();
    if (isRunning) render();
}

function startGame(newMode = mode) {
    cancelAnimationFrame(animationFrameId);

    mode = newMode;
    snake = CONFIG.INITIAL_SNAKE.map(s => ({ ...s }));
    dirX = dirY = nextX = nextY = 0;
    score = 0;
    isPaused = false;
    isRunning = true;

    initApples();

    modeDisplay.textContent = mode === "demo" ? "Modus: Demo 🤖" : "Modus: Spieler 🎮";
    pauseBtn.textContent = "⏸ Pause";
    overlay.classList.add("hidden");

    render();
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

/* ---------- Buttons ---------- */

startBtn.addEventListener("click", () => {
    if (isPaused && isRunning) togglePause();
    else startGame("player");
});
demoBtn.addEventListener("click", () => startGame("demo"));
pauseBtn.addEventListener("click", togglePause);
menuBtn.addEventListener("click", showMenu);

/* ---------- Schnee ---------- */

function createSnow(count = 70) {
    const snow = document.getElementById("snow");
    for (let i = 0; i < count; i++) {
        const flake = document.createElement("div");
        const size = 3 + Math.random() * 6;
        flake.className = "snowflake";
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.opacity = 0.5 + Math.random() * 0.5;
        flake.style.animationDuration = `${12 + Math.random() * 14}s`;
        flake.style.animationDelay = `-${Math.random() * 20}s`;
        snow.appendChild(flake);
    }
}

createSnow();
render();
