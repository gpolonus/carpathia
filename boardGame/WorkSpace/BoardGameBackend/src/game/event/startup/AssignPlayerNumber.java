package game.event.startup;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.event.GameEvent;
import game.event.GameEventList;
import game.player.Player;

public class AssignPlayerNumber extends GameEvent {

	@Override
	protected JSONObject preExecuteAction(JSONObject currentMessage) {
		return currentMessage;
	}

	@Override
	protected boolean postExecuteAction(JSONObject returnMessage) {
		try {
			Integer fromPlayer = Integer.parseInt(returnMessage.getString("fromPlayer"));
			Game.players.get(fromPlayer).name = returnMessage.getJSONObject("extraInfo").getString("name");
			ReadyUpEvent readyUp = (ReadyUpEvent)GameEventList.getEvent("readyup");
			readyUp.setPlayer(Game.players.get(fromPlayer));
		} catch (JSONException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	@Override
	public String getHandle() {
		return "assignNum";
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

	@Override
	public JSONObject getExtraInfo() {
		return null;
	}

}
