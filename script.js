import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom({
    width: 1000,
    height: 600
});

scene("title", () => {
    add([
        rect(width(), height()),
        color(46, 191, 82)
    ]);
    add([
        text("Frogger"),
        anchor("center"),
        pos(width() / 2, height() / 4),
        scale(2)
    ]);
    add([
        text("Press Space to Start"),
        anchor("center"),
        pos(center()),
        scale(1.5)
    ]);
    add([
        text("WASD or Arrows to Move"),
        anchor("center"),
        pos(width() / 2, height() / 1.3)
    ]);
    onKeyPress("space", () => {go("game");});
});

let lives = 3;
let level = 0;
let time = 0;

loadSound("music", "sfx/8bit-music-for-game-68698.mp3");

const music = play("music", {
    loop: true,
    paused: true
});

scene("game", () => {
    let frogSpeed = 65;
    let tick = 74;
    let onLog = 3;
    let roads = [];
    let cars = [];
    let rivers = [];
    let logs = [];
    let levels = [[2, 0, 1, 1, 1, 0, 1, 0],
                  [2, 2, 1, 1, 0, 2, 1, 0],
                  [1, 1, 2, 0, 1, 2, 2, 0],
                  [2, 2, 2, 0, 1, 1, 1, 0],
                  [1, 2, 1, 1, 0, 1, 1, 0],
                  [2, 2, 1, 1, 1, 2, 2, 0],
                  [1, 0, 2, 1, 2, 1, 2, 0],
                  [2, 1, 1, 0, 1, 2, 1, 0],
                  [2, 0, 2, 1, 1, 2, 1, 0],
                  [2, 1, 2, 1, 1, 2, 1, 0]];
    let canMove = true;
    music.paused = false;
    const levelLabel = add([
        text("Level: " + (level + 1)),
        pos(800, 10),
        color(0, 0, 0)
    ]);

    loadSprite("frog", "sprites/froggerspritesheet (1).png", {
        sliceX: 7,
        anims: {
            "idle": 0,
            "run": {
                from: 0,
                to: 6,
                speed: 50
            }
        }
    });

    loadSprite("car", "sprites/froggerspritesheet (2).png", {
        sliceX: 3,
        anims: {
            "blue": 0,
            "green": 1,
            "yellow": 2
        }
    });

    loadSprite("log1", "sprites/log1.png");
    loadSprite("log2", "sprites/log2.png");
    loadSprite("log3", "sprites/log3.png");

    loadSound("move", "sfx/frog-qua-cry-36013.mp3");
    loadSound("win", "sfx/win.mp3");
    loadSound("levelup", "sfx/retro-coin-4-236671.mp3");
    loadSound("death", "sfx/wrong-buzzer-6268.mp3");
    loadSound("gameover", "sfx/game-over-arcade-6435.mp3");

    add([
        rect(width(), height()),
        color(46, 221, 82)
    ]);
    for(let i = 0; i < lives; i++)
        add([
            sprite("frog"),
            pos(i * 30 + 15, 5),
            scale(0.5)
        ]);
    for(let i = 0, offset = 0; i < levels[level].length; i++) {
        if(levels[level][i] == 1)
            roads.push(
                add([
                    rect(width(), 65),
                    pos(0, i * 65 + 65),
                    color(0, 0, 0)
                ])
            );
        else if(levels[level][i] == 2) {
            rivers.push(
                add([
                    rect(width(), 65),
                    pos(0, i * 65 + 65),
                    color(48, 191, 230),
                    area(),
                    "river"
                ])
            );
            offset++;
        } else
            offset++;
        if(levels[level][i] == 1 && levels[level][i - 1] == 1)
            for(let j = 0; j < width(); j += 60)
                add([
                    rect(20, 5),
                    pos(j, roads[i - offset].pos.y)
                ])
    }
    const player = add([
        sprite("frog"),
        anchor("center"),
        pos(width() / 2, height() - 40),
        area({scale: new Vec2(1, 0.5), offset: new Vec2(-2, -18)}),
        "frog"
    ]);
    player.flipY = true;
    onKeyPress("w", () => {
        if(canMove == true) {
            player.flipY = true;
            player.play("run");
            player.pos.y -= frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onKeyPress("a", () => {
        if(canMove == true && player.pos.x > 45) {
            player.play("run");
            player.pos.x -= frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onKeyPress("s", () => {
        if(canMove == true && player.pos.y < 560) {
            player.flipY = false;
            player.play("run");
            player.pos.y += frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onKeyPress("d", () => {
        if(canMove == true && player.pos.x < 955) {
            player.play("run");
            player.pos.x += frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onKeyPress("up", () => {
        if(canMove == true) {
            player.flipY = true;
            player.play("run");
            player.pos.y -= frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onKeyPress("left", () => {
        if(canMove == true && player.pos.x > 45) {
            player.play("run");
            player.pos.x -= frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onKeyPress("down", () => {
        if(canMove == true && player.pos.y < 560) {
            player.flipY = false;
            player.play("run");
            player.pos.y += frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onKeyPress("right", () => {
        if(canMove == true && player.pos.x < 955) {
            player.play("run");
            player.pos.x += frogSpeed;
            canMove = false;
            play("move");
        }
    });
    onCollide("frog", "car", () => {
        if(lives > 1) {
            lives--;
            play("death");
            go("game");
        }
        else
            go("gameover");
    });
    onCollideUpdate("frog", "river", () => {
        onLog--;
        if(onLog < 0) {
            if(lives > 1) {
                lives--;
                play("death");
                go("game");
            }
            else
                go("gameover");
        }
    });
    loop(0.2, () => {
        canMove = true;
        tick++;
        if(tick % 15 == 0)
            for(let i = 0; i < roads.length; i++) {
                let color = ["blue", "green", "yellow"];
                cars.push(
                    add([
                        sprite("car", {anim: color[Math.floor(Math.random() * 3)], flipX: i % 2 == 0 ? true : false}),
                        pos(i % 2 == 0 ? width() : 0, roads[i].pos.y + 5),
                        scale(0.75),
                        area(),
                        "car"
                    ])
                );
            }
        if(tick % 25 == 0)
            for(let i = 0; i < rivers.length; i++) {
                let sizes = ["log1", "log2", "log3"];
                logs.push(
                    add([
                        sprite(sizes[Math.floor(Math.random() * 3)], {flipX: i % 2 == 0 ? true : false}),
                        pos(i % 2 == 0 ? width() : 0, rivers[i].pos.y + 10),
                        scale(0.75),
                        area(),
                        i % 2 == 0 ? "flipped" : "notflipped"
                    ])
                );
            }
        if(tick % 5 == 0)
            time++;
        if(tick >= 75)
            tick = 0;
    });
    onCollideUpdate("frog", "flipped", () => {
        if(player.pos.x > 0) {
            player.move(-150, 0);
            onLog = 3;
        } else {
            if(lives > 1) {
                lives--;
                play("death");
                go("game");
            }
            else
                go("gameover");
        }
    });
    onCollideUpdate("frog", "notflipped", () => {
        if(player.pos.x < width()) {
            player.move(100, 0);
            onLog = 3;
        } else {
            if(lives > 1) {
                lives--;
                play("death");
                go("game");
            }
            else
                go("gameover");
        }
    });
    onUpdate(() => {
        let speed;
        for(let i = 0; i < cars.length; i++) {
            if(cars[i].curAnim() == "blue")
                speed = 125;
            else if(cars[i].curAnim() == "green")
                speed = 155;
            else
                speed = 180;
            cars[i].move(cars[i].flipX == true ? -speed : speed, 0);
        }
        for(let i = 0; i < logs.length; i++) {
            logs[i].move(logs[i].flipX == true ? -150 : 100, 0);
        }
        readd(player);
        readd(levelLabel);
        if(player.pos.y <= 40) {
            if(level < 9) {
                level++;
                play("levelup");
                go("game");
            } else
                go("win");
        }
    });
});

scene("gameover", () => {
    lives = 3;
    level = 0;
    time = 0;
    music.paused = true;
    add([
        rect(width(), height()),
        color(235, 63, 35)
    ]);
    add([
        text("Game Over"),
        anchor("center"),
        pos(width() / 2, height() / 3),
        scale(2),
        color(0, 0, 0)
    ]);
    add([
        text("Press Space to Restart"),
        anchor("center"),
        pos(width() / 2, height() / 2),
        scale(1.5),
        color(0, 0, 0)
    ]);
    play("gameover");
    onKeyPress("space", () => {go("game");});
});

scene("win", () => {
    music.paused = true;
    add([
        rect(width(), height()),
        color(24, 171, 115)
    ]);
    add([
        text("You Win!"),
        anchor("center"),
        pos(width() / 2, height() / 4),
        scale(2)
    ]);
    add([
        text("Your Time Was " + time + " Seconds"),
        anchor("center"),
        pos(width() / 2, height() / 2),
        scale(1.75)
    ]);
    add([
        text("Press Space to Return to Title"),
        anchor("center"),
        pos(width() / 2, height() / 1.25),
        scale(1.2)
    ]);
    lives = 3;
    time = 0;
    level = 0;
    play("win");
    onKeyPress("space", () => {go("title");});
});

go("title");