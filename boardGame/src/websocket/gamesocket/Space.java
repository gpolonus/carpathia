package websocket.gamesocket;

import java.util.HashMap;
import java.util.LinkedList;
import java.awt.Point;

public class Space
{
	public SpaceType type;
	public HashMap<Integer, Space> nbs;
	public Player topToken;
	// the count of all the spaces in the game. used for making ids
	private static int count = 0;
	public int id;
	public int x;
	public int y;
	public LinkedList<SpaceCorner> corners = new LinkedList<SpaceCorner>();

	public Space(SpaceType typ, HashMap<Integer, Space> n)
	{
		type = typ;
		nbs = n;
		id = count++;
	}

	public Space(SpaceType typ)
	{
		this(typ, new HashMap<Integer, Space>());
		// x and y get generated inside the necessary triangle
	}

	public Space(int typ)
	{
		this(SpaceType.fromInt(typ));
	}

	public Space(int x, int y)
	{
		nbs = new HashMap<Integer, Space>();
		id = count++;
		type = SpaceType.fromInt(id%6);
		setLocation(x, y);
	}

	public Space()
	{
		this(SpaceType.fromInt(0));
		type = SpaceType.fromInt(id%6);
	}

	public void addNB(Space s)
	{
		nbs.put(s.id, s);
		s.nbs.put(id, this);
		// Point midpoint = new Point((int)((x+s.x)/2), (int)((y+s.y)/2));
		// double midpointAngle = SpaceCorner.angleToOrigin(new Point(this.x, this.y), new Point(s.x, s.y));
		// GameSocket.print("midpointAngle: " + midpointAngle);
		// int radius = 30;
		// int x = (int)(midpoint.x + radius * Math.cos(Math.PI/2 + midpointAngle));
		// int y = (int)(midpoint.y + radius * Math.sin(Math.PI/2 + midpointAngle));
		// SpaceCorner sc0 = new SpaceCorner(x, y, SpaceCorner.angleToOrigin(new Point(this.x, this.y), new Point(x, y)));
		// insertCorner(sc0);
		// s.insertCorner(sc0);
		// x = (int)(midpoint.x + radius * Math.cos(Math.PI/2*3 + midpointAngle));
		// y = (int)(midpoint.y + radius * Math.sin(Math.PI/2*3 + midpointAngle));
		// SpaceCorner sc1 = new SpaceCorner(x, y, SpaceCorner.angleToOrigin(new Point(this.x, this.y), new Point(x, y)));
		// insertCorner(sc1);
		// s.insertCorner(sc1);
	}

	public void insertCorner(SpaceCorner sc)
	{
		for(int i = 0; i < corners.size(); i++)
		{
			if(corners.get(i).angle > sc.angle)
			{
				corners.add(i, sc);
				return;
			}
		}
		corners.add(sc);
		// GameSocket.print("Something fukced up in insertCorner");
	}

	@Override
	public boolean equals(Object o)
	{
		return ((Space)o).id == id;
	}

	public void placeTopToken(Player p)
	{
		if(topToken == null)
			topToken = p;
	}

	public static int getCount()
	{
		return count;
	}

	public void setLocation(int x, int y)
	{
		this.x = x;
		this.y = y;
	}

	public void react(Player player)
	{
		switch(type)
		{
			case GREEN:
				player.send("react~GREEN~");
				Game.dontTellActive("reactOther~GREEN~");
			break;
			case RED:
				player.send("react~RED~");
				Game.dontTellActive("reactOther~RED~");
			break;
			case WHITE:
				player.send("react~WHITE~");
				Game.dontTellActive("reactOther~WHITE~");
			break;
			case BLUE:
				player.send("react~BLUE~");
				Game.dontTellActive("reactOther~BLUE~");
			break;
			// case BLACK:
			// 	player.send("react~BLACK~");
			//	Game.dontTellActive("reactOther~BLACK~");
			// break;
			case PENALTY:
				player.send("react~PENALTY~");
				Game.dontTellActive("reactOther~PENALTY~");
			break;
			case CARPATHIA:
				player.send("react~CARPATHIA~");
				Game.dontTellActive("reactOther~CARPATHIA~");
			break;
		}
	}
}