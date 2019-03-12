package websocket.gamesocket;

public enum SpaceType {
	WHITE,
	BLUE,
	RED,
	GREEN,
	CARPATHIA,
	PENALTY;

	public static SpaceType fromInt(int x)
	{
		SpaceType temp;
		switch(x)
		{
			case 1:
				temp = BLUE;
			break;
			
			case 2:
				temp = RED;
			break;
			
			case 3:
				temp = GREEN;
			break;
			
			case 4:
				temp = CARPATHIA;
			break;
			
			case 5:
				temp = PENALTY;
			break;

			default:		
				temp = WHITE;
		}
		return temp;
	}
}
