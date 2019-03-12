/*
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *	  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package game.socket;

import java.io.IOException;
import java.util.List;

import javax.websocket.Session;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.config.GameConfig;
import game.event.GameEvent;
import game.event.GameEventList;
import game.event.startup.AssignPlayerNumber;
import game.event.startup.ReadyUpEvent;
import game.event.startup.StartAlert;
import game.player.Player;

public abstract class GameSocket{

	public static final Log log = LogFactory.getLog(GameSocket.class);
	private int CLIENT_NUM;
	protected static Game game;
	private static JSONObject refusalMessage = new JSONObject();
	public GameEventList startGameEventList = new GameEventList();
	static{
		try {
			refusalMessage.put("handle", "refusal");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		GameEventList.addEvent(new AssignPlayerNumber());
	}

	protected static GameConfig gameConfig;
	
	public GameSocket(GameConfig gameConfig) throws Exception {
		log.debug("Constructing the game socket.");
		GameSocket.gameConfig = gameConfig;
		if(game == null)
		{
			log.debug("Making the game object.");
			game = gameConfig.makeNewGame();
//			startGame events since these largely wont change, hopefully
			startGameEventList.add(new AssignPlayerNumber());
			startGameEventList.add(new ReadyUpEvent());
			startGameEventList.add(new StartAlert(game));
		}
	}
	
	public void open(Session session) throws Exception {
		// denial of all entries made after the game starts
		if(Game.started){
			try{
				session.getBasicRemote().sendText("{'refusal':true}");
				session.close();
				return;
			}catch(Exception e){
				e.printStackTrace();
				return;
			}
		}
		Player temp = gameConfig.makeNewPlayer(session);
		Game.players.add(temp);
		print("Added player " + temp.num);
		AssignPlayerNumber apn = (AssignPlayerNumber)GameEventList.getEvent("assignNum");
		apn.setPlayer(temp);
		startGameEventList.fireEvents();
		CLIENT_NUM = temp.num;
//		String message = String.format("* %s %s", "someone", "has joined.");
//		broadcast(message);
	}

	public void end() {
		String name = Game.players.remove(CLIENT_NUM).name;
		String message = String.format("* %s %s",
				name, "has disconnected.");
		broadcast(message);
	}
	
	public abstract void incoming(String message);
	
	protected void defaultIncoming(String message) throws Exception{
		JSONObject messageJSON = null;
		try {
			messageJSON = new JSONObject(message);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		if(messageJSON == null){
			String error = "Received JSON was bad: " + message;
			print(error);
			throw new Exception(error);
		}
		
		GameEvent event = GameEventList.allEvents.get(messageJSON.getString("handle")); 
		if(event != null && event.acting()){
			event.postExecute(messageJSON);
		}
	}

	public void onError(Throwable t) throws Throwable {
		log.error("Chat Error: " + t.toString(), t);
	}

	public static void broadcast(String msg) {
		for (Player p : Game.players) {
			try {
				synchronized (p) {
					p.session.getBasicRemote().sendText(msg);
				}
			} catch (IOException e) {
				log.debug("Chat Error: Failed to send message to client", e);
				Game.players.remove(p.num);
				try {
					p.session.close();
				} catch (IOException e1) {
					// Ignore
				}
				String message = String.format("* %s %s", p.name, "has been disconnected.");
				broadcast(message);
			}
		}
	}

	private void tellMe(String msg)
	{
		System.out.println("TellMe Called: " + Game.players.size());
		try {
			synchronized (this) {
				Game.players.get(CLIENT_NUM).session.getBasicRemote().sendText(msg);
			}
		} catch (IOException e) {
			log.debug("Chat Error: Failed to send message to client", e);
			Game.players.remove(CLIENT_NUM);
			try {
				Game.players.get(CLIENT_NUM).session.close();
			} catch (IOException e1) {
				// Ignore
			}
			String message = String.format("* %s %s",
					Game.players.get(CLIENT_NUM).name, "has been disconnected.");
			broadcast(message);
		}
	}

	public static void print(String str)
	{
		System.out.println(str);
	}

	public static void send(JSONObject sending, List<Player> playersAffected) {
		JSONObject actionSending = new JSONObject();
		String actionString = null;
		JSONObject alerting = new JSONObject();
		String alertingString = null;
		try {
			actionSending.put("handle", sending);
			actionString = actionSending.toString();
			alerting.put("alert", sending);
			alertingString = alerting.toString();
		} catch (JSONException e) {
			e.printStackTrace();
		}
		for(Player p : Game.players){
			if(playersAffected.contains(p)){
				p.send(actionString);
			} else{
				p.send(alertingString);
			}
		}
	}
}