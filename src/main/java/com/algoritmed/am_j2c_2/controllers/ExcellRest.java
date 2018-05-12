package com.algoritmed.am_j2c_2.controllers;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class ExcellRest {
	private static final Logger logger = LoggerFactory.getLogger(ExcellRest.class);
	
	private InputStream buildExcel(HttpServletResponse response, Map<String, Object> data) throws EncryptedDocumentException, InvalidFormatException, IOException {
		logger.info("\n\n-- 48 -- "
				+ "\n"
				+ data
				);
		Workbook wb = buildReport(data);
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		wb.write(bos);
		byte[] barray = bos.toByteArray();
		return new ByteArrayInputStream(barray);

	}

	private Workbook buildReport(Map<String, Object> data) throws IOException, InvalidFormatException {
		Workbook wb = WorkbookFactory.create(new File(filePath));
		CellStyle cellDateStyle = wb.createCellStyle();
		CreationHelper createHelper = wb.getCreationHelper();
		cellDateStyle.setDataFormat(
		        createHelper.createDataFormat().getFormat("dd mmm. yyyy"));
		Sheet sheet = wb.getSheetAt(0);
		System.err.println(data);
		for (String keyR : (Set<String>) data.keySet()) {
			int rowNr = Integer.parseInt(keyR);
			Row row = sheet.createRow(rowNr);
			Map<String, Object> cells = (Map<String, Object>)data.get(keyR);
			for (String keyC : cells.keySet()) {
				int cellNr = Integer.parseInt(keyC);
				Cell cell = row.createCell(cellNr);
				Object object = cells.get(keyC);
				if(object instanceof Integer) {
					cell.setCellValue((Integer)object);
				}else {
					String stringValue = ""+object;
					if(stringValue.contains("=")) {
						String stringFormula = stringValue.substring(1).replace(";", ",");
						if(stringFormula.contains("DATE")) {
							cell.setCellFormula(stringFormula);
							cell.setCellStyle(cellDateStyle);
						}
					}else {
						cell.setCellValue(stringValue);
					}
				}
			}
			System.err.println(cells.keySet());
		}

		/*
		Row row = sheet.createRow(2);
		Cell cell = row.createCell(0);
		cell.setCellValue(1);
		Workbook wb = WorkbookFactory.create(inp);
		Row row = sheet.getRow(2);
		Cell cell = row.getCell(3);
		if (cell == null)
			cell = row.createCell(3);
		cell.setCellType(CellType.STRING);
		cell.setCellValue("a test");
		return inp;
		    * */
		return wb;
	}

	@GetMapping(
		value = "/r/excel1",
		produces = {"application/vnd.ms-excel"}
	)
	public @ResponseBody byte[] getImageWithMediaType(HttpServletRequest request, HttpServletResponse response) throws IOException, EncryptedDocumentException, InvalidFormatException {
		String data = request.getParameter("data");
		System.out.println("---------70----------");
		Map<String, Object> map = stringToMap(data);

		InputStream inp = buildExcel(response, map);
		return IOUtils.toByteArray(inp);
	}

	
	String filePath = "/home/roman/algoritmed/edu/excel_file_sample.xlsx";
	private InputStream buildExcel(HttpServletResponse response) throws FileNotFoundException {
		   response.setHeader("Content-disposition", "attachment; filename=excel_file_sample_"+123+".xlsx");

		InputStream inp = new FileInputStream(filePath);
		return inp;
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

}
