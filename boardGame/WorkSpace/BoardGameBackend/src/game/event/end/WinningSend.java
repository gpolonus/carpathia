package game.event.end;

import java.util.List;

import org.json.JSONObject;

import game.event.GameEvent;
import game.player.Player;
import util.TheBestUtils;

public class WinningSend extends GameEvent {

	private Player p;
	
	public WinningSend(Player p){
		
	}
	
	@Override
	protected boolean postExecuteAction(JSONObject returnMessage) {
		return false;
	}

	@Override
	public String getHandle() {
		return "winningAlert";
	}

	@Override
	public List<Player> getPlayersAffected() {
		return TheBestUtils.onePlayeList(p);
	}

	@Override
	public JSONObject getExtraInfo() {
		return null;
	}

}
