package com.algoritmed.am_j2c_2.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.algoritmed.am_j2c_2.Db2Common;

@PropertySource(value = "classpath:email.properties", encoding="UTF-8")
@Controller
public class BackupDbRest  extends Db2Common{

	@PostMapping("/backup_db_path")
	public @ResponseBody Map<String, Object> url_sql_update2(
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
		) {
		String	sqlBackupFile	= (String) data.get("sqlBackupFile"),
				sql				= "SCRIPT TO '"+sqlBackupFile+"'";
		
		logger.info("\n\n--38----- "
				+ "/backup_db_path"
				+ "\n" + data
				);

		db2JdbcTemplate.execute(sql);
		toZip(sqlBackupFile);
		
		return data;
	}
	
	private static void toZip(String sourceFile) {
		try {
			FileOutputStream fos
			= new FileOutputStream(sourceFile+".zip");
			ZipOutputStream zipOut = new ZipOutputStream(fos);
			File fileToZip = new File(sourceFile);
			FileInputStream fis = new FileInputStream(fileToZip);
			ZipEntry zipEntry = new ZipEntry(fileToZip.getName());
			zipOut.putNextEntry(zipEntry);
			final byte[] bytes = new byte[1024];
			int length;
			while((length = fis.read(bytes)) >= 0) {
				zipOut.write(bytes, 0, length);
			}
			zipOut.close();
			fis.close();
			fos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
    }
	
	@GetMapping("/backup_db_path")
	public @ResponseBody Map<String, Object> read_sql_with_param(
			HttpServletRequest request
			,Principal principal
			) {
		logger.info("\n\n-- 25 -- /backup_db_path"
				+ "\n"+ env.getProperty("spring.mail.host")
				+ "\n"+ env.getProperty("config.server.backup_db_path")
				);
		Map<String, Object> map = new HashMap<>();
		String backup_db_path = env.getProperty("config.server.backup_db_path");
		map.put("backup_db_path", backup_db_path);
		return map;
	}
	
}
