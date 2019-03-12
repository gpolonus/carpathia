package game.event.startup;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.event.GameEvent;
import game.player.Player;

public class ReadyUpEvent extends GameEvent {

	@Override
	protected JSONObject preExecuteAction(JSONObject currentMessage) {
		return currentMessage;
	}

	@Override
	protected boolean postExecuteAction(JSONObject returnMessage) {
		try {
			Game.players.get(Integer.parseInt(returnMessage.getJSONObject("extraInfo").getString("fromPlayer"))).ready = true;
		} catch (NumberFormatException | JSONException e) {
			e.printStackTrace();
		}
		for(Player p : Game.players){
			if(!p.ready){
				Game.started = false;
				return true;
			}
		}
		Game.started = true;
		return true;
	}

	@Override
	public String getHandle() {
		return "readyUp";
	}

	@Override
	public JSONObject getExtraInfo() {
		return null;
	}

	private Player playerAffected;
	
	public void setPlayer(Player p){
		playerAffected = p;
	}
	
	@Override
	public List<Player> getPlayersAffected() {
		List<Player> players = new ArrayList<Player>();
		players.add(playerAffected);
		return players;
	}

}
