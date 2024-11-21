const gameArea = document.getElementById("game-area")
const player = document.querySelector('#player')
const beyonce = document.querySelectorAll(`#beyonce`)[0]
const audio = document.querySelector('audio')
const title = document.getElementById('title')
const lblEnemySpeed = document.getElementById('lblEnemySpeed')
const modal = new bootstrap.Modal(document.getElementById('modal'))

const btnPlay = document.getElementById('btnPlay')
const sldBeyonceSpeed = document.getElementById('bSpeed')
const sldPlayerSpeed = document.getElementById('pSpeed')
const slcBgImg = document.getElementById('slcBgImg')
const slcPlayerColor = document.getElementById('slcPlayerImg')
const slcEnemyImg = document.getElementById('slcEnemyImg')

let started = false
let playerSpeed = 30
let beyonceSpeed = 2

let bgImg
let playerColor
let enemy

let isPlaying = false
let playerPosition = { x: 0, y: 0 }
let beyoncePosition = { x: 300, y: 300 }

function detectCollision () {
    const deltaX = Math.abs(playerPosition.x - beyoncePosition.x)
    const deltaY = Math.abs(playerPosition.y - beyoncePosition.y)

    if (deltaX <= 50 && deltaY <= 50) {
        isPlaying = false
        audio.pause()
        modal.show()
    }
}

function gameLoop () {
    moveBeyonce()
    requestAnimationFrame(gameLoop)
}

function moveBeyonce () {
    if(!isPlaying)
        return

    if (beyoncePosition.x < playerPosition.x) 
        beyoncePosition.x += beyonceSpeed
    else if (beyoncePosition.x > playerPosition.x)
        beyoncePosition.x -= beyonceSpeed

    if (beyoncePosition.y < playerPosition.y) 
        beyoncePosition.y += beyonceSpeed
    else if (beyoncePosition.y > playerPosition.y)
        beyoncePosition.y -= beyonceSpeed

    updatePosition()
    detectCollision()
}

function movePlayer (event) {
    if(!isPlaying)
        return

    switch (event.key) {
        case 'ArrowUp':
            if (playerPosition.y >= 25) 
                playerPosition.y -= playerSpeed
            break
        case 'ArrowDown':
            if(playerPosition.y < gameArea.clientHeight - 70)
                playerPosition.y += playerSpeed
            break
        case 'ArrowLeft':
            if (playerPosition.x >= 25) 
                playerPosition.x -= playerSpeed
            break
        case 'ArrowRight':
            if(playerPosition.x < gameArea.clientWidth - 70)
                playerPosition.x += playerSpeed
            break
    }

    updatePosition()
}

function updatePosition () {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`
    beyonce.style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`
}

function restart() {
    isPlaying = true
    playerPosition.x = 0
    playerPosition.y = 0

    beyoncePosition.x = 300
    beyoncePosition.y = 300
    modal.hide()
    audio.play()
}

window.addEventListener('keydown', movePlayer)
window.addEventListener('load', () => {
    gameLoop()
    /* audio.play() */
})

btnPlay.addEventListener('click', () => {
    if(isPlaying) {
        isPlaying = false
        btnPlay.innerHTML = 'Play'
    }
    else {
        if(!started) {
            started = true
            audio.play()
        }

        isPlaying = true
        btnPlay.innerHTML = 'Pause'
    }
})

// Form event handlers

sldBeyonceSpeed.addEventListener('input', (event) => {
    beyonceSpeed = parseInt(event.target.value)
})

sldPlayerSpeed.addEventListener('input', (event) => {
    playerSpeed = parseInt(event.target.value)
})

slcBgImg.addEventListener('change', (event) => {
    bgImg = event.target.value
    if (bgImg == 'none')
        gameArea.style.backgroundImage = 'none'
    else
        gameArea.style.backgroundImage = `url(img/${bgImg})`
})

slcEnemyImg.addEventListener('change', (event) => {
    enemy = event.target.value
    title.innerHTML = `Escape from ${enemy}`
    lblEnemySpeed.innerText = `${enemy} speed:`

    beyonce.style.backgroundImage = `url(img/${enemy}.jpg)`

    audio.pause()
    audio.currentTime = 0
    audio.src = `music/${enemy}.mp3`
    audio.load()

    if(started) 
        audio.play()
})

slcPlayerColor.addEventListener('change', (event) => {
    playerColor = event.target.value
    player.style.backgroundColor = playerColor
})