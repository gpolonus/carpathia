package game.leftbehind.config;

import javax.websocket.Session;

import game.Game;
import game.board.Board;
import game.board.SimpleBoard;
import game.config.GameConfig;
import game.end.WinTest;
import game.leftbehind.LeftBehindGame;
import game.player.Player;
import game.player.SimplePlayer;
import game.player.list.PlayerIterator;

public class LeftBehindGameConfig extends GameConfig{

	public Game makeNewGame(){
		return new LeftBehindGame();
	}
	
	public Player makeNewPlayer(Session session){
		return new SimplePlayer(session);
	}
	
	public Board makeNewBoard(){
		return new SimpleBoard();
	}

	@Override
	public PlayerIterator makePlayerIterator() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public WinTest makeWinTest() {
		// TODO Auto-generated method stub
		return null;
	}
}
