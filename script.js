window.onload = function()
{
  var canvasWidth = window.innerWidth - 60;
  var canvasHeight = window.innerHeight - 150;
  var blockSize = 30;
  var ctx;
  var delay = 100;
  var xCoord = 0;
  var yCoord = 0;
  var snakee;
  var applee;
  var widthInBlocks = Math.trunc(canvasWidth/blockSize);
  canvasWidth = widthInBlocks * blockSize;
  var heightInBlocks = Math.trunc(canvasHeight/blockSize);
  canvasHeight = heightInBlocks * blockSize;
  var score;
  var isDead;

  init();

  function init()
  {

  var canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.border = "17px solid #2352ff";
  canvas.style.margin = "50px auto";
  canvas.style.display = "block";
  canvas.style.backgroundColor = "#f2f2f2";
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  snakee = new snake([[6,3], [5,3],[4,3], [3,3]], "right");
  applee = new apple([18,6]);
  score = 0;
  refreshCanvas();
  }

  function refreshCanvas()
  {
    snakee.advance();

    if(snakee.checkCollision())
    {
        gameOver();
    }
    else {
      {
        if(snakee.isEatingApple(applee))
        {
             score++;
              snakee.ateApple = true;
              do
              {
              applee.setNewPosition();
              }
              while(applee.isOnSnake(snakee))
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.draw();
        applee.draw();
        drawScore();
        setTimeout(refreshCanvas,delay);
    }
    }

  }
      function gameOver()
      {
        ctx.save();

        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 6;
        ctx.strokeText("GAME OVER", 420, 240);
        ctx.fillText("GAME OVER", 420, 240);
        ctx.font = "bold 28px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", 300, 275)
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", 300, 275)
        ctx.restore();
      }
  function restart()
  {
    snakee = new snake([[6,3], [5,3], [4,3], [3,3]], "right");
    applee = new apple([18,6]);
    score = 0;
    isDead = 0;
    refreshCanvas();
  }

  function drawScore()
  {
    ctx.save();
    ctx.font = "bold 65px sans-serif";
    ctx.fillStyle = "#ff751a";
    ctx.fillText(score.toString(), 5, canvasHeight - 5 );
    ctx.restore();
  }

  function drawBlock(ctx, position)
  {
      var x = position[0] * blockSize;
      var y = position[1] * blockSize;
      ctx.fillRect(x,y, blockSize, blockSize);
  }

  function snake(body, direction)
  {
      this.body = body;
      this.direction = direction;
      this.ateApple = false;
      this.draw = function()
      {
        ctx.save();
        ctx.fillStyle = "#FF0000";
        for(var i = 0; i < this.body.length; i++)
        {
          drawBlock(ctx, this.body[i]);
        }
        ctx.restore();

      };
      this.advance= function()
      {
        var nextPosition = this.body[0].slice();
         switch(this.direction)
         {
           case "left":
          nextPosition[0] -= 1;
             break;
         case "right":
         nextPosition[0] += 1;
             break;
         case "down":
         nextPosition[1] += 1;
             break;
         case "up":
         nextPosition[1] -= 1;
             break;
             default:
             throw("Invalid Direction");



         }
         this.body.unshift(nextPosition);
         if(!this.ateApple)
            this.body.pop();
        else
            this.ateApple = false;
      };
      this.setDirection = function(newDirection)
      {
        var allowedDirections
        switch (this.direction)
        {
          case "left":
          case "right":
            allowedDirections = ["up","down"];
            break;
          case "down":
          case "up":
            allowedDirections = ["left","right"];
            break;
          default:
              throw("Invalid Direction");
        }
        if(allowedDirections.indexOf(newDirection) > -1)
        {
               this.direction = newDirection;
        }

      };
      this.checkCollision = function()
      {
         var wallCollision = false;
         var snakeCollision = false;
         var head = this.body[0];
         var rest = this.body.slice(1);
         var snakeX = head[0];
         var snakeY = head[1];
         var minX = 0;
         var minY = 0;
         var maxX = widthInBlocks - 1;
         var MaxY = heightInBlocks - 1;
         var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
         var isNotBetweenVerticalWalls = snakeY < minY || snakeY > MaxY;

         if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
         {
            wallCollision = true;
            isDead = 1;
         }
         for(var i = 0; i < rest.length ; i++)
         {
            if(snakeX === rest[i][0] && snakeY === rest[i][1] )
            {
              snakeCollision = true;
              isDead = 1;
            }
         }
         return wallCollision || snakeCollision;
      };
      this.isEatingApple = function(appleToEat)
      {
         var head = this.body[0];
         if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
         {
           beep();
           return true;
         }
         else
            return false;
      };
}

function beep() {
    var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

function apple(position)
{
  this.position = position;
  this.draw = function()
  {
    ctx.save();
    ctx.fillStyle = "#33cc33";
    ctx.beginPath();
    var radius = blockSize/2;
    var x = this.position[0]*blockSize + radius;
    var y = this.position[1]*blockSize + radius;
    ctx.arc(x,y, radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.restore();
   };
   this.setNewPosition = function()
   {
     var newX = Math.round(Math.random() * (widthInBlocks - 1));
     var newY = Math.round(Math.random() * (heightInBlocks - 1));
     this.position = [newX, newY];
   };
   this.isOnSnake = function(snakeToCheck)
   {
     var isOnSnake =  false;
     for(var i = 0 ; i < snakeToCheck.body.length; i++)
     {
       if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
       {
          isOnSnake = true;
       }
     }
     return isOnSnake;

   };

}


document.onkeydown = function handleKeyDown(e)
{
    var key = e.keyCode;
    var newDirection;
    switch (key)
  {
  case 65:
  case 37:
      newDirection = "left"
      break;
  case 87:
  case 38:
      newDirection = "up"
      break;
  case 68:
  case 39:
      newDirection = "right"
      break;
  case 83:
  case 40:
      newDirection = "down"
      break;
  case 32:
if (isDead == 1) {
  delete snakee;
  restart();
}

     return;
    default:
      return;


    }
    snakee.setDirection(newDirection);

}

}
