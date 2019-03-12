package malg.event.space;

import org.json.JSONObject;

import game.Game;
import game.event.space.SpaceReact;
import malg.player.MalgPlayer;

public class MalgSpaceReact extends SpaceReact {
	
	@Override
	protected JSONObject preExecuteAction(JSONObject currentMessage){
		((MalgPlayer)Game.activePlayer).react();
		return currentMessage;
	}
	
	@Override
	protected boolean postExecuteAction(JSONObject returnMessage) {
		// TODO Auto-generated method stub
		return false;
	}

}
