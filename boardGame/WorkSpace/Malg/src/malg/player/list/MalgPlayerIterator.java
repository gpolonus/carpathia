package malg.player.list;

import game.Game;
import game.player.Player;
import game.player.list.PlayerIterator;
import malg.player.MalgPlayer;

public class MalgPlayerIterator extends PlayerIterator {
	
	public Player getNextPlayer(Player activePlayer){
		Player temp = Game.players.get((activePlayer.num + 1) % Game.players.size());
		while(!((MalgPlayer)Game.activePlayer).isPlaying()){
			temp = Game.players.get((activePlayer.num + 1) % Game.players.size());
		}
		return temp;
	}

	@Override
	public Player getFirstPlayer(Player activePlayer) {
		return Game.players.get(0);
	}
}
