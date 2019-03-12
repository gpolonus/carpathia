package malg.event.move;

import java.util.LinkedList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.event.GameEvent;
import game.player.Player;
import game.space.Space;
import malg.player.MalgPlayer;

public class DecideMove extends GameEvent {

	@Override
	public JSONObject preExecuteAction(JSONObject currentMessage) {
		List<String> potentialSpaces = new LinkedList<String>();
		MalgPlayer activePlayer = (MalgPlayer)Game.activePlayer;
		for(Integer nbId : activePlayer.space.nbs.keySet()){
			Space nb = activePlayer.space.nbs.get(nbId);
			potentialSpaces.add(((Integer)nb.id).toString());
		}
		
		try {
			currentMessage.put("potentialSpaces", potentialSpaces);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return currentMessage;
	}

	@Override
	public boolean postExecuteAction(JSONObject returnMessage) {
		
		String nextSpace = null;
		try {
			nextSpace = (String) returnMessage.get("nextSpace");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		if(nextSpace != null){
			DoMove.nextSpace = Game.board.get(Integer.parseInt(nextSpace));
		}
		
		return false;
	}

	@Override
	public String getHandle() {
		return "decideMove";
	}

	@Override
	public List<Player> getPlayersAffected() {
		List<Player> activePlayer = new LinkedList<Player>();
		activePlayer.add(Game.activePlayer);
		return activePlayer;
	}

	@Override
	public JSONObject getExtraInfo() {
		// TODO Auto-generated method stub
		return null;
	}

}
