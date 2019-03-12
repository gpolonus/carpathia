package game.leftbehind;

import game.Game;
import game.config.GameConfig;
import game.leftbehind.config.LeftBehindGameConfig;

public class LeftBehindGame extends Game {

	public LeftBehindGame(){
		this(new LeftBehindGameConfig());
	}
	
	public LeftBehindGame(GameConfig gameConfig) {
		super(gameConfig);
	}


//	public GreenCard getGreenCard()
//	{
//		return greenCards.getCard();
//	}

}
