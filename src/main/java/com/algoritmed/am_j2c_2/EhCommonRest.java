package com.algoritmed.am_j2c_2;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class EhCommonRest  extends Db2Common{
	protected static final Logger logger = LoggerFactory.getLogger(EhCommonRest.class);

	@GetMapping("/r/read2_sql_with_param")
	public @ResponseBody Map<String, Object> read2_sql_with_param(
			@RequestParam(value = "sql", required = true) String sql
			,HttpServletRequest request
			) {
		Map<String, Object> map = sqlParamToMap(sql, request);
		logger.info("\n\n--24-- --begin-- /read2_sql_with_param"
				+ "\n" + map
				);
		read_select(map, env.getProperty(sql), db2ParamJdbcTemplate);
		logger.info("\n--28-- --end-- /read2_sql_with_param \n"
				);
		return map;
	}
	
	@PostMapping("/r/update2_sql_with_param")
	public @ResponseBody Map<String, Object> update_sql_with_param(
			@RequestParam(value = "sql", required = true) String sql,
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
		) {
		logger.info("\n-------29-----\n"
				+ "/r/update2_sql_with_param \n"
				+ sql
				+ "\n"
				+ data
				);
		update_sql_script(data, sql);
		return data;
	}
	
	protected void update_sql_script(Map<String, Object> data, String sql) {
//		String sql = (String) data.get("sql");
		String sql_from_env = env.getProperty(sql);
		logger.info("\n-----62------update_sql_script-- \n"
				+ "\n" + data
				+ "\n" + sql_from_env
				);
//		data.put(sql, sql_from_env);
		if(sql_from_env.contains(";")) {
			if(data.containsKey("docbodyMap")) {
				Map<String,Object> docbodyMap = (Map<String, Object>) data.get("docbodyMap");
//				String docbody = objectToString(docbodyMap);
//				data.put("docbody", docbody);
				data.put("docbodyMap", docbodyMap);
			}
			
			String[] split_nextDbId = sql_from_env.split("nextDbId");
			System.err.println("nextDbId cnt="+split_nextDbId.length);
			if(split_nextDbId.length > 0) {
				HashMap<Integer, Integer> nextDbMap = new HashMap<>();
				for (int i = 1; i < split_nextDbId.length; i++) {
					String s1 = split_nextDbId[i];
					System.err.println(s1);
					String s2 = s1.split(" ")[0];
					System.err.println(s2);
					int nextDbKey = Integer.parseInt(s2);
					System.err.println(nextDbKey);
					nextDbMap.put(nextDbKey, nextDbKey);
				}
				System.err.println(nextDbMap);
				System.err.println(nextDbMap.keySet());
				System.err.println(nextDbMap.keySet().size());

				for (Integer key : nextDbMap.keySet())
					data.put("nextDbId"+key, nextDbId());
			}
			if(data.containsKey("replace_param")) {
				Map<String,String> replace_param = (Map<String, String>) data.get("replace_param");
				for (String key : replace_param.keySet())
					sql_from_env.replaceAll(":"+key, ":"+replace_param.get(key));
			}
			System.err.println("-------98--------------");
			System.err.println(sql_from_env);
			
			if(true)
				return;

			if(data.containsKey("lotOfNewIds")) {
				int lotOfNewIds = (int) data.get("lotOfNewIds");
				for (int i = 1; i <= lotOfNewIds; i++) {
					Integer nextDbId = nextDbId();
					data.put("nextDbId"+i, nextDbId);
					System.err.println("nextDbId"+i+"="+nextDbId);
				}
			}
			String[] sqls_from_env = sql_from_env.split(";");
			for (int i = 0; i < sqls_from_env.length; i++) {
				String sql_command = sqls_from_env[i].trim();
				System.err.print(sql_command);
				if(sql_command.length()==0)
					continue;
				System.err.print(" - "+i+"->");
				String[] split = sql_command.split(" ");
				String first_word = split[0];
				System.err.println(first_word);
				if("INSERT".equals(first_word)
				|| "UPDATE".equals(first_word)
				|| "DELETE".equals(first_word)
				){
					if("docbody".equals(split[1])) {
						if(data.containsKey("docbodyMap")) {
//							String docbody = objectToString(data.get("docbodyMap"));
//							data.put("docbody", docbody);
							data.put("docbodyMap", data.get("docbodyMap"));

						}
					}
					int update = db2ParamJdbcTemplate.update(sql_command, data);
					data.put("update"+i, update);
				}else if(sql_command.split("_var_").length>1) {
					update_vars(data, sql_command);
				}else if("SELECT".equals(first_word)) {
					read_select(data, sql_command, i);
				}
			}
		}else {
			int update = db2ParamJdbcTemplate.update(sql_from_env, data);
			data.put("update", update);
		}
	}

	protected void read_select(Map<String, Object> data, String sql_command, Integer i) {
		String nr = null==i?"":(""+i);
//		System.err.println(sql_command);
//		System.err.println(sql_command.indexOf("SELECT 'docbody' datatype"));
		if(sql_command.indexOf("SELECT 'docbody' datatype")==0) {
			List<Map<String, Object>> docbodyList = db2ParamJdbcTemplate.queryForList(sql_command, data);
			if(docbodyList.size()>0) {
				Map<String, Object> docbodyMap = docbodyList.get(0);
				String docbodyStr = (String) docbodyMap.get("docbody");
				Map<String, Object> docbodyStr2Map = stringToMap(docbodyStr);
				docbodyMap.put("docbody", docbodyStr2Map);
				data.put("docbody"+nr, docbodyMap);
			}
		}else{
			List<Map<String, Object>> list = db2ParamJdbcTemplate.queryForList(sql_command, data);
			data.put("list"+nr, list);
		}
	}

	private void update_vars(Map<String, Object> data, String sql_command) {
//		System.err.println("-------116---------------");
//		System.err.println(sql_command);
		List<Map<String, Object>> varsList = db2ParamJdbcTemplate.queryForList(sql_command, data);
		Map<String, Object> varsMap = varsList.get(0);
		String[] vars = sql_command.split("_var_");
		for (int i = 1; i < vars.length; i++) {
			String varName = vars[i].split(" ")[0];
			System.err.println(varName);
			Object val = varsMap.get("_var_"+varName);
			data.put(varName, val);
			logger.info("----126------- \n"
					+ "\n: " + varName+"="+val
					);
		}
	}
}
