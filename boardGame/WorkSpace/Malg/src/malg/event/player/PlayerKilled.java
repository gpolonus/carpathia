package malg.event.player;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import game.event.GameEvent;
import game.player.Player;

public class PlayerKilled extends GameEvent {

	protected Player playerKilled;
	
	public PlayerKilled(Player player){
		playerKilled = player;
	}
	
	@Override
	protected JSONObject preExecuteAction(JSONObject currentMessage) {
		// TODO Auto-generated method stub
		return currentMessage;
	}

	@Override
	protected boolean postExecuteAction(JSONObject returnMessage) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String getHandle() {
		return "killed";
	}

	@Override
	public List<Player> getPlayersAffected() {
		List<Player> onePlayer = new ArrayList<Player>();
		onePlayer.add(playerKilled);
		return null;
	}

	@Override
	public JSONObject getExtraInfo() {
		// TODO Auto-generated method stub
		return null;
	}

}
