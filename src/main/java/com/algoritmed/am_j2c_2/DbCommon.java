package com.algoritmed.am_j2c_2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

@PropertySource("classpath:sql.properties")
public class DbCommon extends DbCommonSql{
	protected static final Logger logger = LoggerFactory.getLogger(DbCommon.class);

	protected @Autowired @Qualifier("db1JdbcTemplate") JdbcTemplate db1JdbcTemplate;
	protected @Autowired  @Qualifier("db1ParamJdbcTemplate") NamedParameterJdbcTemplate db1ParamJdbcTemplate;
	
}
