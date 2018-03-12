package com.algoritmed.am_j2c_2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.algoritmed.nosql.ExecuteSqlBlock;

@PropertySource("classpath:sql2.properties")
public class Db2Common extends DbCommonSql{
	protected static final Logger logger = LoggerFactory.getLogger(Db2Common.class);
	protected @Autowired @Qualifier("db2JdbcTemplate")		JdbcTemplate db2JdbcTemplate;
	protected @Autowired @Qualifier("db2ParamJdbcTemplate")	NamedParameterJdbcTemplate db2ParamJdbcTemplate;
	protected @Autowired @Qualifier("db2ExecuteSqlBlock")	ExecuteSqlBlock executeSqlBlock;

	
	/**
	 * SQL select - повертає наступний ID единий для всієй БД.
	 */
	private @Value("${sql.nextDbId}") String sql_nextDbId;
}
