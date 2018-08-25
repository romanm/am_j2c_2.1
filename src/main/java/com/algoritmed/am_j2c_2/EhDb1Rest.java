package com.algoritmed.am_j2c_2;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.algoritmed.nosql.ExecuteSqlBlock;

@Controller
public class EhDb1Rest extends DbCommon{
	protected static final Logger logger = LoggerFactory.getLogger(EhDb1Rest.class);

	@GetMapping("/r/url_sql_read_db1")
	public @ResponseBody Map<String, Object> url_sql_read2(
			@RequestParam(value = "sql", required = true) String sql
			,HttpServletRequest request
			) {
		Map<String, Object> map = sqlParamToMap(request);
		List<Map<String, Object>> list = dbParamJdbcTemplate.queryForList(sql, map);
		map.put("list", list);
		logger.info("\n\n--32-- --begin-- /url_sql_read2"
				+ "\n" + sql
				+ "\n\n map = " + map
				);
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
