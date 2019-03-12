package builder;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;

public class JSONIterableArray extends JSONArray implements Iterable<Object>, Iterator<Object> {

	private int i;
	
	public JSONIterableArray(String stuff) throws JSONException{
		super(stuff);
	}
	
	public JSONIterableArray(JSONArray jsonArray) throws JSONException{
		super(jsonArray.toString());
	}
	
	@Override
	public Iterator<Object> iterator() {
		i = 0; 
		return this;
	}

	@Override
	public boolean hasNext() {
		return super.opt(i) != null;
	}

	@Override
	public Object next() {
		return super.opt(i++);
	}

}
