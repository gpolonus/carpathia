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
// import java.util.Set;
// import java.util.concurrent.CopyOnWriteArraySet;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;

import java.util.Random;

import util.HTMLFilter;

@ServerEndpoint(value = "/websocket/game")
public class GameSocket {

	private static final Log log = LogFactory.getLog(GameSocket.class);

	private static final String GUEST_PREFIX = "Guest";
	private static final AtomicInteger connectionIds = new AtomicInteger(0);
	private static final List<GameSocket> connections = new ArrayList<GameSocket>();

	private String playerName;
	private int playerNum;
	private Session session;

	private GreenCards greenCards;
	private RedCards redCards;

	private RedCard redCard;
	private GreenCard greenCard;

	private Random rand;

	public GameSocket() {
		greenCards = new GreenCards();
		redCards = new RedCards();
		rand = new Random();
	}

	@OnOpen
	public void start(Session session) {
		this.session = session;
		String message = String.format("* %s %s", "someone", "has joined.");
		broadcast(message);
	}


	@OnClose
	public void end() {
		connections.remove(this.playerNum);
		String message = String.format("* %s %s",
				this.playerName, "has disconnected.");
		broadcast(message);
	}


	@OnMessage
	public void incoming(String message) {
		// Never trust the client
		// String filteredMessage = String.format("%s: %s",
		// playerName, HTMLFilter.filter(message.toString()));
		// broadcast(filteredMessage);
		String msg = HTMLFilter.filter(message.toString());
		String[] args = msg.split("~");
		switch(args[0])
		{
			case "newPlayer":
				this.playerName = args[1];
				this.playerNum = connectionIds.getAndIncrement();
				connections.add(this);
				// if(connections.size() == 1)
				// 	return;
				tellEveryoneElse("otherNewPlayers~" + this.playerName + '|' + this.playerNum + '~');
				String str = "otherNewPlayers~";
				for(GameSocket client : connections)
				{
					print(args[1] + " != " +client.playerName);
					if(client.playerNum != this.playerNum)
					{
						str += client.playerName + '|' + client.playerNum + '~';
					}
				}
				tellMe(str);
			break;

			case "ready":
				broadcast("ready~"+this.playerNum+"~");
			break;

			case "rolled": case "askAnnoy": case "annoy": case "start": case "yourTurn":
				broadcast(msg);
			break;

			case "greenCard":
				print("greenCard Show Start");
				greenCard = greenCards.getCard();
				// broadcast("greenCard~" + args[1] + "~" + greenCard.question + "~" + greenCard.answers.get(0) + "~" + greenCard.answers.get(1) + "~" + greenCard.answers.get(2) + "~" + greenCard.answers.get(3) + "~");
				String[] answers = greenCard.getRandomAnswers();
				tellMe("greenCard~" + args[1] + "~" + greenCard.question + "~" + answers[0] + "~" + answers[1] + "~" + answers[2] + "~" + answers[3] + "~");
				broadcast("greenCardShow~" + args[1] + "~" + greenCard.question + "~" + answers[0] + "~" + answers[1] + "~" + answers[2] + "~" + answers[3] + "~");
				print("greenCard Show End");
			break;

			case "redCard":
				redCard = redCards.getCard();
				broadcast("redCard~" + args[1] + "~" + redCard.question + "~");
			break;

			case "greenCardAnswer":
				if(greenCard.getRandomedAnswer(args[1])){
					broadcast("greenCardAnswer~" + args[3] + " selected \"" + args[1] + "\" and got the question right!");
					broadcast("getTokens~" + args[2] + "~" + 2 + "~");
					broadcast("rollAgain~" + args[2] + "~");
				}
				else {
					broadcast("greenCardAnswer~" + args[3] + " selected \"" + args[1] + "\" and got the question wrong!");
					broadcast("loseTokens~" + args[2] + "~" + 1 + "~");
					tellMe("turnEnd~" + args[2] + "~");
				}
			break;

			default:
				broadcast(msg);
		}
	}




	@OnError
	public void onError(Throwable t) throws Throwable {
		log.error("Chat Error: " + t.toString(), t);
	}


	private static void broadcast(String msg) {
		for (GameSocket client : connections) {
			try {
				synchronized (client) {
					client.session.getBasicRemote().sendText(msg);
				}
			} catch (IOException e) {
				log.debug("Chat Error: Failed to send message to client", e);
				connections.remove(client);
				try {
					client.session.close();
				} catch (IOException e1) {
					// Ignore
				}
				String message = String.format("* %s %s",
						client.playerName, "has been disconnected.");
				broadcast(message);
			}
		}
	}

	private void tellEveryoneElse(String msg)
	{
		for (GameSocket client : connections) {
			System.out.println("tellEveryoneElse: " + client.playerName + "; with message: " + msg);
			try {
				if(client.playerNum != playerNum)
					synchronized (client) {
						client.session.getBasicRemote().sendText(msg);
					}
			} catch (IOException e) {
				log.debug("Chat Error: Failed to send message to client", e);
				connections.remove(client);
				try {
					client.session.close();
				} catch (IOException e1) {
					// Ignore
				}
				String message = String.format("* %s %s",
						client.playerName, "has been disconnected.");
				broadcast(message);
			}
		}
	}

	private void tellMe(String msg)
	{
		System.out.println("TellMe Called: " + connections.size());
		try {
			synchronized (this) {
				this.session.getBasicRemote().sendText(msg);
			}
		} catch (IOException e) {
			log.debug("Chat Error: Failed to send message to client", e);
			connections.remove(this);
			try {
				this.session.close();
			} catch (IOException e1) {
				// Ignore
			}
			String message = String.format("* %s %s",
					this.playerName, "has been disconnected.");
			broadcast(message);
		}
	}

	private static void print(String str)
	{
		System.out.println(str);
	}
}