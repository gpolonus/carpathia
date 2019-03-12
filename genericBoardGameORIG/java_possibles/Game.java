package websocket.gamesocket;


public class Game
{
	public Board board;
	public Player activePlayer;
	public boolean started = false;


	public void turnStart()
	{
		board.drawBoard();
		activePlayer.roll();
	}

	public void turnEnd()
	{
		activePlayer = board.players[(activePlayer.num + 1)%(board.players.length())];
		if(!winning())
			turnStart();
		else
			displayWinner();
	}

	public boolean winning()
	{
		return false;
	}

	public void addToLogger(String str)
	{
		// $(logHolder).html("<p>" + str + "</p>" + $(logHolder).html());
	}
}