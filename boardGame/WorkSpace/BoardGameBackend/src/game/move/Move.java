package game.move;

import game.event.GameEvent;

public abstract class Move extends GameEvent{
	
	public String getHandle(){
		return "move";
	}
}
