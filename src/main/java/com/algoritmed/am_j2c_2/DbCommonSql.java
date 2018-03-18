package com.algoritmed.am_j2c_2;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

public class DbCommonSql {
	@Autowired protected Environment env;
	
	protected void read_select(Map<String, Object> data, String sql_command, NamedParameterJdbcTemplate dbParamJdbcTemplate) {
		if(sql_command.contains(";")) {
			int i = -1;
			for (String sql : sql_command.split(";")) {
				i++;
				System.err.println("------------39------------ "+i);
				if(sql.contains(":add_joins")) {
					sql = sql.replace(":add_joins", ""+data.get("add_joins")).replace(":add_columns", ""+data.get("add_columns"));
				}
				System.err.println(sql);
				List<Map<String, Object>> list = dbParamJdbcTemplate.queryForList(sql, data);
				data.put("list_"+i, list);
				if(sql.contains("add_joins")) {
					mapSqlJoins(data, list);
				}
			}
			data.put("list", data.get("list_"+i));
			data.remove("list_"+i);
		}else
		if(sql_command.indexOf("SELECT 'docbody' datatype")==0) {
			List<Map<String, Object>> docbodyList = dbParamJdbcTemplate.queryForList(sql_command, data);
			if(docbodyList.size()>0) {
				Map<String, Object> docbodyMap = docbodyList.get(0);
				String docbodyStr = (String) docbodyMap.get("docbody");
				Map<String, Object> docbodyStr2Map = stringToMap(docbodyStr);
				docbodyMap.put("docbody", docbodyStr2Map);
				data.put("docbody", docbodyMap);
			}
		}else{
			List<Map<String, Object>> list = dbParamJdbcTemplate.queryForList(sql_command, data);
			System.err.println("-------------54--------list");
			System.err.println(list);
			data.put("list", list);
		}
	}
	protected void mapSqlJoins(Map<String, Object> map, List<Map<String, Object>> listColumns) {
//			addListWithName("joinColumnsSelect", sqlJoinColumnsSelect, map);
		String joins = "", columns = "";
		Map<Integer, Object> col_aliasMap	= (Map<Integer, Object>) map.get("col_alias");
		if(null==col_aliasMap) {
			col_aliasMap = new HashMap<Integer, Object>();
			map.put("col_alias", col_aliasMap);
		}
		HashMap<String, Object> col_keys = new HashMap<String, Object>();
		for (Map<String, Object> map2 : listColumns) {
			Integer cln_id = (Integer) map2.get("cln_id");
			joins += " " + map2.get("add_joins");
			columns += " " + map2.get("add_columns");
//			String col_alias = (String) map2.get("col_alias");
//			String col_table_name = (String) map2.get("col_table_name");
//			HashMap<Object, Object> m = new HashMap<>();
			map2.remove("add_joins");
			map2.remove("add_columns");
			map2.remove("joins_select");
			col_aliasMap.put(cln_id, map2);
			col_keys.put(""+map2.get("col_key"), map2.get("col_alias"));
		}
		map.put("col_keys", col_keys);
		map.put("add_joins", joins);
		map.put("add_columns", columns);
	}
	
	@Autowired protected	ObjectMapper objectMapper;
	protected Map<String, Object> stringToMap(String protocolDoc) {
		Map map = null;
		try {
			map = objectMapper.readValue(protocolDoc, Map.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		if(map==null)
			map = new HashMap<>();
		return map;
	}
	protected Map<String, Object> sqlParamToMap(String sql, HttpServletRequest request) {
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, String[]> parameterMap = request.getParameterMap();
		map.put("parameterMap", parameterMap);
		for (String key : parameterMap.keySet()) {
			String[] v = parameterMap.get(key);
			String val = v[0];
			map.put(key, val);
		}
		System.err.println(map);
		String sql_from_env = env.getProperty(sql);
		map.put(sql, sql_from_env);
		return map;
	}
}
