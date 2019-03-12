package game.space.util;

import java.awt.Point;

public class SpaceCorner
{
	public int x;
	public int y;
	public double angle;

	public SpaceCorner(int x, int y, double angle)
	{
		this.x = x;
		this.y = y;
		this.angle = angle;
	}

	public SpaceCorner(int x, int y, int x0, int y0)
	{
		this(x, y, 0);
		angle = angleToOrigin(new Point(x0, y0), new Point(x, y));
	}

	public static double angleToOrigin(Point init, Point finl)
	{
		// if(init.x == finl.x && init.y = finl.y)
		// 	return 0;
		double multiplier = 1;
		if(finl.y < init.y)
			multiplier = (double)-1;
		double dot = (finl.x - init.x)*(100);
		double distance = (double)Math.sqrt((finl.x - init.x)*(finl.x - init.x) + (finl.y - init.y)*(finl.y - init.y));
		return (double)(multiplier * Math.acos(dot/(distance * 100)));
	}
}