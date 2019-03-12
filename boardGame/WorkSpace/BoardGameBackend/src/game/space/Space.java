package game.space;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;

import game.player.Player;
import game.space.util.SpaceCorner;

public abstract class Space implements Iterable<Space>, Iterator<Space>
{
	public HashMap<Integer, Space> nbs;
	// the count of all the spaces in the game. used for making ids
	private static int count = 0;
	public int id;
	public int x;
	public int y;
	public LinkedList<SpaceCorner> corners = new LinkedList<SpaceCorner>();
	
	public Space(){
		id = count++;
		setLocation(0, 0);
	}
	
	public Space(int x, int y)
	{
		nbs = new HashMap<Integer, Space>();
		id = count++;
		setLocation(x, y);
	}
	
	public Space(int id, int x, int y)
	{
		nbs = new HashMap<Integer, Space>();
		this.id = id;
		count++;
		setLocation(x, y);
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
		Space space = null;
		try{
			space = ((Space)o);
		} catch(Exception e){
			return false;
		}
		return space.id == id;
	}
//
//	public void placeTopToken(Player p)
//	{
//		if(topToken == null)
//			topToken = p;
//	}

	public static int getCount()
	{
		return count;
	}

	public void setLocation(int x, int y)
	{
		this.x = x;
		this.y = y;
	}

	public abstract void react(Player player);
	

	private Iterator<Integer> keySetIterator;

	@Override
	public Iterator<Space> iterator() {
		keySetIterator = nbs.keySet().iterator();	
		return this;
	}

	@Override
	public boolean hasNext() {
		return keySetIterator.hasNext();
	}

	@Override
	public Space next() {
		return nbs.get(keySetIterator.next());
	}
}