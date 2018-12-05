package com.algoritmed.am_j2c_2.controllers;

import java.security.Principal;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CopyPasteRest {
	protected static final Logger logger = LoggerFactory.getLogger(CopyPasteRest.class);
	
	@GetMapping("/copy")
	public @ResponseBody Map<String, Object> getCopy(
			HttpServletRequest request
			,Principal principal
			) {
		HttpSession session = request.getSession();
		Map<String, Object> data ;
		data = (Map<String, Object>) session.getAttribute("copy");
		logger.info("\n\n--30----- "
				+ "/copy"
				+ "\n" + data
				);
		return data;
	}
	
	@PostMapping("/copy")
	public @ResponseBody Map<String, Object> setCopy(
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
		) {
		
		HttpSession session = request.getSession();
		session.setAttribute("copy", data);
		Enumeration<String> attributeNames = session.getAttributeNames();
		Object attributeCopy = session.getAttribute("copy");
		logger.info("\n\n--49----- "
				+ "/copy"
				+ "\n" + data
				+ "\n" + attributeCopy
				);
		return data;
	}

}
