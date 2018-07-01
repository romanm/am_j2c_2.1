package com.algoritmed.am_j2c_2;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Зчитування JSON файла в Map<String, Object> об'єкт.
 * @author roman
 *
 */
@Component("readJsonFromFile")
public class ReadJsonFromFile {

//	private static final Logger logger = LoggerFactory.getLogger(ReadJsonFromFile.class);
	
	private @Value("${config.serverWebSites}") String serverWebSites;
	Map<String, Object> configWebSitesMap=null;

	public Map<String, Object> readConfigWebSite() {
		File file = new File(serverWebSites);
//		if(configWebSitesMap==null)
			configWebSitesMap = readJsonFromFullFileName(file);
		return configWebSitesMap;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> readJsonFromFullFileName(File file) {
		Map<String, Object> readJsonFileToJavaObject = null;
		try {
			readJsonFileToJavaObject = objectMapper.readValue(file, Map.class);
		} catch (JsonParseException e1) {
			e1.printStackTrace();
		} catch (JsonMappingException e1) {
			e1.printStackTrace();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return readJsonFileToJavaObject;
	}

	@Autowired	ObjectMapper objectMapper;

}
