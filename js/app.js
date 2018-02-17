var allEnemies=[];
var gameLevel=1;

//game entities are built from this
class Entity {
    constructor(sprite="",x=0,y=0,speed=0,dir=1,sector=0) {
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
        if (this.constructor.name==='Rock') {
            ctx.drawImage(Resources.get(this.sprite), this.x+10, this.y+20, 80,136);
        } else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }

    contact(movingObject,vector) {  //v or h
        let offset;
        (movingObject.dir>0) ? offset=movingObject.leftOffset : offset=movingObject.rightOffset;
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
    constructor(sprite='images/rock.png',x,y,leftOffset,rightOffset) {
        super(sprite,x,y,leftOffset,rightOffset);
    }

    render() {
        super.render();
    }

    placement() {
        this.y=rndNumbers(1,4)*83-19  //random row 2-4
        this.x=rndNumbers(1,4)*101    //random col 2-4
        //this.isRock=true;
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
        this.x=rndNumbers(0,5)*101    //random col 1-5
    }

    contact(movingObject,vector) {
        return(super.contact(movingObject,vector));
     }
}

class Bugs extends Entity {
    constructor( sprite='images/enemy-bug.png',x,y,speed,dir,leftOffset,rightOffset,bounce) {
        super(sprite,x,y,speed,dir,leftOffset,rightOffset,bounce);
        this.leftOffset=-15;
        this.rightOffset=15;
    }

    render() {
        super.render();
    }

    update(dt) {
        this.x+=(Math.floor(this.speed*(dt*100)))*this.dir;
        if (!(this.bounce)) {
            if (rock.contact(this,'h')) {
                this.dir=this.dir*-1;
                this.bounce=true;
            }
        }

        (player.contact(this,'h')) ? player.died() : false;

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
        if (rndNumbers(0,10)===2 && !(gem.active) && (player.livesLeft<5)) {
            gem.sprite='images/gem'+rndNumbers(1,4)+'.png';
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
    constructor(sprite,x,y,speed,dir,leftOffset,rightOffset,bounce) {
        super(sprite,x,y,speed,dir,leftOffset,rightOffset,bounce);
        //this.dir=1;
        this.active=false;
        this.leftOffset=-53;
        this.rightOffset=15;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y+38,65,111);;
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
                console.log("gemx: "+gem.x);
                console.log("gemy: "+gem.y);
                console.log("playerx: "+player.x);
                console.log("playery: "+player.y);
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
        this.gems=0;
        this.totalTurns=0;
    }

    render() {
        super.render();
        ctx.font="30px Combo";
        ctx.drawImage(Resources.get('images/smiley'+gameLevel+'sm.png'), 28, 543);
        ctx.drawImage(Resources.get(this.sprite), 110, 512,50,85);
        ctx.fillText("x"+this.livesLeft,153,581);
        ctx.drawImage(Resources.get('images/gem1.png'), 218, 533,30,51);
        ctx.fillText("x"+this.gems,253,581);
        //render score
        ctx.drawImage(Resources.get('images/star.png'), 310, 526,40,68);
        ctx.fillText("x"+this.score,353,581);
        ctx.drawImage(Resources.get('images/burger.png'),450,547, 40, 40);
    }

    survived() {
        this.score+=1;
        resetBugs();
        rock.placement();
        star.placement();
        gem.reset();
        this.x=2*101;
        this.y=4*83-10;
    }

    died() {
        this.x=2*101;
        this.y=4*83-10;
        this.livesLeft-=1;
        this.totalTurns+=1;
        if (this.livesLeft===0) {
            gameOver();
        }
        gem.reset();
        resetBugs();
        rock.placement();
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



function resetBugs() {
    allEnemies.map(bug => bug.reset());
}

function initPieces(sprite='images/char1.png') {
    let bugNum=gameLevel+2;
    player=new Player(sprite,202,322);
    //bugs
    allEnemies=[];
    for(let i=0; i<bugNum; i++) {
        let enemyObj=new Bugs('images/enemy-bug.png');
        allEnemies.push(enemyObj);
        enemyObj.reset();
    }
    rock=new Rock();
    rock.placement();
    star=new Star();
    star.placement();

    delete gem;
    gem=new Gem();
    gem.x=-100;
    gem.y=0;
    gem.dir=0;
}


initPieces();

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

document.addEventListener('click', function(e) {
    if (e.clientX>440 && e.clientY>540) {
        gameOptions();
    }

    }
);

function rndNumbers(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

function gameOptions() {
    let modal=document.getElementById('optionsModal');
    let okButton=document.querySelectorAll('#optionsModal #ok')[0];
    modal.style.display="block";

    checkRadios('level',gameLevel);
    checkRadios('charlist',player.sprite);

    function checkRadios(rbName,rbCurrent) {
        let radios=document.getElementsByName(rbName);
        for (let i=0,length=radios.length;  i<length; i++) {
            if (radios[i].value==rbCurrent) {
                radios[i].checked=true;
            } else {
                radios[i].checked=false;
            }
        }
    }

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
    }

    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
            }
        }
}

function startGame() {
    let modal=document.getElementById('startModal');
    let startGameButton=document.querySelectorAll('#startModal #start')[0];
    modal.style.display="block";

    startGameButton.onclick=function() {
        modal.style.display="none";
        initPieces();
    }

    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
            initPieces();
            }
        }
}

function gameOver() {
    let modal=document.getElementById('overModal');
    let gameOverButton=document.querySelectorAll('#overModal #again')[0];

    modal.style.display="block";

    for(let i=1; i<5; i++){
        if (player.sprite==='images/char'+i+'.png') {
            document.getElementById('turns_sprite').src='images/char'+i+'sm.png';
            break;
        }
    }


    let msgStart = ['Awesome Game!','Cool Moves!','Great Job!','Well Done!'];
    //let modalMsg=msgStart[rndNumbers(0,msgStart.length)]+"  But, you've run out of turns.";
    document.getElementById('over_msg').innerHTML=msgStart[rndNumbers(0,msgStart.length)]+"<br/>But, you've run out of turns.";


    document.getElementById('star_count').innerHTML=player.score+" stars collected.";


    document.getElementById('gem_count').innerHTML=player.gems+" gems collected.";




    document.getElementById('turns_count').innerHTML=player.totalTurns+" total turns played.";



    gameOverButton.onclick=function() {
        modal.style.display="none";
        initPieces();
    }

    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
            //start game
            initPieces();
            }
        }
}

document.body.onload=startGame();