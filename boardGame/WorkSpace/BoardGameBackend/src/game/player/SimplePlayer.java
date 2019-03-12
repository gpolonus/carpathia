package game.player;

import javax.websocket.Session;

import game.Game;
import game.space.Space;

public class SimplePlayer extends Player {

	public Space space;
	
	public SimplePlayer(Session ses) {
		super(ses);
		space = Game.randomSpace();
	}
	
	public void move(Space space){
		this.space = space;
	}

}
