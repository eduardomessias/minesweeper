class Space {
  constructor(x, y, s, i) {
    this.idx = i
    this.size = s
    this.x = x
    this.y = y
    this.westBound = this.x
    this.eastBound = this.x + this.size
    this.northBound = this.y + this.size
    this.southBound = this.y
    this.boundaries = [this.westBound,this.eastBound,this.northBound,this.southBound]
    this.hit = false
    this.revelead = false
    this.content = null
    this.hint = null
  }
  
  show() {
    rect(this.x, this.y, this.size, this.size) 
    
    if (this.hit) {
      this.reveal()
    } else {
      textSize(20)
      fill(0, 102, 153, 51);
      text(this.idx, this.x + 10, this.y + 30)
      fill(255)           
    }
  }
  
  overlapX() {
    return mouseX > this.westBound && mouseX < this.eastBound
  }
  
  overlapY() {
    return mouseY > this.southBound && mouseY < this.northBound
  }
  
  overlap() {
    return this.overlapX() && this.overlapY()
  }
  
  hasMine() {
    return this.content === 'mine'
  }  
  
  reveal() {
    
    switch (this.content){
      case 'mine':
        circle(this.x + 20, this.y + 20, 20)
        break;
      case 'hint':
        textSize(20)
        fill(0, 102, 153);
        text(this.hint, this.x + 15, this.y + 30)
        fill(255)
        break;
      case 'empty':
        textSize(20)
        fill(0, 102, 153, 51);
        rect(this.x, this.y, this.size, this.size) 
        fill(255)
        break;
    }
    
    this.revelead = true    
  }
}

class Field {
  constructor(w, h, s) {
    this.width = w
    this.height = h
    this.size = s
    this.mines = []
    this.planted = false
    this.hintsGiven = false
    this.spaces = []
  }
  
  build() {
    let x = 0, y = 0, s = this.width / 10
    for (let i = 0; i < this.size; i++) {
      let space = new Space(x,y,s, i)
      space.content = 'empty'
      // uncomment to reveal the space
      //space.hit = true
      this.spaces.push(space)
      x += s
      if (x == this.width) {
        x = 0
        y += s
      }      
    }
  }
  
  plantMines() {
    if (!this.planted) {
      let minesLength = round(random(3, 10))
      
      for (let i = 0; i < minesLength; i++) {
        
        let r = round(random(0, 99))
        
        if (this.mines.includes(r)) {
          r = round(random(0, 99));
        }
        
        this.mines[i] = r
      }

      for (let mine of this.mines) {
        if (!this.spaces[mine].revealed) {
          this.spaces[mine].content = 'mine'
          // uncomment to reveal the mine
          //this.spaces[mine].hit = true
        }
      }
      
      this.planted = true
    }
  }
  
  plantHints() {
    if (!this.hintsGiven) {
      for (let mine of this.mines) {
        
        let hints = []
        
        if (this.spaces[mine].westBound === 0) {
          hints.push(mine - 10)
          hints.push(mine - 9)
          hints.push(mine + 1)
          hints.push(mine + 10)
          hints.push(mine + 11)
        } else if (this.spaces[mine].eastBound === this.width) {
          hints.push(mine - 11)
          hints.push(mine - 10)
          hints.push(mine - 1)
          hints.push(mine + 9)
          hints.push(mine + 10)
        } else if (this.spaces[mine].southBound === this.height) {
          hints.push(mine - 11)
          hints.push(mine - 10)
          hints.push(mine - 9)
          hints.push(mine - 1)
          hints.push(mine + 1)
        } else if (this.spaces[mine].northBound === 0) {
          hints.push(mine - 1)
          hints.push(mine + 1)
          hints.push(mine + 9)
          hints.push(mine + 10)
          hints.push(mine + 11)
        } else {
          hints.push(mine - 11)
          hints.push(mine - 10)
          hints.push(mine - 9)
          hints.push(mine - 1)
          hints.push(mine + 1)
          hints.push(mine + 9)
          hints.push(mine + 10)
          hints.push(mine + 11)
        }
        
        for (let hint of hints) {
          if (this.spaces[hint] !== undefined && this.spaces[hint].content !== 'mine') {
            this.spaces[hint].content = 'hint'
            this.spaces[hint].hint += 1
            // uncomment to reveal the hint
            //this.spaces[hint].hit = true
          }
        }

        console.log(`mine ${mine} hints: ${hints}`)
      }
      
      this.hintsGiven = true
    }
  }
  
  show() {
    this.spaces.forEach((space) => {
      space.show()      
    })
  }
  
  hitAround(space) {
    this.hitSpace(space.idx - 11)
    this.hitSpace(space.idx - 10)
    this.hitSpace(space.idx - 9)
    this.hitSpace(space.idx - 1)
    
    this.hitSpace(space.idx + 1)
    this.hitSpace(space.idx + 9)
    this.hitSpace(space.idx + 10)
    this.hitSpace(space.idx + 11)
  }
  
  hitSpace(idx) {
    if (this.spaceExists(idx)) {
      this.spaces[idx].hit = true
    }
  }
  
  spaceExists(idx) {
    return this.spaces[idx] !== undefined
  }
  
  spaceHasMine(idx) {
    return this.spaceExists(idx) && this.spaces[idx].hasMine()
  }
  
  minesAround(space) {
    let ret = false
    ret = this.spaceHasMine(space.idx - 11)
    ret = ret || this.spaceHasMine(space.idx - 10)
    ret = ret || this.spaceHasMine(space.idx - 9)
    ret = ret || this.spaceHasMine(space.idx - 1)
    ret = ret || this.spaceHasMine(space.idx + 1)
    ret = ret || this.spaceHasMine(space.idx + 9)
    ret = ret || this.spaceHasMine(space.idx + 10)
    ret = ret || this.spaceHasMine(space.idx + 11)
    return ret
  }  
}

function mouseClicked() {
  let space = field.spaces.find(space => space.overlap())
  space.hit = true
  console.log(`Field space ${space.idx} just got hit!`)
}

let field 

function setup() {
  createCanvas(400, 400);
  field = new Field(400, 400, 100)
  field.build()
  field.plantMines()
  field.plantHints()
}

function draw() {
  //background(220);
  
  field.show()    
}