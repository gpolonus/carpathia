package game;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import game.board.Board;
import game.config.GameConfig;
import game.end.WinTest;
import game.event.GameEvent;
import game.event.GameEventList;
import game.event.end.WinningSend;
import game.event.startup.StartAlert;
import game.player.Player;
import game.player.list.PlayerIterator;
import game.space.Space;
import util.ColorUtil;

public abstract class Game
{
	public static List<Player> players = new LinkedList<Player>();
	public static Player activePlayer;

	public static boolean started = false;
	
	public static Map<String, GameEvent> allEvents = new HashMap<String, GameEvent>();
	
	private static GameEvent firstEvent;
	
	protected static WinTest winTest;
	
	protected static PlayerIterator pi;
	
	// needed for the eventual game start timer
//	public static boolean readying = false;
	
	public static String sendString;
	
	public static Board board;
	
	protected GameConfig gameConfig;
	
	public Game() throws Exception
	{
		sendString = "";
		board = GameConfig.makeNewBoard();
		pi = GameConfig.makePlayerIterator();
		winTest = GameConfig.makeWinTest();
//		((StartAlert)GameEventList.getEvent("startAlert")).setGame(this);
	}

	public static void determinePlayerRandomColors()
	{
		double startAngle = Math.random() * Math.PI * 2;
		for(int i = 0; i < players.size(); i++)
		{
			players.get(i).color = new ColorUtil((double)(startAngle + Math.PI*2/players.size() * i));
		}
	}

	public static void start()
	{
		if(Game.started){
			activePlayer = pi.getFirstPlayer(Game.activePlayer);
			turnStart();
		}
	}

	public static void turnStart()
	{
		Game.activePlayer = pi.getNextPlayer(Game.activePlayer);
		Game.firstEvent.preExecute();
	}


	public void tellEveryoneElse(int num, String str)
	{
		for(int i = 0; i < players.size(); i++)
			if(num != i)
				players.get(i).send(str);
	}

	public static void dontTellActive(String str)
	{
		for(int i = 0; i < players.size(); i++)
			if(activePlayer.num != i)
				players.get(i).send(str);
	}

	public void turnEnd()
	{
		activePlayer = players.get((activePlayer.num + 1) % players.size());
		// needs winning condition
		turnStart();
	}

	public static Space randomSpace()
	{
		return board.get((int)(Math.random() * board.size()));
	}

	public JSONObject getSendString() {
		JSONObject extraInfo = new JSONObject();
		JSONArray boardJSON = new JSONArray();
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
				boardJSON.put(spaceJSON);
			}
			
			for(Player p : Game.players){
				JSONObject playerJSON = new JSONObject();
				playerJSON.put("name", p.name);
				playerJSON.put("num", p.num);
				playerJSON.put("color", p.color);
				playersJSON.put(playerJSON);
			}
			
			extraInfo.put("board", boardJSON);
			extraInfo.put("board", playersJSON);
		} catch(JSONException e){
			e.printStackTrace();
		}
		return extraInfo;
	}
	
//	public String getSendStr()
//	{
//		sendString = "start~{\"board\":[";
//
//		// adding board spaces
//		for(int i = 0; i < board.size(); i++)
//		{
//			// add basic info
//			sendString += "{\"type\":\"" + board.get(i).type + "\"," + 
//				"\"id\":" + board.get(i).id + "," + 
//				"\"x\":" + board.get(i).x + "," + 
//				"\"y\":" + board.get(i).y + ", \"nbs\":[";
//
//			// add the ids of the neighbors
//			for(Integer k : board.get(i).nbs.keySet())
//			{
//				sendString += k + ",";
//			}
//
//			sendString = sendString.substring(0,sendString.length()-1) + "]},";
//
//		}
//
//		// adding players
//		sendString = sendString.substring(0,sendString.length()-1) + "],\"players\":[";
//
//		for(int i = 0; i < players.size(); i++)
//		{
//			sendString += "{\"name\":\"" + players.get(i).name + "\",\"num\":" + players.get(i).num + ",\"color\":\"" + players.get(i).color + "\",\"space\": " + players.get(i).space.id + " },";
//		}
//		sendString = sendString.substring(0,sendString.length()-1) + "]}";
//
//		return sendString;
//	}
}