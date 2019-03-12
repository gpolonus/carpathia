package game.config;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.websocket.Session;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.board.Board;
import game.end.WinTest;
import game.player.Player;
import game.player.list.PlayerIterator;
import game.space.Space;
import util.JsonArray;
import util.JsonObject;

public class GameConfig {
	
	private static JsonObject configs = null;
	
	public GameConfig(){
//		not sure if this is the right path
		try {
			configs = new JsonObject(new String(Files.readAllBytes(Paths.get("../lib/configs.json")), "UTF-8"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		if(configs == null){
			System.exit(0);
		}
	}
	
	public Game makeNewGame() throws Exception{
		String type = configs.getString("gameType");
		return (Game)getConfiguredType(type);
	}
	
	public Player makeNewPlayer(Session session) throws Exception{
		String type = configs.getString("playerType");
		return (Player)getConfiguredType(type);
	}
	
	public static Board makeNewBoard() throws Exception{
		String type = configs.getString("boardType");
		return (Board)getConfiguredType(type);
	}
	
	public static Space makeNewSpace() throws Exception{
		String type = configs.getString("spaceType");
		return (Space)getConfiguredType(type);
	}

	public static PlayerIterator makePlayerIterator() throws Exception{
		String type = configs.getString("PlayerIteratorType");
		return (PlayerIterator)getConfiguredType(type);
	}

	public static WinTest makeWinTest() throws Exception{
		String type = configs.getString("winTestType");
		return (WinTest)getConfiguredType(type);
	}
	
	public static Object getConfiguredType(String type) throws Exception{
		try {
			return (Game)Class.forName(type).getConstructor().newInstance();
		} catch (InstantiationException | IllegalAccessException | IllegalArgumentException | InvocationTargetException
				| NoSuchMethodException | SecurityException | ClassNotFoundException e) {
			e.printStackTrace();
			throw new Exception("Game type: " + type + " could not be used to make a new game");
		}
	}
	
	public void makeEvents() throws JSONException{
		JsonArray eventsJSON = configs.getArray("events");
		for(Object event : eventsJSON){
			JsonObject eventJSON = new JsonObject((JSONObject)event);
			
		}
	}
}
