package game.event.startup;

import java.util.List;

import org.json.JSONObject;

import game.Game;
import game.event.GameEvent;
import game.player.Player;

public class StartAlert extends GameEvent {

	protected Game game;
	protected int playerCount = 0;
	
	public StartAlert(Game game){
		this.game = game;
	}
	
	@Override
	protected boolean startCondition(){
		return Game.started;
	}
	
	@Override
	protected JSONObject preExecuteAction(JSONObject currentMessage) {
		Game.determinePlayerRandomColors();
		return currentMessage;
	}

	@Override
	protected boolean postExecuteAction(JSONObject returnMessage) {
		if(playerCount++ == Game.players.size()){
			Game.start();
		}
		return true;
	}

	@Override
	public String getHandle() {
		return "startAlert";
	}

	@Override
	public List<Player> getPlayersAffected() {
		return Game.players;
	}

	@Override
	public JSONObject getExtraInfo() {
		return game.getSendString();
	}
	
	public void setGame(Game game){
		this.game = game;
	}

}
