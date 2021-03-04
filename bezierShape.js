class BezierShape{
    constructor(){
        this.curves = []
        this.curr = -1
    }
    
    add(b){
        this.curves.push(b)
        this.curr = this.curves.length-1
    }
    
    shiftIndex(i){
        this.curr += i
        if(this.curr < 0){
            this.curr = this.curves.length - 1
        }else if(this.curr >= this.curves.length){
            this.curr = 0
        }
    }
    
    show(){
        if(this.curves.length != 0){
            beginShape()
            vertex(this.curves[0].p1.x,this.curves[0].p1.y)
            for(let i = 0; i < this.curves.length; i++){
                let c = this.curves[i]
                c.guides()
                let c2
                if(i != this.curves.length-1){
                    c2 = this.curves[i+1] 
                }else{
                    c2 = this.curves[0]
                }
                bezierVertex(c.a1.x,c.a1.y,c.a2.x,c.a2.y,c2.p1.x,c2.p1.y)
            }
            endShape()
        }
    }
    
    update(){
        if(this.curves.length > 0){
            var prev = this.curr - 1
            if(prev < 0){
                prev = this.curves.length-1 
            }
            var next = this.curr + 1
            if(next >= this.curves.length){
                next = 0
            }
            if(!this.curves[this.curr].p1.equals(this.curves[prev].p2)){
                this.curves[prev].p2.x = this.curves[this.curr].p1.x
                this.curves[prev].p2.y = this.curves[this.curr].p1.y
            }
            if(!this.curves[this.curr].p2.equals(this.curves[next].p1)){
                this.curves[next].p1.x = this.curves[this.curr].p2.x
                this.curves[next].p1.y = this.curves[this.curr].p2.y
            }
        }
    }
    
    smooth(){
        if(this.curves.length > 0){
            for(let i = 0; i < this.curves.length; i++){
                let v1 = this.curves[i].a2
                let v2 = this.curves[i].p2
                let a = atan2(v1.y-v2.y,v1.x-v2.x)
                let i2 = (i+1)%this.curves.length
                let n = this.curves[i2].a1
                let m = this.curves[i2].p1
                let l = dist(n.x,n.y,m.x,m.y)
                //console.log("new angle:" + degrees(a+PI))
                this.curves[i2].a1.x = l * cos(a+PI) + m.x
                this.curves[i2].a1.y = l * sin(a+PI) + m.y
            }
        }
    }
    
    getText(){
        let result = []
        result.push('beginShape();')
        result.push('vertex(' + this.curves[0].p1.x +','+this.curves[0].p1.y+ ');')
        for(let i = 0; i < this.curves.length; i++){
            let a = this.curves[i].a1
            let b = this.curves[i].a2
            let c = this.curves[i].p2
            result.push( 'bezierVertex('+a.x+','+a.y+','+b.x+','+b.y+','+c.x+','+c.y+');')
        }
        result.push('endShape();')
        return result
    }
}