package game.event;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import game.Game;
import game.player.Player;
import game.socket.GameSocket;

public abstract class GameEvent {
	
	protected boolean acting = false;
	
	public static List<String> neededProps = new LinkedList<String>();
	public static Map<String, Object> props = new HashMap<String, Object>();
	
	public GameEvent(){
		Game.allEvents.put(this.getHandle(), this);
	}
	
	public boolean acting(){
		return this.acting;
	}
	
	public void acting(boolean acting){
		this.acting = acting;
	}
	
	public void preExecute(){
		preExecute(null);
	}
	
	public void preExecute(JSONObject extraInfo){
		if(!startCondition()){
			return;
		}
		extraInfo = extraInfo == null ? getExtraInfo() : extraInfo; 
		JSONObject sending = new JSONObject();
		try {
			sending.append("players", getPlayersAffected());
//			TODO: test what happens when extra info is null
			sending.append("extraInfo", extraInfo);
			sending.append("handle", getHandle());
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		sending = preExecuteAction(sending);
		
		GameSocket.send(sending, getPlayersAffected());
		
//		GameSocket.broadcast(sending.toString());
	}
	
	public void postExecute(JSONObject data){
		this.acting(postExecuteAction(data));
	}
	
	protected JSONObject preExecuteAction(JSONObject currentMessage){
		return currentMessage;
	}
	
	protected abstract boolean postExecuteAction(JSONObject returnMessage);
	
	public abstract String getHandle();
	
	public abstract List<Player> getPlayersAffected();
	
	public abstract JSONObject getExtraInfo();
	
	protected boolean startCondition(){
		for(String s : neededProps){
			if(props.get(s) == null){
				return false;
			}
		}
		return true;
	}
	
}
