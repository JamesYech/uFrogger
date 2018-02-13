// Enemies our player must avoid

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x;
    this.y;
    this.speed=0;
    //this.rightPos;
    //this.leftPos;
    //this.offGrid=false;
    this.name;
    //this.startingBlock=true;
};

class Entity {
    constructor(sprite="",x=0,y=0,speed=0,name="") {
        this.sprite=sprite;
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.name=name;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Bugs extends Entity {
    constructor( sprite='images/enemy-bug.png',x,y,speed,name) {
        super(sprite,x,y,speed,name);
    }

    render() {
        super.render();
    }

    update(dt) {
        if (this.x+this.speed*(dt*100) > 505) {
            setBug(this);
        } else {
            this.x+=Math.floor(this.speed*(dt*100));
        }
    }

    collision() {
        let tip=this.x+101;
        let tail=this.x;
        let left=player.x+18;
        let right=player.x+83;

        if (((tip>=left && tip<=right) || (tail>=left && tail<=right)) && (this.y===player.y-10))
        {
            console.log(this.y===player.y-10);
            console.log(this.x+101 > player.x+16);
            console.log(this.x < player.x+85);
            //debugger;
            console.log("contact");
            player.died();
        }
    }

    setBug(bug,num) {
        bug.x=-110;
        bug.y=63+(getSpeed(0,3)*83);  //use getSpeed to set row
        bug.speed= getSpeed(100,300)/100;
        if (!(typeof num === "undefined")) {
        bug.name="bug"+num;
        }
    }
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //console.log(dt);
    //this.x+=this.speed*(dt*100);
    //console.log(this);

    //check for offGrid
    // if offGrid then
    //     randomly select row to reappear on
    //     if any row has zero than that row is selected
    //     if more than one row has zero than randomely select
    // reset this.x

    if (this.x+this.speed*(dt*100) > 505) {
        setEnemy(this);
    } else {

        this.x+=Math.floor(this.speed*(dt*100));
    }
};

Enemy.prototype.checkPlayerContact = function() {

    //clean this up
    //at some point add easter egg to let char
    //ride bug off the screen.  Then reset


    let tip=this.x+101;
    let tail=this.x;
    let left=player.x+18;
    let right=player.x+83;


    if (((tip>=left && tip<=right) || (tail>=left && tail<=right)) && (this.y===player.y-10))

    {
        console.log(this.y===player.y-10);
        console.log(this.x+101 > player.x+16);
        console.log(this.x < player.x+85);
        //debugger;
        console.log("contact");
        player.died();
    }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};






// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char1.png';
    this.x=2*101;
    this.y=4*83-10;
    this.speed=0;
    this.leftPos;

    //this.leftPos;
    //this.offGrid=false;
};



// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.drawImage("A",this.x-101,this.y);
    ctx.font="30px Arial";
    ctx.fillText("1",this.x-101,this.y);
};





Player.prototype.died = function() {
    //move player back to starting postion
    //reset bugs?
    //update lives / score / etc

    this.x=2*101;
    this.y=4*83-10;
    //call method to update lives - should be closed over - maybe it's this method


}
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //console.log(dt);
    //this.x+=this.speed*(dt*100);
    //console.log(this);

    //check for offGrid
    // if offGrid then
    //     randomly select row to reappear on
    //     if any row has zero than that row is selected
    //     if more than one row has zero than randomely select
    // reset this.x

    // if (this.x+this.speed*(dt*100) > 505) {
    //     //reset location to beginning
    //     //reset speed
    //     //change row?
    //     setEnemy(this);
    // } else {this.x+=this.speed*(dt*100);}

};

Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':   //left
            if (!(this.x===0)) {
                this.x-=101;
            }

        break;

        case 'up':   //up
            //console.log(this.y);
            if (!(this.y<=0)){
            this.y-=83;
        }

            break;
        case 'right':   //right

            if (!(this.x===404)) {
                this.x+=101;
            }

            break;
        case 'down':   //down
        if (!(this.y>4*83)) {
            this.y+=83;
        }

    }

}





// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies=[];



// number of enemies = easy = 3 medium=5 hard=5+faster
//x moves across y down
//need to find the starting y for the three lanes
//after bug exits on right, need to randomize it's lane
//and it's speed for the next pass

for(let i=0; i<3; i++) {
    let enemyObj=new Enemy();
    // enemyObj.x=-110;
    // enemyObj.y=63+(i*83);
    // enemyObj.speed= getSpeed(100,300)/100;
    allEnemies.push(enemyObj);
    setEnemy(enemyObj,i);

        //console.log(enemyObj.speed);

}

player=new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}

);

  function setEnemy(bug,num) {
        bug.x=-110;
        bug.y=63+(getSpeed(0,3)*83);  //use getSpeed to set row
        bug.speed= getSpeed(100,300)/100;
        if (!(typeof num === "undefined")) {
        bug.name="bug"+num;
        }
    };

function getSpeed(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}



