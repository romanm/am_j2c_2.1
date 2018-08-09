package com.algoritmed.am_j2c_2;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.algoritmed.am_j2c_2.components.MapUtil;

@Controller
public class PrincipalRest extends Db2Common{
	private static final Logger logger = LoggerFactory.getLogger(PrincipalRest.class);
	@Autowired protected MapUtil mapUtil;

	@GetMapping(value = "/r/principal/{user_id}")
	public @ResponseBody Map<String, Object>  usersFromUserId(@PathVariable Integer user_id) {
		Map<String, Object> mapPrincipal = new HashMap<String, Object>(),
							map = new HashMap<String, Object>();
		map.put("user_id", user_id);
		List<Map<String, Object>> authorities = db2ParamJdbcTemplate.queryForList(env.getProperty("sql.db1.user.authorities"), map);
		map.put("authorities", authorities);
		Map<String, Object> user = db2ParamJdbcTemplate.queryForMap(env.getProperty("sql.db1.users.fromUserId"), map);
		addUser(map, user);
		String name = (String) user.get("username");
		map.put("username", name);

		addUserMsp(map, user_id, name);

		mapPrincipal.put("principal", map);
		return mapPrincipal;
	}
	
	@GetMapping("/r/principal")
	public @ResponseBody Map<String, Object> principal(Principal principal) {
		Map<String, Object> map = 
				principal2(principal);
		return map;
	}
	public Map<String, Object> principal2(Principal principal) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("principal", principal);
//		logger.info("-------update---principal-----");
		System.err.println(null!=principal);
		System.err.println(principal);

		Map<String, Object> uriMap = new HashMap<String, Object>();
		if(null!=principal) {
			System.err.println("----40----------");
			String name = principal.getName();
			map.put("username", name);
			Map<String, Object> user = db2ParamJdbcTemplate.queryForMap(env.getProperty("sql.db1.users.fromUsername"), map);
			Integer user_id = (Integer) user.get("user_id");

			addUser(map, user);
			
			List<?> user_msp = addUserMsp(map, user_id, name);
			if(user_msp.size()==0)
				return map;
			
			
			uriMap.put("uri_registry", env.getProperty("config.uri_registry"));
			uriMap.put("uri_oauth2_sign_in", env.getProperty("config.uri_oauth2_sign_in"));
			uriMap.put("uri_oauth2_code_grant", env.getProperty("config.uri_oauth2_code_grant"));
			uriMap.put("uri_oauth2_refresh_tokens", env.getProperty("config.uri_oauth2_refresh_tokens"));
		}
		uriMap.put("security_prefix", env.getProperty("config.security_prefix"));
		map.put("uri", uriMap);
		logger.info("--65-- msp_id = "+map.get("msp_id"));
		return map;
	}

	private List<?> addUserMsp(Map<String, Object> map, Integer user_id, String name) {
		List<?> user_msp = read_user_msp(map, user_id);
		if(user_msp.size()==0) {
			String msp_id = mapUtil.getString(map, "user_msp[0]","msp_id");
			System.err.println(msp_id);

			//			Map<String, Object> paramMap = new HashMap<String, Object>();
			map.put("msp_id", msp_id);
			for (Map<String, Object> map2 : db2ParamJdbcTemplate.queryForList(
					env.getProperty("sql.msp.msp_access_token.read"), map)) {
				String doctype = (String) map2.get("doctype");
				if("msp_access_token_body".equals(doctype))
					map.put(doctype, stringToMap((String) map2.get("docbody")));
				else 
					map.put(doctype, map2.get("docbody"));
			}
			if("admin".equals(name)) {
				Map<String, Object> msp_list = msp_list();
				map.put("user_msp", msp_list.get("msp_list"));
			}
		}
		return user_msp;
	}

	private void addUser(Map<String, Object> map, Map<String, Object> user) {
		System.err.println(user);

		user.remove("password");
		map.put("user", user);

	}
	
	public Map<String, Object> msp_list() {
		Map<String, Object> map = new HashMap<String, Object>();
		List<Map<String, Object>> msp_list = db2JdbcTemplate.queryForList(env.getProperty("sql.msp.list"));
		map.put("msp_list", msp_list);
		return map;
	}
	
	//as samples for use throws /read_sql_with_param
	private List<?> read_user_msp(Map<String, Object> map, Integer user_id) {
		map.put("user_id", user_id);
		List<Map<String, Object>> l = db2ParamJdbcTemplate.queryForList(env.getProperty("sql.db1.user.msp"), map);
		map.put("user_msp", l);
		return l;
	}
}
