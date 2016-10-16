var MT = require('mersennetwister')
  , ImageJS = require('imagejs')
  , xorshift = require('xorshift')

var WIDTH = 1024
  , HEIGHT = WIDTH
  , ITERATIONS = 100000000
  , RNG = process.argv[2]

var m = new MT()
  , bmp = new ImageJS.Bitmap({width: WIDTH, height: HEIGHT})
  , hits = []
  , val
  , hits_max = 0
  , hits_in_circle = 0

function random() {
  if (RNG === 'mersenne') {
    return m.rnd()
  } else if (RNG === 'xorshift') {
    return xorshift.random()
  } else {
    return Math.random()
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min)) + min;
}

for (var x = 0; x < WIDTH; x++) {
  for (var y = 0; y < HEIGHT; y++) {
    hits[x] = hits[x] || []
    hits[x][y] = 0
  }
}

for (var k = 0; k < ITERATIONS; k++) {
  x = getRandomInt(0, WIDTH)
  y = getRandomInt(0, HEIGHT)

  hits[x][y] += 1
  hits_max = Math.max(hits[x][y], hits_max)

  if (Math.pow(x,2) + Math.pow(y,2) <= Math.pow(WIDTH,2)) {
    hits_in_circle++
  }
}

for (var x = 0; x < WIDTH; x++) {
  for (var y = 0; y < HEIGHT; y++) {
    val = 255 - Math.round((hits[x][y] / hits_max) * 255)
    bmp.setPixel(x,y,val,val,val,255)
  }
}


bmp.writeFile(
  [RNG || 'math_random', ITERATIONS].join('_') + '.png'
, { type: ImageJS.ImageType.PNG }
)

// monte carlo estimation of pi
console.log('π ≈', 4 * hits_in_circle / ITERATIONS)
