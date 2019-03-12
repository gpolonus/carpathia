package builder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

public class JSBuilder {
	public static void main(String args[]){
		String jsonLocation = args[0];
		JSONObject jsonSetup = null;
		try {
			jsonSetup = new JSONObject(readFile(jsonLocation));
			String homeDir = jsonSetup.getString("homeDir");
			setModules(homeDir);
			List<String> importStrings = new LinkedList<String>();
			Map<String, Integer> levels = new HashMap<String, Integer>();
			JSONIterableArray moduleStructure = new JSONIterableArray(jsonSetup.getJSONArray("modules")); 
			for(Object obj : moduleStructure){
				JSONObject moduleListing = (JSONObject)obj;
				JSONIterableArray moduleList = new JSONIterableArray(moduleListing.getJSONArray("list"));
				String key = moduleListing.getString("key");
				for(Object moduleString : moduleList){
					
				}
			}
		} catch (JSONException | IOException e) {
			System.out.println("JSON file could not be read.");
			e.printStackTrace();
		}
		
	}
	
	private static Map<String, String> modules = new HashMap<String, String>();
	
	private static void setModules(String homeDir){
		File folder = new File(homeDir);
		if(folder.isDirectory()){
			File[] files = folder.listFiles();
			for(File file : files){
				setModules(file.getAbsolutePath());
			}
		} else{
			modules.put(homeDir.substring(homeDir.lastIndexOf(File.separator)).split(".js")[0], homeDir);
		}
	}
	
	private static String readFile(String path) throws IOException 
	{
		byte[] encoded = Files.readAllBytes(Paths.get(path));
		return new String(encoded, "UTF-8");
	}
	
}
