
//board game entities are built from this
class Entity {
    constructor(sprite="",x=0,y=0,speed=0,dir=1,sector=0) {
        this.sprite=sprite;
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.dir=dir;  //1=left to right -1=right to left direction
        this.sector;
    }

    render() {
        //console.log(this.sprite);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    contact(movingObject,vector) {  // v and h don't match vector correctly and
                                    //the numbers aren't right - works but need to fix
                                    //for readablility

        switch(vector) {
            case 'v':   //verticle
                if (movingObject.x===this.x) {
                    return( (Math.abs((movingObject.y+85.5)-(this.y+85.5))<=101) ? true : false );
                } else {
                   return(false);
                }
                break;

            case 'h':   //horzontal
                if (Math.abs(movingObject.y-this.y)<=25) {
                    return( (Math.abs((movingObject.x+50.5)-(this.x+50.5))<=101) ? true : false );
                } else {
                   return(false);
                }
                break;

            default:
                return(false);

        }

    }
}

class Rock extends Entity {
    constructor(sprite='images/rock.png',x,y) {
        super(sprite,x,y);
        this.isRock=false;

    }

    render() {
        super.render();
    }

    placement() {

        this.y=getSpeed(2,4)*83-19  //random row 2-4
        this.x=getSpeed(2,4)*101    //random col 2-4
        this.isRock=true;

    }

    contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }

    //need an update() ?
}

class Bugs extends Entity {
    constructor( sprite='images/enemy-bug.png',x,y,speed,dir) {
        super(sprite,x,y,speed,dir);

    }

    render() {
        super.render();
    }


    update(dt) {
        this.x+=(Math.floor(this.speed*(dt*100)))*this.dir;
        // console.log(this.x);
        if (rock.contact(this,'h')) {
            this.dir=this.dir*-1;
        }
        switch(this.dir) {
            case 1:
                if (this.x > 505) {
                    this.setBug();
                }
                this.sprite='images/enemy-bug.png';
                break;
            case -1:
                if (this.x < -110) {
                    this.setBug();
                }
                this.sprite='images/enemy-bug-l.png';
        }
    }

    switchBug() {

    }

    contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }

    setBug() {
        switch(this.dir){
            case 1:
               this.x=-110;
                this.y=63+(getSpeed(0,3)*83);  //use getSpeed to set row
                this.speed= getSpeed(100,300)/100;
                break;
            case -1:
                this.sprite='images/enemy-bug-l.png'
                this.x=550;
                this.y=63+(getSpeed(0,3)*83);  //use getSpeed to set row
                this.speed= getSpeed(100,300)/100;
        }
    }
}

class Player extends Entity {
    constructor( sprite,x,y) {
        super(sprite,x,y);
        this.livesLeft=3;
        this.score=0;
        this.level=1;
        this.gems=0;
    }

    render() {
        super.render();
        //render lives
        ctx.drawImage(Resources.get(this.sprite), 5, 498,50,85);
        ctx.font="30px Combo";
        ctx.fillText("x"+this.livesLeft,53,565);
        //render level
        ctx.font="30px Combo";
        ctx.fillText("L:"+this.level,133,565);
        //render gems
        ctx.drawImage(Resources.get('images/gem1.png'), 218, 517,30,51);
        ctx.font="30px Combo";
        ctx.fillText("x"+this.gems,253,565);
    }

    died() {
              //move player back to starting postion
        //reset bugs?
        //update lives / score / etc

        this.x=2*101;
        this.y=4*83-10;
        this.update();
        //call method to update lives - should be closed over - maybe it's this method
    }

    update() {
                this.livesLeft-=1;
     }

     contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }

    handleInput(key) {
        switch(key) {
            case 'left':
                if (!(this.x===0) && !(rock.contact(this,'h'))) {
                    //console.log(rock.contact(this,'h'));
                    this.x-=101;
                }
                break;

            case 'up':
                if (!(this.y<=0) && !(rock.contact(this,'v'))){
                this.y-=83;
                }
                break;

            case 'right':
                if (!(this.x===404) && !(rock.contact(this,'h'))) {
                    this.x+=101;
                }
                break;

            case 'down':
            if (!(this.y>3*83) && !(rock.contact(this,'v'))) {
                this.y+=83;
            }
        }
    }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies=[];



// number of enemies = easy = 3 medium=5 hard=5+faster

for(let i=0; i<3; i++) {
    let enemyObj=new Bugs('images/enemy-bug.png');
    allEnemies.push(enemyObj);
    enemyObj.setBug();

}

player=new Player('images/char1.png',202,322);
rock=new Rock();  //placement needs to be called before it shows up
rock.placement(); //only if level > 1


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

function getSpeed(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}
