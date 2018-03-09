package com.algoritmed.am_j2c_2.components;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

//@Component
public class Filter01UrlTap implements Filter{
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
        HttpServletRequest request2 = (HttpServletRequest)request;
		String url = request2.getRequestURL().toString();
        String queryString = request2.getQueryString();
        Date time = Calendar.getInstance().getTime();
        System.err.println("--30-- "+time+" "+url + (null==queryString?"":"?"+queryString));
		chain.doFilter(request, response);
	}
	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
	@Override
	public void destroy() {
	}
}
