package malg.event.move;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.event.GameEvent;
import game.player.Player;
import game.space.Space;
import malg.player.MalgPlayer;
import malg.space.MalgSpace;

public class DoMove extends GameEvent {

	public static Space nextSpace;
	
	@Override
	public JSONObject preExecuteAction(JSONObject currentMessage) {
		try {
			currentMessage.put("nextSpace", nextSpace.id);
			currentMessage.put("activePlayer", Game.activePlayer.num);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return currentMessage;
	}

	@Override
	public boolean postExecuteAction(JSONObject returnMessage) {
		MalgPlayer player = ((MalgPlayer)Game.activePlayer);
		((MalgSpace)player.space).setPlayerOn(null);
		player.space = nextSpace;
		return false;
	}

	@Override
	public String getHandle() {
		return "doMove";
	}

	private Player playerAffected;
	
	public void setPlayer(Player p){
		playerAffected = p;
	}
	
	@Override
	public List<Player> getPlayersAffected() {
		List<Player> players = new ArrayList<Player>();
		if(playerAffected == null){
			players.add(Game.activePlayer);
		} else{
			players.add(playerAffected);
			playerAffected = null;
		}
		return players;
	}

	@Override
	public JSONObject getExtraInfo() {
		// TODO Auto-generated method stub
		return null;
	}

}
