package websocket.gamesocket;

public class Space
{
	public String type;
	public LinkedList<Space> next;
	public LinkedList<Space> prev;
	public int topToken;

	public Space(String typ, LinkedList<Space> n, LinkedList<Space> p)
	{
		type = t;
		next = n;
		prev = p;
		topToken = -1;
	}

	public void placeTopToken(int num)
	{
		if(topToken == -1)
			topToken = num;
	}

	public void react(Player activePlayer)
	{
		switch(type)
		{
			case "green":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "green" + "space.");
				addToLogger(str + " landed on a " + "green" + "space.");
			break;
			case "red":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "red" + "space.");
				addToLogger(str + " landed on a " + "red" + "space.");
			break;
			case "white":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "white" + "space.");
				addToLogger(str + " landed on a " + "white" + "space.");
			break;
			case "blue":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "blue" + "space.");
				addToLogger(str + " landed on a " + "blue" + "space.");
			break;
			case "black":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "black" + "space.");
				addToLogger(str + " landed on a " + "black" + "space.");
			break;
			case "start":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "start" + "space.");
				addToLogger(str + " landed on a " + "start" + "space.");
			break;
			case "penalty":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "penalty" + "space.");
				addToLogger(str + " landed on a " + "penalty" + "space.");
			break;
			case "carpathia":
				if(activePlayer.num == clientNum)
					str = "You";
				else
					str = activePlayer.name;
				// alert(str + " landed on a " + "carpathia" + "space.");
				addToLogger(str + " landed on a " + "carpathia" + "space.");
			break;
		}
		turnEnd();
	}


}