package game.space;

import java.util.Iterator;

import game.player.Player;

public class SimpleSpace extends Space {

	public SimpleSpace(){
		super();
	}
	
	public SimpleSpace(int id, int x, int y){
		super(id, x, y);
	}

	@Override
	public void react(Player player) {
		
	}
}
