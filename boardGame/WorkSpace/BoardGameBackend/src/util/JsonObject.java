package util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonObject {
	private JSONObject json;
	
	public JsonObject(String json){
		try {
			this.json = new JSONObject(json);
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	public JsonObject(JSONObject json){
		this.json = json;
	}
	
	public JsonObject getJSON(String name){
		try {
			return new JsonObject(((JSONObject)json.get(name)).toString());
		} catch (JSONException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	public JsonArray getArray(String name){
		try {
			return new JsonArray((JSONArray)json.get(name));
		} catch (JSONException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	public String getString(String name){
		try {
			return (String)json.get(name);
		} catch (JSONException e) {
			e.printStackTrace();
			return null;
		}
	}
}
