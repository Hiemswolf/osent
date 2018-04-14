var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var itemCounter = 0;
var lastUpdate = new Date().getTime();

var bullets = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  socket.on('createChar', function() {
    itemCounter++;
    socket.number = itemCounter;
    io.emit('loadNewChar', socket.number);
  });
  
  socket.on('createBullet', function(player) {
    itemCounter++;
          
    var bullet = createSprite(itemCounter, player.x + player.w / 2, player.y + player.h / 2, 5, 5);
    bullet.angle = player.angle;    
          
    /*var element = document.createElement("div");
    element.className = "bullet";
    element.id = itemCounter;
    element.style.left = '-50px';
    element.style.top = '-50px';
    element.style.transform = "rotate(" + bullet.angle + "deg)";
    document.getElementById('bulletContainer').appendChild(element);
          */
    bullets[bullets.length] = bullet;
  });
            
  socket.on('playerInfo', function(val, x , y, angle) {
    io.emit('showPlayer', val, x, y, angle);
  });
  
  socket.on('disconnect', function() {
    
  });
});


function Update() {
  if(lastUpdate + 40 <= new Date().getTime()) {
    io.emit('loop', bullets);
    
    lastUpdate = new Date().getTime();
  }
  setTimeout(function() {Update();}, 2);
}

Update();

http.listen(port, function(){
  console.log('listening on *:' + port);
});
