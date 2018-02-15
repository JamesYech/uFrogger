var allEnemies=[];
//board game entities are built from this
class Entity {
    constructor(sprite="",x=0,y=0,speed=0,dir=1,sector=0) {
        this.sprite=sprite;
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.dir=dir;  //1=left to right -1=right to left direction
        //this.sector;
        //had to introduce offsets because gems had to be sized down which threw off their margins and
        //made them 'bounce' off the rocks too soon.
        this.leftOffset=0; //negative number
        this.rightOffset=0;//positive number
        this.bounce=false;

    }

    render() {
        //console.log(this.sprite);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    contact(movingObject,vector) {  //v or h

        let offset;
        (movingObject.dir>0) ? offset=movingObject.leftOffset : offset=movingObject.rightOffset;
        switch(vector) {

            case 'h':  //left or right
                if (Math.abs(movingObject.y-this.y)<=17) {  //in same row (y's align)
                    //return( (Math.abs((movingObject.x+((101+offset)*movingObject.dir))-this.x)<=5) ? true : false );
                    return( (Math.abs((movingObject.x+offset)-this.x)<=101) ? true : false );
                } else {
                    return(false);
                }
                break;

            case 'v': //up or down
                if (movingObject.x===this.x) {  //in same col (x's align)
                    return( (Math.abs((movingObject.y+(83*movingObject.dir))-this.y)<=12) ? true : false );
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
    constructor(sprite='images/rock.png',x,y,leftOffset,rightOffset) {
        super(sprite,x,y,leftOffset,rightOffset);


    }

    render() {
        super.render();
    }

    placement() {

        this.y=getSpeed(1,4)*83-19  //random row 2-4
        this.x=getSpeed(1,4)*101    //random col 2-4
        this.isRock=true;

    }

    contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }


}

class Star extends Entity {
    constructor(sprite='images/star.png',x,y,leftOffset,rightOffset) {
        super(sprite,x,y,leftOffset,rightOffset);


    }

    render() {
        super.render();
    }

    placement() {

        this.y=0-10;
        this.x=getSpeed(0,5)*101    //random col 1-5


    }

    contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }


}

class Bugs extends Entity {
    constructor( sprite='images/enemy-bug.png',x,y,speed,dir,leftOffset,rightOffset,bounce) {
        super(sprite,x,y,speed,dir,leftOffset,rightOffset,bounce);


    }

    render() {
        super.render();
    }


    update(dt) {
        this.x+=(Math.floor(this.speed*(dt*100)))*this.dir;
        // console.log(this.x);
        if (rock.contact(this,'h')) {
            this.dir=this.dir*-1;
            this.bounce=true;

        }
        switch(this.dir) {
            case 1:
                if (this.x > 505) {
                    this.reset();
                    this.makeGem();
                }
                this.sprite='images/enemy-bug.png';
                break;
            case -1:
                if (this.x < -110) {
                    this.reset();
                    this.makeGem();
                }
                this.sprite='images/enemy-bug-l.png';
        }
    }

    makeGem() {
        if (getSpeed(0,10)===2 && !(gem.active)) {

            console.log('2');
            //allEnemies.push(gem);
            gem.sprite='images/gem'+getSpeed(1,4)+'.png';
            gem.active=true;
            gem.reset();


        }

    }

    contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }

    reset() {
        switch(this.dir){
            case 1:
               this.x=-110;
                this.y=63+(getSpeed(0,3)*83);  //use getSpeed to set row
                this.speed= getSpeed(100,300)/100;
                break;
            case -1:
                //this.sprite='images/enemy-bug-l.png'
                this.x=550;
                this.y=63+(getSpeed(0,3)*83);  //use getSpeed to set row
                this.speed= getSpeed(100,300)/100;
                break;
            default:
                this.dir=1;
                this.reset();

        }
        this.bounce=false;
    }
}

class Gem extends Bugs {
    constructor(sprite,x,y,speed,dir,leftOffset,rightOffset,bounce) {
        super(sprite,x,y,speed,dir=1,leftOffset,rightOffset,bounce);
        this.active=false;
        this.leftOffset=-38;
        //this.bounce=false;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y+38,65,111);;
    }
    update(dt) {
        this.x+=(Math.floor(this.speed*(dt*100)))*this.dir;

        if (!(this.bounce)) {
            if (rock.contact(this,'h')) {

                this.dir=this.dir*-1;
                this.bounce=true;

            }
        }
        if (player.contact(this,'h')) {
            player.gems+=1;
            this.x=-100;
            this.active=false;

        }
        switch(this.dir) {
            case 1:
                if (this.x > 505) {
                    this.reset();
                }
                break;
            case -1:
                if (this.x < -110) {
                    this.reset();
                }
        }
    }
    contact(movingObject,vector) {
        return(super.contact(movingObject,vector));

     }
     reset() {
        super.reset();
        //this.active=true;
        //this.bounce=false;
     }
}

class Player extends Entity {
    constructor( sprite,x,y,leftOffset,rightOffset) {
        super(sprite,x,y,leftOffset,rightOffset);
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
        //render score
        ctx.drawImage(Resources.get('images/star.png'), 310, 510,40,68);

        ctx.font="30px Combo";
        ctx.fillText("x"+this.score,348,565);
    }

    survived() {
        this.score+=1;
        resetBugs();
        rock.placement();
        star.placement();
        this.x=2*101;
        this.y=4*83-10;
    }

    died() {
              //move player back to starting postion
        //reset bugs?
        //update lives / score / etc

        this.x=2*101;
        this.y=4*83-10;
        if (this.livesLeft===0) {
            if (this.gems > 0) {
                this.gems-=1;
                //keep playing
            } else {
                //game over - whatever that means
            }
        } else {
            this.livesLeft-=1;
        }

        resetBugs();
        rock.placement();

        //call method to update lives - should be closed over - maybe it's this method
    }

    update() {
                console.log("player update still being called");
     }

     contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }

    handleInput(key) {
        switch(key) {
            case 'left':
                this.dir=-1;
                if (!(this.x===0) && !(rock.contact(this,'h'))) {

                    if (star.contact(this,'h')) {
                        player.survived();
                    } else {
                    this.x-=101;
                    }
                }
                break;

            case 'up':
                this.dir=-1;
                if (!(this.y<=0) && !(rock.contact(this,'v'))){

                if (star.contact(this,'v')) {
                        player.survived();
                    } else {
                    this.y-=83;
                    }
                }
                break;

            case 'right':
                this.dir=1;
                if (!(this.x===404) && !(rock.contact(this,'h'))) {

                    if (star.contact(this,'h')) {
                        player.survived();
                    } else {
                    //console.log()
                    this.x+=101;
                    }
                }
                break;

            case 'down':
            this.dir=1;
            if (!(this.y>3*83) && !(rock.contact(this,'v'))) {
                this.y+=83;
            }
        }
    }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//var allEnemies=[];

initPieces(3);

// number of enemies = easy = 3 medium=5 hard=5+faster

// function initBugs(num=3) {
//     var allEnemies=[];

//     for(let i=0; i<num; i++) {
//         let enemyObj=new Bugs('images/enemy-bug.png');
//         allEnemies.push(enemyObj);
//         enemyObj.reset();
//     }
// }

function resetBugs() {
    allEnemies.map(bug => bug.reset());
}

function initPieces(bugNum=3) {
    //bugs
    for(let i=0; i<bugNum; i++) {
        let enemyObj=new Bugs('images/enemy-bug.png');
        allEnemies.push(enemyObj);
        enemyObj.reset();
    }

    //player
    player=new Player('images/char1.png',202,322);
    //other pieces
    rock=new Rock();  //placement needs to be called before it shows up
    rock.placement();
    star=new Star();
    star.placement();
    //console.log(star.x+"/"+star.y);
    gem=new Gem();
    gem.x=-100;
    gem.y=0;
    gem.dir=0;
}




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
