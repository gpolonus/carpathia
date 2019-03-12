package malg.game;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.config.GameConfig;
import game.player.Player;
import game.space.Space;
import malg.event.move.DecideMove;
import malg.event.move.DoMove;
import malg.event.space.MalgSpaceReact;
import malg.player.MalgPlayer;

public class MalgGame extends Game {

	public MalgGame(GameConfig gameConfig) throws Exception {
		super();
		preTurnEventList.add(new DecideMove());
		preTurnEventList.add(new DoMove());
		
		turnEventList.add(new MalgSpaceReact());
	}

	@Override
	public JSONObject getSendString() {
		JSONObject extraInfo = new JSONObject();
		JSONObject boardJSON = new JSONObject();
		JSONArray playersJSON = new JSONArray();
		try{
			for(Space s : Game.board){
				JSONObject spaceJSON = new JSONObject();
				spaceJSON.put("id", s.id);
				spaceJSON.put("x", s.x);
				spaceJSON.put("y", s.y);
				JSONArray nbsJSON = new JSONArray();
//				neighbors
				for(Space nb : s){
					nbsJSON.put(nb.id);
				}
				spaceJSON.put("nbs", nbsJSON);
				boardJSON.put(""+s.id, spaceJSON);
			}
			
			for(Player p : Game.players){
				JSONObject playerJSON = new JSONObject();
				playerJSON.put("name", p.name);
				playerJSON.put("num", p.num);
				playerJSON.put("color", p.color);
				playerJSON.put("space", ((MalgPlayer)p).space.id);
				playersJSON.put(playerJSON);
			}
			
			extraInfo.put("board", boardJSON);
			extraInfo.put("players", playersJSON);
		} catch(JSONException e){
			e.printStackTrace();
		}
		return extraInfo;
	}
}
