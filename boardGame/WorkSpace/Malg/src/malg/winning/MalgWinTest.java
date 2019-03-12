package malg.winning;

import game.Game;
import game.end.WinTest;

public class MalgWinTest extends WinTest {

	@Override
	public boolean test() {
		return Game.players.size() == 1;
	}

}
