package game.board;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;

import game.space.Space;
import util.JsonArray;

public abstract class Board implements Iterator<Space>, Iterable<Space>{

	// contains all of the spaces in the game
	protected HashMap<Integer, Space> board = new HashMap<Integer, Space>();

	public Board() {
		if (board.isEmpty()) {
			makeBoard();
		}
	}

	public int size() {
		return board.size();
	}

	public void add(Space s) {
		board.put(s.id, s);
	}

	public Space get(int i) {
		return board.get(i);
	}

	// public abstract Space makeNewSpace(int id, SpaceType typ,
	// HashMap<Integer, Space> n);

	public abstract Space makeNewSpace(int id, int x, int y);

	protected abstract void makeBoard();

	protected void makeBoardFromJSON(String json) {
		JsonArray boardJSON = null;
		try {
			boardJSON = new JsonArray(json);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		Map<Integer, List<Integer>> allNeighbors = new HashMap<Integer, List<Integer>>();
		for (Object spaceObject : boardJSON) {
			try {
				JSONObject spaceJSON = (JSONObject) spaceObject;
				int id = spaceJSON.getInt("id");
				int x = Integer.parseInt(spaceJSON.getString("x").substring(0, spaceJSON.getString("x").lastIndexOf(".")));
				int y = Integer.parseInt(spaceJSON.getString("y").substring(0, spaceJSON.getString("y").lastIndexOf(".")));
				List<Integer> nbs = new LinkedList<Integer>();
				JsonArray nbsJSON = new JsonArray(spaceJSON.getJSONArray("nbs"));
				for (Object nbObject : nbsJSON) {
					Integer nb = (Integer) nbObject;
					nbs.add(nb);
				}
				allNeighbors.put(id, nbs);
				board.put(id, makeNewSpace(id, x, y));
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}
	
	private Iterator<Integer> keySetIterator;

	@Override
	public boolean hasNext() {
		return keySetIterator.hasNext();
	}

	@Override
	public Space next() {
		return board.get(keySetIterator.next());
	}

	@Override
	public Iterator<Space> iterator() {
		keySetIterator = board.keySet().iterator();
		return this;
	}

}
