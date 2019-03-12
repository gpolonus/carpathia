package game.event.space;

import java.util.List;

import org.json.JSONObject;

import game.Game;
import game.event.GameEvent;
import game.player.Player;
import util.TheBestUtils;

public abstract class SpaceReact extends GameEvent {
	
	@Override
	public String getHandle() {
		return "spaceReact";
	}

	@Override
	public List<Player> getPlayersAffected() {
		return TheBestUtils.onePlayeList(Game.activePlayer);
	}

	@Override
	public JSONObject getExtraInfo() {
		return null;
	}

}
