class MyBezier{
  constructor(){
    this.p1 = createVector(200,300)
    this.p2 = createVector(400,300)
    this.a1 = createVector(200,200)
    this.a2 = createVector(400,200)
    this.grabbed = false
      this.grabProp = ''
  }
  
  show(){
    bezier(this.p1.x,this.p1.y,this.a1.x,this.a1.y,this.a2.x,this.a2.y,this.p2.x,this.p2.y);
  }
  
  guides(){
      stroke(200,0,0)
    line(this.p1.x,this.p1.y,this.a1.x,this.a1.y)
      stroke(0,200,0)
    line(this.p2.x,this.p2.y,this.a2.x,this.a2.y)
  }
  
  toString(){
    return 'bezier(' + this.p1.x + ',' + this.p1.y + ',' + 
      this.a1.x + ',' + this.a1.y + ',' + this.a2.x + ',' +
      this.a2.y + ',' + this.p2.x + ',' + this.p2.y + ')'
  }
    
  grab(x,y){
      var min = dist(x,y,this.p1.x,this.p1.y)
      var result = 'p1'
      let d1 = dist(x,y,this.a1.x,this.a1.y) 
      let d2 = dist(x,y,this.a2.x,this.a2.y)
      let d3 = dist(x,y,this.p2.x,this.p2.y)
      console.log(min,d1,d2,d3)
      if(d1 < min){
          min = d1
          result = 'a1'
      }
      if(d2 < min){
          min = d2
          result = 'a2'
      }
      if( d3 < min){
          min = d3
          result = 'p2'
      }
      this.grabProp = result
      this.grabbed = true
  }
}