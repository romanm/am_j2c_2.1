package com.algoritmed.am_j2c_2.controllers;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class ExcellRest {
	private static final Logger logger = LoggerFactory.getLogger(ExcellRest.class);
	
	@PostMapping(
		value = "/r/build_excel",
		produces = {"application/vnd.ms-excel"}
	)
	public @ResponseBody byte[]  build_excel(
			@RequestBody Map<String, Object> data
			,HttpServletResponse response
			,Principal principal
		) throws IOException, EncryptedDocumentException, InvalidFormatException {
		logger.info("\n\n-- 37 -- "
				+ "/build_excel"
				);
		InputStream inp = buildExcel(response, data);
		return IOUtils.toByteArray(inp);
	}

	private InputStream buildExcel(HttpServletResponse response, Map<String, Object> data) throws EncryptedDocumentException, InvalidFormatException, IOException {
		InputStream inp = buildExcel(response);
		logger.info("\n\n-- 48 -- "
				+ "\n"
				+ data
				);
		/*
		Workbook wb = WorkbookFactory.create(inp);
		Sheet sheet = wb.getSheetAt(0);
		Row row = sheet.getRow(2);
		Cell cell = row.getCell(3);
		if (cell == null)
			cell = row.createCell(3);
		cell.setCellType(CellType.STRING);
		cell.setCellValue("a test");
		    * */

		return inp;
	}

	@GetMapping(
		value = "/r/excel1",
		produces = {"application/vnd.ms-excel"}
	)
	public @ResponseBody byte[] getImageWithMediaType(HttpServletRequest request, HttpServletResponse response) throws IOException, EncryptedDocumentException, InvalidFormatException {
		String data = request.getParameter("data");
		System.out.println("---------70----------");
		System.out.println(data);
		Map<String, Object> map = stringToMap(data);
		System.out.println(map);
		List list = (List) map.get("data");
		System.out.println(list.get(0));


		InputStream inp = buildExcel(response);
		return IOUtils.toByteArray(inp);
	}

	@Autowired protected	ObjectMapper objectMapper;
	protected Map<String, Object> stringToMap(String protocolDoc) {
		Map map = null;
		try {
			map = objectMapper.readValue(protocolDoc, Map.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		if(map==null)
			map = new HashMap<>();
		return map;
	}
	private InputStream buildExcel(HttpServletResponse response) throws FileNotFoundException {
		String filePath = "/home/roman/algoritmed/edu/excel_file_sample.xlsx";
		   response.setHeader("Content-disposition", "attachment; filename=excel_file_sample_"+123+".xlsx");

		InputStream inp = new FileInputStream(filePath);
		return inp;
	}
}
