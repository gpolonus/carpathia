package websocket.gamesocket;

import java.util.LinkedList;

public class Board
{
	private Space head;
	public LinkedList<Player> players;
	private final int sideNum = 8;

	public void makeBoard()
	{
		head = new Space("start", new LinkedList<Space>(), new LinkedList<Space>());
		Space temp = head;
		for(int i = 0; i < sideNum; i++)
		{
			temp.next.push(new Space(
				randomType(),
				[],
				[temp],
				temp.x + spaceWidth,
				temp.y
			));
			spacesArray.push(temp.next);
			temp = temp.next[0];
		}
		for(int i = 0; i < sideNum; i++)
		{
			temp.next.push(new Space(
				randomType(),
				[],
				[temp],
				temp.x,
				temp.y + spaceWidth
			));
			spacesArray.push(temp.next);
			temp = temp.next[0];
		}
		for(int i = 0; i < sideNum; i++)
		{
			temp.next.push(new Space(
				randomType(),
				[],
				[temp],
				temp.x - spaceWidth,
				temp.y
			));
			spacesArray.push(temp.next);
			temp = temp.next[0];
		}
		for(int i = 0; i < sideNum - 1; i++)
		{
			temp.next.push(new Space(
				randomType(),
				[],
				[temp],
				temp.x,
				temp.y - spaceWidth
			));
			spacesArray.push(temp.next);
			temp = temp.next[0];
		}
		temp.next.push(this.head);

		for(int i = 0; i < 6; i++)
		{
			spacesArray[Math.round(sideNum*2/3 * i)][0].type = "start";
			spacesArray[(Math.round(sideNum*2/3 * i) + Math.round(sideNum/3))%(sideNum*4)][0].type = "carpathia";
		}

		function randomType()
		{
			var val = Math.round(Math.random()*4);
			switch(val)
			{
				case 0:
					return "green";
				break;
				case 1:
					return "red";	
				break;
				case 2:
					return "white";	
				break;
				case 3:
					return "blue";	
				break;
				case 4:
					return "penalty";	
				break;
				// case 5:
				// 	return "carpathia";	
				// break;	
			}
		}
	}
	makeBoard();

	this.makeNewPlayer = function(num, name)
	{
		// need to know num via server
		// will get instantiated and called upon opening of the socket
		// that.players.push(new Player(num, name));
		that.players[num] = new Player(num, name);
	}

	function getOtherPlayers()
	{
		// get the other players already in the room
		// wont actually be needed because once the websocket is opened we can send all the existing player info to the person that just entered
	}

	// get the start space at the specified number
	this.getStart = function(num)
	{
		return spacesArray[Math.round(sideNum*2/3 * num)][0];
	}
}