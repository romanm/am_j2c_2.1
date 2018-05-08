package com.algoritmed.am_j2c_2;

import java.security.Principal;
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

	@GetMapping("/r/url_sql_read2")
	public @ResponseBody Map<String, Object> url_sql_read2(
			@RequestParam(value = "sql", required = true) String sql
			,HttpServletRequest request
			) {
		Map<String, Object> map = sqlParamToMap(request);
		List<Map<String, Object>> list = db2ParamJdbcTemplate.queryForList(sql, map);
		map.put("list", list);
		logger.info("\n\n--24-- --begin-- /url_sql_read2"
				+ "\n" + sql
				+ "\n" + map
				);
		return map;
	}
	
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
//			@RequestParam(value = "sql", required = true) String sql,
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
		) {
		String sql = (String) data.get("sql");
		logger.info("\n\n-- 29 -- /r/update2_sql_with_param \n"
				+ sql
				+ "\n"
				+ data
				);
		executeSqlBlock.update_sql_script(data, sql, env);
		return data;
	}

}
