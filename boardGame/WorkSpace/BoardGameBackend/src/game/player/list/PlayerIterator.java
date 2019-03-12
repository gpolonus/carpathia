package game.player.list;

import game.player.Player;

public abstract class PlayerIterator{
	
	public abstract Player getNextPlayer(Player activePlayer);

	public abstract Player getFirstPlayer(Player activePlayer);
	
}
