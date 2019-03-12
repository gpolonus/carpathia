package util;

import java.util.ArrayList;
import java.util.List;

import game.Game;
import game.player.Player;

public class TheBestUtils {
	
	public static List<Player> onePlayeList(Player p){
		List<Player> players = new ArrayList<Player>();
		players.add(p);
		return players;
	}
}
