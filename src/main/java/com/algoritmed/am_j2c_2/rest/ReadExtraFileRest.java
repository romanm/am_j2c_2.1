package com.algoritmed.am_j2c_2.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public abstract class ReadExtraFileRest {
	String fileType;
	String headContentType = "text/plain;";

	@Autowired protected Environment env;
	private void readSendFile(HttpServletResponse response, String location, String pathName) {
		response.setHeader("Content-Type", headContentType+ " charset=utf-8");
		try {
			String path = env.getProperty("config.extraFile."+pathName);
			File fileToDownload = new File(path+location+ fileType);
			InputStream inputStream = new FileInputStream(fileToDownload);
			IOUtils.copy(inputStream, response.getOutputStream());
			response.flushBuffer();
		} catch (IOException ex) {
			System.err.println("IOError writing file to output stream \n "+location);
			System.err.println(ex);
		}
	}

	@GetMapping("/{path0}/{path1}/{path2}/{file}")
	public void getPathFile(@PathVariable String path0, @PathVariable String path1, @PathVariable String path2, @PathVariable String file, HttpServletResponse response) {
		readSendFile(response, path1+ "/"+path2+ "/"+ file, path0);
	}

	@GetMapping("/{path0}/{path1}/{file}")
	public void getPathFile(@PathVariable String path0, @PathVariable String path1, @PathVariable String file, HttpServletResponse response) {
		readSendFile(response, path1+ "/"+ file, path0);
	}

	@GetMapping("/{path0}/{file}")
	public void getFile(@PathVariable String path0, @PathVariable String file, HttpServletResponse response) {
		readSendFile(response, file, path0);
	}

}
