package com.algoritmed.am_j2c_2.controllers;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.util.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ExcellRest {
	@GetMapping(
			value = "/r/excel1",
			produces = {"application/vnd.ms-excel"}
			)
	public @ResponseBody byte[] getImageWithMediaType(HttpServletResponse response) throws IOException, EncryptedDocumentException, InvalidFormatException {
		String filePath = "/home/roman/algoritmed/edu/excel_file_sample.xlsx";
		   response.setHeader("Content-disposition", "attachment; filename=excel_file_sample_"+123+".xlsx");

		InputStream inp = new FileInputStream(filePath);
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

		return IOUtils.toByteArray(inp);
	}
}
