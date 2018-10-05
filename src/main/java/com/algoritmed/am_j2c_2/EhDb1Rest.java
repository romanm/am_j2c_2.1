package com.algoritmed.am_j2c_2;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.algoritmed.nosql.ExecuteSqlBlock;

@Controller
public class EhDb1Rest extends DbCommon{
	protected static final Logger logger = LoggerFactory.getLogger(EhDb1Rest.class);

	@PostMapping("/r/url_sql_read_db1")
	public @ResponseBody Map<String, Object> url_sql_read_db1(
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
		) {
		logger.info("\n\n--35----- "
				+ "/r/url_sql_read_db1"
				+ "\n" + data
				);
		String sql = (String) data.get("sql");
		executeSqlBlock.updateNewIds(sql, data, env);
		int i = 0;
		for (String sql_command : sql.split(";")) {
			System.err.println(i);
			String sql2 = sql_command.trim();
			System.err.println(sql2);
			String first_word = sql2.split(" ")[0];
			if("SELECT".equals(first_word)) {
				List<Map<String, Object>> list = dbParamJdbcTemplate.queryForList(sql2, data);
				data.put("list"+i, list);
			}else {
				int update = dbParamJdbcTemplate.update(sql2, data);
				data.put("update_"+ i, update);
			}
			i++;
			
		}
		return data;
	}

	@GetMapping("/r/url_sql_read_db1")
	public @ResponseBody Map<String, Object> url_sql_read_db1(
			@RequestParam(value = "sql", required = true) String sql
			,HttpServletRequest request
			) {
		Map<String, Object> map = sqlParamToMap(request);
		logger.info("\n\n--66-- --begin-- /url_sql_read_db1"
				+ "\n" + sql
				+ "\n\n map = " + map
				);
		List<Map<String, Object>> list = dbParamJdbcTemplate.queryForList(sql, map);
		map.put("list", list);
		return map;
	}
	protected @Autowired @Qualifier("db1JdbcTemplate")		JdbcTemplate dbJdbcTemplate;
	protected @Autowired @Qualifier("db1ParamJdbcTemplate")	NamedParameterJdbcTemplate dbParamJdbcTemplate;
	protected @Autowired @Qualifier("db1ExecuteSqlBlock")	ExecuteSqlBlock executeSqlBlock;

	
	/**
	 * SQL select - повертає наступний ID единий для всієй БД.
	 */
	private @Value("${sql.nextDbId}") String sql_nextDbId;

}
