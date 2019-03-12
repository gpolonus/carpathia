package game.player;

import javax.websocket.Session;

import game.Game;
import game.socket.GameSocket;
import game.space.Space;
import util.ColorUtil;

public abstract class Player
{
	public int num;
	public String name;
	public int tokens;
	public boolean ready;
	public Session session;
	public ColorUtil color;
	public static int count = 0;

	public Player(Session ses)
	{
		tokens = 0;
		ready = false;
		session = ses;
		num = count++;
	}

	@Override
	public boolean equals(Object o)
	{
		return ((Player)o).num == num;
	}

	public void send(String str)
	{
		try{
			session.getBasicRemote().sendText(str);
		} catch(Exception e) {
			GameSocket.log.error("SHITS FUCKED YO");
		}
	}

	public void sendWithNum(String str)
	{
		try{
			session.getBasicRemote().sendText(str + "~" + num + "~");
		} catch(Exception e) {
			GameSocket.log.error("SHITS FUCKED YO");
		}
	}
	

	// // puts a roll animation on the screen and rolls dice
	// this.roll = function()
	// {
	// 	var roll = Math.round(Math.random()*5) + 1;
	// 	Chat.socket.send("rolled~" + roll + "~");
	// 	// this.move(roll);
	// }

	// this.move = function(roll)
	// {
	// 	if(roll == 0) {
	// 		this.react();
	// 	} else if(this.space.next.length > 1){
	// 		// might add asking functionality for multiple paths
	// 		ask();
	// 	} else{
	// 		this.space = this.space.next[0];
	// 		this.drawMove(roll-1);
	// 	}
	// }

	// // this.drawTokens = function(num)
	// // {
	// // 	color == undefined ? board.playerColors[this.num] : board.playerColors[num];
	// // }

	// this.react = function()
	// {
	// 	// if(activePlayer.num == clientNum)
	// 	this.space.react();
	// }

	// this.drawMove = function(movesLeft)
	// {
	// 	board.drawBoard(that.num);
	// 	var dist = utiLib.distance(that.x, that.y, that.space.x, that.space.y);
	// 	if(dist < 2){
	// 		that.x = that.space.x;
	// 		that.y = that.space.y;
	// 		that.drawPlayer();
	// 		that.move(movesLeft);
	// 	}
	// 	else{
	// 		that.x += (that.space.x - that.x)/dist*2;
	// 		that.y += (that.space.y - that.y)/dist*2;
	// 		that.drawPlayer();
	// 		setTimeout(that.drawMove, 1, movesLeft);
	// 	}
	// }

	// this.drawPlayer = function(num)
	// {
	// 	num = num == undefined ? this.num : num;
	// 	ctx.drawImage(this.image, this.x - spaceWidth*0.4, this.y - spaceWidth*0.4, spaceWidth*0.8, spaceWidth*0.8);
	// }
}