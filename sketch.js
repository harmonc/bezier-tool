let buttons = []
var beziers = []
var curr
var currIndex = -1
var shapes = []
var inShape = false
let names = ['add bezier','clear','new shape','previous bezier','next bezier','smooth shape','save','random shape','save svg']
let fs = [addBezier,clearBeziers,newShape,prevBezier,nextBezier,smoothShape, saveShape, randomShapeCenter, saveSVG]
function setup() {
    createCanvas(600, 600, SVG)
    background(22)
    for(let i = 0; i < names.length; i++){
        buttons[i] = createButton(names[i])
        buttons[i].position(600, 20*i)
        buttons[i].mousePressed(fs[i])
    }
}

function randomShapeGrid(){
    clearBeziers()
    let gsize = 4
    for(let row = 0; row < gsize; row++){
        for(let col = 0; col < gsize; col++){
            let x = width/gsize * col + width/(2*gsize)
            let y = height/gsize * row + height/(2*gsize)
            let rad = width/(2*gsize)
            randomShapeKernel(x,y,rad)
        }
    }
}

function randomShapeCenter(){
    clearBeziers()
    let gsize = 1
    for(let row = 0; row < gsize; row++){
        for(let col = 0; col < gsize; col++){
            let x = width/gsize * col + width/(2*gsize)
            let y = height/gsize * row + height/(2*gsize)
            randomShapeCenterKernel(x,y)
        }
    }
    background(242)
    showShapes()
}

function randomShapeCenterKernel(x,y){
    let xoff = random(100,1000)
    let yoff = random(100,1000)
    for(let i = 0; i < 20; i++){
        randomShapeKernel(x,y,i*20, i, xoff, yoff)
    }
}

function randomShapeKernel(x, y, rad, c, xoff, yoff){
    let s = new BezierShape();
    let l = []
    let n = 30
    let noiseXOff = xoff
    let noiseYOff = yoff
    let noiseR = 2 + c*0.05
    for(let i = 0; i < n; i++){
        let a = map(i,0,n,0,TAU)
        l[i] = map(noise(noiseXOff + noiseR*cos(a),noiseYOff + noiseR * sin(a)),0,1,rad/15.0,rad)
    }
    for(let i = 0; i < n; i++){
        let a = map(i,0,n,0,TAU)
        let a2 = map((i+1)%n,0,n,0,TAU)
        let a3 = a2+PI/2.0
        curr = new MyBezier()
        curr.p1 = createVector(x+l[i]*cos(a), y + l[i]*sin(a))
        let l2 = random(l[i]/12.0,l[i]/6.0)
        curr.a1 = createVector(curr.p1.x + l2 * cos(a3),curr.p1.y + l2 * sin(a3))
        curr.p2 = createVector(x+l[(i+1)%n]*cos(a2),y+l[(i+1)%n]*sin(a2))
        let l3 = random(l[(i+1)%n]/12.0,l[(i+1)%n]/6.0)
        curr.a2 = createVector(curr.p2.x + l3 * cos(a3 + PI),curr.p2.y + l3 * sin(a3 + PI))
        beziers.push(curr)
        currIndex = beziers.length-1
        s.add(curr)
    }
    s.smooth()
    shapes.push(s)
    inShape = true
    s.show()
}

function draw(){

    //showBeziers()
}

function showBeziers(){
    beziers.forEach( b => {
        if(b.grabbed){
            b[b.grabProp] = createVector(mouseX, mouseY)
        }
        if(b==curr){
            strokeWeight(2)
        }
        noFill()
        stroke(0)
        b.show()
        stroke(0,100,200)
        strokeWeight(1)
        if(b==curr){
            b.guides()
    }})
}

function showShapes(){
    shapes.forEach(shape => {
        shape.show()
        shape.update()
    })
}

function mousePressed(){
    if(onScreen(mouseX,mouseY) && curr!=null && !curr.grabbed){
        curr.grab(mouseX,mouseY)
    }else if(curr!=null && curr.grabbed){
        curr.grabbed = false
    }
}

function keyPressed(){
    if(key == 'a' || key == 'A'){
        addBezier()
    }else if(key == 'c' || key == 'C'){
        clearBeziers()
    }
}

function onScreen(x,y){
    return x >= 0 && x < width && y >= 0 && y < height
}

function addBezier() {
    if(curr != null){
        curr.grabbed = false
    }
    curr = new MyBezier()
    beziers.push(curr)
    currIndex = beziers.length-1
    if(inShape){
      shapes[shapes.length-1].add(curr)
    }
}

function clearBeziers(){
    beziers = []
    shapes = []
}

function newShape(){
    inShape = true
    shapes.push(new BezierShape())
}

function prevBezier(){
    moveBezierIndex(-1)
}

function nextBezier(){
    moveBezierIndex(1)
}

function smoothShape(){
    if(shapes.length > 0){
        shapes[shapes.length-1].smooth()
    }
}

function moveBezierIndex(i){
    currIndex += i
    if(currIndex < 0){
        currIndex = beziers.length-1
    }else if(currIndex >= beziers.length){
        currIndex = 0
    }
    curr.grabbed = false
    curr = beziers[currIndex]
    if(shapes.length > 0){
        shapes[shapes.length-1].shiftIndex(i)
    }
}

function saveShape(){
    save(shapes[shapes.length-1].getText(),"code.txt")
}

function saveSVG(){
    save("test.svg")
}