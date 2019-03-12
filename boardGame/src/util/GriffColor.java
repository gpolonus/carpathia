package util;

public class GriffColor
{
	public int r;
	public int g;
	public int b;

	public GriffColor(int r, int g, int b)
	{
		this.r = r;
		this.g = g;
		this.b = b;
	}

	public GriffColor()
	{
		this(0,0,0);
	}

	public GriffColor(double angle)
	{
		int gradual = (int)(angle%(Math.PI/3)/Math.PI*3 * 255);
		switch((int)Math.floor(angle/(Math.PI/3)))
		{
			case 0:
				r = 255;
				g = gradual;
				b = 0;
			break;

			case 1:
				r = 255 - gradual;
				g = 255;
				b = 0;
			break;

			case 2:
				r = 0;
				g = 255;
				b = gradual;
			break;

			case 3:
				r = 0;
				g = 255 - gradual;
				b = 255;
			break;

			case 4:
				r = gradual;
				g = 0;
				b = 255;
			break;

			case 5:
				r = 255;
				g = 0;
				b = 255 - gradual;
			break;

			default:
				r = 0;
				g = 0;
				b = 0;
		}
	}

	public double getColorAngle()
	{
		return 0;
	}

	@Override
	public String toString()
	{
		return "rgb(" + r + "," + g + "," + b + ")";
	}
}