package websocket.gamesocket;

import java.util.Random;
import java.util.List;
import java.util.LinkedList;
import java.util.HashMap;
import websocket.gamesocket.cards.*;

import util.GriffColor;

public class Game
{
	public static List<Player> players = new LinkedList<Player>();
	public static Player activePlayer;

	private static GreenCards greenCards = new GreenCards();
	private static RedCards redCards = new RedCards();

	private static RedCard redCard;
	private static GreenCard greenCard;

	public static boolean started = false;

	// needed for the eventual game start timer
	public static boolean readying = false;

	// needed for sending the board infor to the front end
	public static String sendString;

	// contains all of the spaces in the game
	private static HashMap<Integer, Space> board = new HashMap<Integer, Space>();

	public Game()
	{
		sendString = "";
		if(board.size() == 0)
		{
			GameSocket.log.debug("Setting up the board. NO ONE ELSE SHOULD DO THIS!");
			
			// make the board super fun later but really lame now

			// set up info for the circle map
			Random rand = new Random();
			int total = 20;
			int radius = (int)(total*70/2/Math.PI);

			// set up loop
			Space temp = new Space();
			temp.setLocation(radius, 0);
			board.put(0, temp);
			
			for(int i = 1; i < total; i++)
			{
				temp.addNB(new Space());
				temp = temp.nbs.get(Space.getCount()-1);
				board.put(temp.id, temp);
				temp.setLocation((int)(Math.cos(Math.PI*2/total * i)*radius), (int)(Math.sin(Math.PI*2/total * i)*radius));
			}
			board.get(0).addNB(temp);
			temp = board.get(0);
			Space nextTemp;
			for(int i = 1; i < 8; i++)
			{
				nextTemp = new Space();
				nextTemp.setLocation(radius - radius/4 * i, 0);
				board.put(nextTemp.id, nextTemp);
				temp.addNB(nextTemp);
				GameSocket.print(temp.x + "; " + temp.y);
				temp = nextTemp;
			}
			temp.addNB(board.get((int)total/2));

			// Space temp;
			// for(int i = 0; i < 40; i++)
			// {
			// 	temp = new Space((int)(Math.random()*1000), (int)(Math.random()*1000));
			// 	board.put(temp.id, temp);
			// }
			// for(Integer i : board.keySet())
			// {
			// 	board.get(i).addNB(board.get((int)(Math.random()*40)));
			// 	board.get(i).addNB(board.get((int)(Math.random()*40)));
			// 	board.get(i).addNB(board.get((int)(Math.random()*40)));
			// }
		}
	}

	public String getSendStr()
	{
		sendString = "start~{\"board\":[";

		// adding board spaces
		for(int i = 0; i < board.size(); i++)
		{
			// add basic info
			sendString += "{\"type\":\"" + board.get(i).type + "\"," + 
				"\"id\":" + board.get(i).id + "," + 
				"\"x\":" + board.get(i).x + "," + 
				"\"y\":" + board.get(i).y + ", \"nbs\":[";

			// add the ids of the neighbors
			for(Integer k : board.get(i).nbs.keySet())
			{
				sendString += k + ",";
			}

			sendString = sendString.substring(0,sendString.length()-1) + "]},";

			// // add the coordinates of the corners
			// sendString = sendString.substring(0,sendString.length()-1) + "],\"corners\":[";
			// sendString += "{\"x\":" + board.get(i).corners.get(0).x + ",\"y\":" + board.get(i).corners.get(0).y + "},";
			// for(int j = 1; j < board.get(i).corners.size(); j++)
			// {
			// 	sendString += "{\"x\":" + board.get(i).corners.get(j).x + ",\"y\":" + board.get(i).corners.get(j).y + "}";
			// 	if(j != board.get(i).corners.size() - 1)
			// 		sendString += ",";
			// }
			// sendString += "]},";
		}

		// adding players
		sendString = sendString.substring(0,sendString.length()-1) + "],\"players\":[";

		for(int i = 0; i < players.size(); i++)
		{
			sendString += "{\"name\":\"" + players.get(i).name + "\",\"num\":" + players.get(i).num + ",\"color\":\"" + players.get(i).color + "\",\"space\": " + players.get(i).space.id + " },";
		}
		sendString = sendString.substring(0,sendString.length()-1) + "]}";

		return sendString;
	}

	public GreenCard getGreenCard()
	{
		return greenCards.getCard();
	}

	public void determinePlayerColors()
	{
		double startAngle = Math.random() * Math.PI * 2;
		for(int i = 0; i < players.size(); i++)
		{
			players.get(i).color = new GriffColor((double)(startAngle + Math.PI*2/players.size() * i));
		}
	}

	public void start()
	{
		// GameSocket.broadcast("alert~FUCK YEAH~");
		activePlayer = players.get(0);
		turnStart();
	}

	public void turnStart()
	{
		activePlayer.send("startRoll~" + activePlayer.num + "~");
		dontTellActive("isRolling~" + activePlayer.num + "~");
	}

	public void givenRoll(int rollNum)
	{
		dontTellActive("hasRolled~" + activePlayer.num + "~" + rollNum + "~");
		activePlayer.send("whereMove~" + rollNum + "~");
	}

	public void givenDirection(int nextSpaceNum, int rollNum)
	{
		List<Integer> path = new LinkedList<Integer>();
		Space prevSpace = activePlayer.space;
		activePlayer.space = activePlayer.space.nbs.get(nextSpaceNum);
		path.add(activePlayer.space.id);
		rollNum--;
		while(rollNum > 0)
		{
			if(activePlayer.space.nbs.size() == 2)
			{
				for(Integer i : activePlayer.space.nbs.keySet())
				{
					if(prevSpace.id != i)
					{
						prevSpace = activePlayer.space;
						activePlayer.space = activePlayer.space.nbs.get(i);
						path.add(activePlayer.space.id);
						rollNum--;
						break;
					}
				}
			}
			else
			{
				break;
			}
		}
		String pathString = "";
		for(int i = 0; i < path.size(); i++)
		{
			pathString += "+" + path.get(i);
		}
		GameSocket.broadcast("moveTo~" + activePlayer.num + "~" + rollNum + "~" + pathString.substring(1) + "~");
	}

	public void doneMoving(int rollNum)
	{
		if(rollNum > 0 && activePlayer.space.nbs.size() != 2)
		{
			dontTellActive("hasRolled~" + activePlayer.num + "~" + rollNum + "~");
 			activePlayer.send("whereMove~" + rollNum + "~");
		}
		else
		{
			boolean onSameSpace;
			Player temp = activePlayer;
			do
			{
				onSameSpace = false;
				for(int i = 0; i < players.size(); i++)
				{
					if(activePlayer.space == players.get(i).space && activePlayer != players.get(i))
					{
						int tempId = activePlayer.space.nbs.keySet().iterator().next();
						activePlayer.space = board.get(tempId);
						// should put same space fight in here
						activePlayer.send("moveTo~" + activePlayer.num + "~" + 1 + "~" + tempId + "~");
						onSameSpace = true;
					}
				}
			}
			while(onSameSpace);
			activePlayer.space.react(activePlayer);
		}
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

	// public void turnStart()
	// {
	// }

	// public void turnEnd()
	// {
	// 	activePlayer = board.players[(activePlayer.num + 1)%(board.players.length())];
	// 	if(!winning())
	// 		turnStart();
	// 	else
	// 		displayWinner();
	// }

	// public boolean winning()
	// {
	// 	return false;
	// }

	// public void addToLogger(String str)
	// {
	// 	// $(logHolder).html("<p>" + str + "</p>" + $(logHolder).html());
	// }

	// private Space head;
	// public LinkedList<Player> players;
	// private final int sideNum = 8;

	// public void makeBoard()
	// {
	// 	head = new Space("start", new LinkedList<Space>(), new LinkedList<Space>());
	// 	Space temp = head;
	// 	for(int i = 0; i < sideNum; i++)
	// 	{
	// 		temp.next.push(new Space(
	// 			randomType(),
	// 			[],
	// 			[temp],
	// 			temp.x + spaceWidth,
	// 			temp.y
	// 		));
	// 		spacesArray.push(temp.next);
	// 		temp = temp.next[0];
	// 	}
	// 	for(int i = 0; i < sideNum; i++)
	// 	{
	// 		temp.next.push(new Space(
	// 			randomType(),
	// 			[],
	// 			[temp],
	// 			temp.x,
	// 			temp.y + spaceWidth
	// 		));
	// 		spacesArray.push(temp.next);
	// 		temp = temp.next[0];
	// 	}
	// 	for(int i = 0; i < sideNum; i++)
	// 	{
	// 		temp.next.push(new Space(
	// 			randomType(),
	// 			[],
	// 			[temp],
	// 			temp.x - spaceWidth,
	// 			temp.y
	// 		));
	// 		spacesArray.push(temp.next);
	// 		temp = temp.next[0];
	// 	}
	// 	for(int i = 0; i < sideNum - 1; i++)
	// 	{
	// 		temp.next.push(new Space(
	// 			randomType(),
	// 			[],
	// 			[temp],
	// 			temp.x,
	// 			temp.y - spaceWidth
	// 		));
	// 		spacesArray.push(temp.next);
	// 		temp = temp.next[0];
	// 	}
	// 	temp.next.push(this.head);

	// 	for(int i = 0; i < 6; i++)
	// 	{
	// 		spacesArray[Math.round(sideNum*2/3 * i)][0].type = "start";
	// 		spacesArray[(Math.round(sideNum*2/3 * i) + Math.round(sideNum/3))%(sideNum*4)][0].type = "carpathia";
	// 	}

	// 	function randomType()
	// 	{
	// 		var val = Math.round(Math.random()*4);
	// 		switch(val)
	// 		{
	// 			case 0:
	// 				return "green";
	// 			break;
	// 			case 1:
	// 				return "red";	
	// 			break;
	// 			case 2:
	// 				return "white";	
	// 			break;
	// 			case 3:
	// 				return "blue";	
	// 			break;
	// 			case 4:
	// 				return "penalty";	
	// 			break;
	// 			// case 5:
	// 			// 	return "carpathia";	
	// 			// break;	
	// 		}
	// 	}
	// }
	// makeBoard();

	// this.makeNewPlayer = function(num, name)
	// {
	// 	// need to know num via server
	// 	// will get instantiated and called upon opening of the socket
	// 	// that.players.push(new Player(num, name));
	// 	that.players[num] = new Player(num, name);
	// }

	// function getOtherPlayers()
	// {
	// 	// get the other players already in the room
	// 	// wont actually be needed because once the websocket is opened we can send all the existing player info to the person that just entered
	// }

	// // get the start space at the specified number
	// this.getStart = function(num)
	// {
	// 	return spacesArray[Math.round(sideNum*2/3 * num)][0];
	// }
}