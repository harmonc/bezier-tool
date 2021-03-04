let buttons = []
var beziers = []
var curr
var currIndex = -1
var shapes = []
var inShape = false
let names = ['add bezier','clear','new shape','previous bezier','next bezier','smooth shape','save']
let fs = [addBezier,clearBeziers,newShape,prevBezier,nextBezier,smoothShape, saveShape]
function setup() {
    createCanvas(600, 600)
    background(255)
    for(let i = 0; i < names.length; i++){
        buttons[i] = createButton(names[i])
        buttons[i].position(600, 20*i)
        buttons[i].mousePressed(fs[i])
    }
}

function draw(){
    background(255)
    showShapes()
    showBeziers()
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