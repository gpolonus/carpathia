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
package websocket.gamesocket;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;

import util.HTMLFilter;

@ServerEndpoint(value = "/websocket/game2")
public class GameSocket {

	public static final Log log = LogFactory.getLog(GameSocket.class);
	private int CLIENT_NUM;
	private static Game game;
	private static boolean allReady = false;

	public GameSocket() {
		log.debug("Constructing the game socket.");
		if(game == null)
		{
			log.debug("Making the game object.");
			game = new Game();
		}
	}

	@OnOpen
	public void start(Session session) {
		// denial of all entries made after the game starts
		if(allReady){
			try{
				session.getBasicRemote().sendText("refusal~");
				session.close();
				return;
			}catch(Exception e){
				return;
			}
		}
		Player temp = new Player(session);
		game.players.add(temp);
		print("Added player " + temp.num);
		temp.send("clientNum~" + temp.num + "~");
		CLIENT_NUM = temp.num;
		String message = String.format("* %s %s", "someone", "has joined.");
		broadcast(message);
	}

	@OnClose
	public void end() {
		String name = game.players.remove(CLIENT_NUM).name;
		String message = String.format("* %s %s",
				name, "has disconnected.");
		broadcast(message);
	}

	@OnMessage
	public void incoming(String message) {
		String msg = HTMLFilter.filter(message.toString());
		log.debug(msg);
		print(msg);
		String[] args = msg.split("~");
		switch(args[0])
		{
			case "newPlayer":
				game.players.get(Integer.parseInt(args[1])).name = args[2];

				// add game started condition
				if(game.players.size() > 1) {
					// for late entries
					for(Player p : game.players){
						p.ready = false;
					}
					boolean cont = true;
					for(Player p : game.players){
						if(p.name == null){
							cont = false;
						} else{
							p.send("notReady~");
						}
					}
					if(cont){
						broadcast("ready~");
					}
				}
				else if(game.players.size() == 1){
					game.players.get(0).send("notReady~");
				}
			break;

			case "ready":
				// broadcast("ready~"+CLIENT_NUM+"~");
				game.players.get(Integer.parseInt(args[1])).ready = true;
				
				// check that all the players are ready
				for(Player p : game.players)
				{
					if(!p.ready)
						return;
				}

				// use the ready boolean for ready start, so we have to make them all false
				for(Player p : game.players)
				{
					p.ready = false;
				}
				allReady = true;
				game.determinePlayerColors();
				broadcast(game.getSendStr());
			break;

			case "finishStart":
				game.players.get(Integer.parseInt(args[1])).ready = true;
				for(Player p : game.players)
				{
					if(!p.ready)
						return;
				}
				game.start();
			break;

			case "rolled":
				game.givenRoll(Integer.parseInt(args[1]));
			break;

			case "direction":
				game.givenDirection(Integer.parseInt(args[1]), Integer.parseInt(args[2]));
			break;

			case "moved":
				game.doneMoving(Integer.parseInt(args[1]));
			break;

			case "turnEnd":
				game.turnEnd();
			break;

			case "greenCard":
				// greenCard = greenCards.getCard();
				// // broadcast("greenCard~" + args[1] + "~" + greenCard.question + "~" + greenCard.answers.get(0) + "~" + greenCard.answers.get(1) + "~" + greenCard.answers.get(2) + "~" + greenCard.answers.get(3) + "~");
				// String[] answers = greenCard.getRandomAnswers();
				// tellMe("greenCard~" + args[1] + "~" + greenCard.question + "~" + answers[0] + "~" + answers[1] + "~" + answers[2] + "~" + answers[3] + "~");
			break;

			case "redCard":
				// redCard = redCards.getCard();
				// broadcast("redCard~" + args[1] + "~" + redCard.question + "~");
			break;

			case "greenCardAnswer":
				// if(greenCard.getRandomedAnswer(args[1])){
				// 	broadcast("asdf~" + args[3] + " got the question right!");
				// 	broadcast("getTokens~" + args[2] + "~" + 2 + "~");
				// 	broadcast("rollAgain~" + args[2] + "~");
				// }
				// else {
				// 	broadcast("asdf~" + args[3] + " got the question wrong!");
				// 	broadcast("loseTokens~" + args[2] + "~" + 1 + "~");
				// 	tellMe("turnEnd~" + args[2] + "~");
				// }
			break;

			default:
				broadcast(msg);
		}
	}

	@OnError
	public void onError(Throwable t) throws Throwable {
		log.error("Chat Error: " + t.toString(), t);
	}

	public static void broadcast(String msg) {
		for (Player p : game.players) {
			try {
				synchronized (p) {
					p.session.getBasicRemote().sendText(msg);
				}
			} catch (IOException e) {
				log.debug("Chat Error: Failed to send message to client", e);
				game.players.remove(p.num);
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
		System.out.println("TellMe Called: " + game.players.size());
		try {
			synchronized (this) {
				game.players.get(CLIENT_NUM).session.getBasicRemote().sendText(msg);
			}
		} catch (IOException e) {
			log.debug("Chat Error: Failed to send message to client", e);
			game.players.remove(CLIENT_NUM);
			try {
				game.players.get(CLIENT_NUM).session.close();
			} catch (IOException e1) {
				// Ignore
			}
			String message = String.format("* %s %s",
					game.players.get(CLIENT_NUM).name, "has been disconnected.");
			broadcast(message);
		}
	}

	public static void print(String str)
	{
		System.out.println(str);
	}
}