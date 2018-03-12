package com.algoritmed.am_j2c_2;

import java.security.Principal;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/r")
public class DbCommonRest extends DbCommon {
	@GetMapping("/read_sql_with_param")
	public @ResponseBody Map<String, Object> read_sql_with_param(
			@RequestParam(value = "sql", required = true) String sql
			,HttpServletRequest request
			) {
		Map<String, Object> map = sqlParamToMap(sql, request);
		logger.info("\n------43------/read_sql_with_param"
				+ "\n" + map
				);
		read_select(map, env.getProperty(sql), db1ParamJdbcTemplate);
//		List<Map<String, Object>> list = db1ParamJdbcTemplate.queryForList(env.getProperty(sql_command), map);
//		map.put("list", list);
		return map;
	}
	@PostMapping("/update_sql_with_param")
	public @ResponseBody Map<String, Object> update_sql_with_param(
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
		) {
		logger.info("\n-------29-----\n"
				+ "/r/update_sql_with_param\n"
				+ data
				);
		String sql = (String) data.get("sql");
		System.err.println(sql);
		executeSqlBlock.update_sql_script(data, sql,env);
		return data;
	}
}
