package malg.space;

import game.player.Player;
import game.space.Space;
import malg.event.player.PlayerKilled;
import malg.player.MalgPlayer;

public class MalgSpace extends Space {

	MalgPlayer playerOn;
	
	public MalgSpace(int id, int x, int y){
		super(id, x, y);
	}
	
	@Override
	public void react(Player player) {
		if(playerOn != null){
			playerOn.kill();
			(new PlayerKilled(playerOn)).preExecute();
		}
		playerOn = (MalgPlayer)player;
	}
	
	public void setPlayerOn(MalgPlayer p){
		playerOn = p;
	}

}
