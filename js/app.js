'use strict';
var allBugs=[];
var rock,
    player,
    gem,
    star;
var gameLevel=1;

//game entities are built from this
class Entity {
    constructor(x=0,y=0,speed=0,sector=0,sprite="",dir=1) {
        this.sprite=sprite;
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.dir=dir;  //1=left to right -1=right to left direction
        this.leftOffset=0; //negative number
        this.rightOffset=0;//positive number
        this.bounce=false;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    //check for contact with other objects
    contact(movingObject,vector) {
        let offset = (movingObject.dir>0) ? movingObject.leftOffset : movingObject.rightOffset;
        switch(vector) {
            case 'h':  //left or right
                if (Math.abs(movingObject.y-this.y)<=17) {  //in same row (y's align)
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
    constructor(x,y,leftOffset,rightOffset,sprite='images/rock.png') {
        super(x,y,leftOffset,rightOffset,sprite);
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x+10, this.y+20, 80,136);
    }

    placement() {
        this.y=rndNumbers(1,4)*83-19;  //random row 2-4
        this.x=rndNumbers(1,4)*101;    //random col 2-4
    }
}

class Star extends Entity {
    constructor(x,y,leftOffset,rightOffset,sprite='images/star.png') {
        super(x,y,leftOffset,rightOffset,sprite);
    }

    placement() {
        this.y=0-10;  // -10 aligns star in the grid
        this.x=rndNumbers(0,5)*101;    //random col 1-5
    }
}

class Bugs extends Entity {
    constructor(x,y,speed,leftOffset,rightOffset,bounce,sprite='images/enemy-bug.png',dir) {
        super(x,y,speed,leftOffset,rightOffset,bounce,sprite,dir);
        this.leftOffset=-15;
        this.rightOffset=15;
    }

    update(dt) {
        this.x+=(Math.floor(this.speed*(dt*100)))*this.dir;
        //check if bug has recently bounced off of rock.  This prevents
        //the bug from being caught by the rock.
        if (!(this.bounce)) {
            if (rock.contact(this,'h')) {
                this.dir=this.dir*-1;
                this.bounce=true;
            }
        }
        //check for contact with player
        if (player.contact(this,'h')) {
            player.died();
        }

        switch(this.dir) {
            case 1:
                if (this.x > 505) {
                    this.reset();
                    this.makeGem();
                }
                this.sprite='images/enemy-bug.png';  //right facing sprite
                break;
            case -1:
                if (this.x < -110) {
                    this.reset();
                    this.makeGem();
                }
                this.sprite='images/enemy-bug-l.png';  //left facing sprite
        }
    }

    //10% percent chance everytime a bug exits the grid that a gem will be
    //generated.  Once generated, the gem stays until caught.
    makeGem() {
        if (rndNumbers(0,10)===2 && !(gem.active) && (player.livesLeft<5)) {
            gem.sprite='images/gem'+rndNumbers(1,4)+'.png';
            gem.active=true;
            gem.reset();
        }
    }

    //resets sprite (bug and gem) location when it leave the grid (moves it to the other side).
    reset() {
        switch(this.dir){
            case 1:
                this.x=-110;
                this.y=63+(rndNumbers(0,3)*83);
                this.speed= rndNumbers(100,(gameLevel+1)*100)/100;
                break;
            case -1:
                this.x=550;
                this.y=63+(rndNumbers(0,3)*83);
                this.speed= rndNumbers(100,(gameLevel+1)*100)/100;
                break;
            default:
                this.dir=1;
                this.reset();
        }
        this.bounce=false;
    }
}

class Gem extends Bugs {
    constructor(x,y,speed,leftOffset,rightOffset,bounce,sprite,dir) {
        super(x,y,speed,leftOffset,rightOffset,bounce,sprite,dir);
        this.active=false;
        this.leftOffset=-53;
        this.rightOffset=15;
        this.x=-100;
        this.y=0;
        this.dir=0;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y+38,65,111);
    }

    update(dt) {
        if (this.active) {
            this.x+=(Math.floor(this.speed*(dt*100)))*this.dir;
            if (!(this.bounce)) {
                if (rock.contact(this,'h')) {
                    this.dir=this.dir*-1;
                    this.bounce=true;
                }
            }
            if (player.contact(this,'h')) {
                player.gems+=1;
                player.livesLeft+=1;
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
    }
}

class Player extends Entity {
    constructor(x,y,leftOffset,rightOffset,sprite) {
       super(x,y,leftOffset,rightOffset,sprite);
        this.livesLeft=3;
        this.score=0;
        this.gems=0;
        this.totalTurns=0;
    }

    render() {
        super.render();
        ctx.font="30px Combo";
        //render level sprite
        ctx.drawImage(Resources.get('images/smiley'+gameLevel+'sm.png'), 28, 543);
        //render player and turns
        ctx.drawImage(Resources.get(this.sprite), 110, 512,50,85);
        ctx.fillText("x"+this.livesLeft,153,581);
        //render gems
        ctx.drawImage(Resources.get('images/gem1.png'), 218, 533,30,51);
        ctx.fillText("x"+this.gems,253,581);
        //render score
        ctx.drawImage(Resources.get('images/star.png'), 310, 526,40,68);
        ctx.fillText("x"+this.score,353,581);
        //render options menu sprite
        ctx.drawImage(Resources.get('images/burger.png'),450,547, 40, 40);
    }

    //collected a star!  Reset grid
    survived() {
        this.score+=1;
        resetBugs();
        rock.placement();
        star.placement();
        gem.reset();
        this.x=2*101;
        this.y=4*83-10;
    }

    died() {  //made contact with a bug  Reset grid
        this.x=2*101;
        this.y=4*83-10;
        this.livesLeft-=1;
        this.totalTurns+=1;
        if (this.livesLeft===0) {
            gameOver();
        } else {
            gem.reset();
            resetBugs();
            rock.placement();
        }
    }

    //handle the key inputs
    handleInput(key) {
        switch(key) {
            case 'left':
                this.dir=-1;
                //can't move left if left-most col or if rock in the way

                if (this.x!==0 && !(rock.contact(this,'h'))) {
                    if (star.contact(this,'h')) {
                        player.survived();
                    } else {
                    this.x-=101;
                    }
                }
                break;

            case 'up':
                this.dir=-1;
                //can't move up if in top row or rock in the way
                if (this.y>0 && !(rock.contact(this,'v'))){
                    if (star.contact(this,'v')) {
                        player.survived();
                    } else {
                    this.y-=83;
                    }
                }
                break;

            case 'right':
                this.dir=1;
                //can't move right if in right-most col or if rock in the way
                if (this.x!==404 && !(rock.contact(this,'h'))) {
                    if (star.contact(this,'h')) {
                        player.survived();
                    } else {
                    this.x+=101;
                    }
                }
                break;

            case 'down':
            this.dir=1;
            //can't move down if in bottom row or rock in the way
            if (this.y<=3*83 && !(rock.contact(this,'v'))) {
                this.y+=83;
            }
        }
    }
}

function resetBugs() {
    allBugs.map(bug => bug.reset());
}

function initPieces(sprite='images/char1.png') {
    allBugs=[];
    for(let i=0, bugNum=gameLevel+2; i<bugNum; i++) {
        let newBug=new Bugs('images/enemy-bug.png');
        allBugs.push(newBug);
        newBug.reset();
    }

    player=new Player(202,322,0,0,sprite);
    rock=new Rock();
    rock.placement();
    star=new Star();
    star.placement();
    gem=new Gem();
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
});

//adds listener for menu option click
document.addEventListener('click', function(e) {
    let pos=getMousePos(e);
    if ((pos.x>445 && pos.x<510) && (pos.y>545 && pos.y<590)){
        gameOptions();
    }
    //get mouse pos relative to canvas
    function getMousePos(e) {
        let rect=document.getElementsByTagName('canvas')[0].getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY -rect.top
        };
    }
});

//generate random numbers
function rndNumbers(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

//this interacts with the Start Game modal
function startGame() {
    let modal=document.getElementById('startModal');
    let startGameButton=document.querySelectorAll('#startModal #start')[0];
    modal.style.display="block";

    startGameButton.onclick=function() {
        modal.style.display="none";
        initPieces();
    };

    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
            initPieces();
            }
        };
}

//this interacts with the Game Options modal
function gameOptions() {
    let modal=document.getElementById('optionsModal');
    modal.style.display="block";

    setRadios('level',gameLevel);
    setRadios('charlist',player.sprite);

    function setRadios(rbName,rbCurrent) {
        let radios=document.getElementsByName(rbName);
        for (let i=0,length=radios.length; i<length; i++) {
            radios[i].checked = (radios[i].value==rbCurrent) ? true : false;
        }
    }

    //accept changes when OK button is clicked
    let okButton=document.querySelectorAll('#optionsModal #ok')[0];
    okButton.onclick=function() {
        modal.style.display="none";
        gameLevel=parseInt(getRadios('level'));
        initPieces(getRadios('charlist'));

        function getRadios(rbName) {
            let radios=document.getElementsByName(rbName);
            for (let i=0,length=radios.length;  i<length; i++) {
                if (radios[i].checked===true) {
                    return(radios[i].value);
                }
            }
        }
    };

    //cancel any changes
    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
        }
    };
}

function gameOver() {
    let modal=document.getElementById('overModal');

    modal.style.display="block";

    for(let i=1; i<5; i++){
        if (player.sprite==='images/char'+i+'.png') {
            document.getElementById('turns_sprite').src='images/char'+i+'sm.png';
            break;
        }
    }

    let msgStart = ['Awesome Game!','Cool Moves!','Great Job!','Well Done!'];
    document.getElementById('over_msg').innerHTML=msgStart[rndNumbers(0,msgStart.length)]+"<br/>But, you've run out of turns.";
    let statMsg = player.score===1 ? " star collected." : " stars collected.";
    document.getElementById('star_count').innerHTML=player.score+statMsg;
    statMsg = player.gems===1 ? " gem collected." : " gems collected.";
    document.getElementById('gem_count').innerHTML=player.gems+statMsg;
    document.getElementById('turns_count').innerHTML=player.totalTurns+" turns played.";

    let gameOverButton=document.querySelectorAll('#overModal #again')[0];
    gameOverButton.onclick=function() {
        modal.style.display="none";
        //start game
        initPieces();
    };

    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
            //start game
            initPieces();
        }
    };
}

initPieces();
document.body.onload=startGame();