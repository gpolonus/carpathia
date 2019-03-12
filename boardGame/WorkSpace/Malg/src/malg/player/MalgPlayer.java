package malg.player;

import javax.websocket.Session;

import game.player.Player;
import game.space.Space;

public class MalgPlayer extends Player {

	public Space space;
	
	public MalgPlayer(Session ses) {
		super(ses);
		// TODO Auto-generated constructor stub
	}
	
	private boolean playing = true;
	
	public void kill(){
		playing = false;
	}
	
	public boolean isPlaying(){
		return playing;
	}
	
	public void react(){
		space.react(this);
	}

}
