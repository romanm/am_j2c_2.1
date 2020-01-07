package com.algoritmed.am_j2c_2.components;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.algoritmed.am_j2c_2.EhDb1Rest;

@Component
public class Filter02LoginRedirectPageKey implements Filter{
	protected static final Logger logger = LoggerFactory.getLogger(Filter02LoginRedirectPageKey.class);

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		logger.info("------27-------\n");
		HttpServletRequest request2 = (HttpServletRequest)request;
		String url = request2.getRequestURL().toString();
		String queryString = request2.getQueryString();
		if(url.contains("login") && queryString!=null) {
			String pageKey = (String) request2.getParameter("pageKey");
			if(pageKey!=null) {
				HttpSession session = request2.getSession();
				System.err.println("--26-- Filter02LoginRedirectPageKey-- "+pageKey);
				session.setAttribute("pageKey", pageKey);
			}
		}
		chain.doFilter(request, response);
	}
	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
	@Override
	public void destroy() {
	}
}
