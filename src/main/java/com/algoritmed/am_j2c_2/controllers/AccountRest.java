package com.algoritmed.am_j2c_2.controllers;

import java.security.Principal;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.algoritmed.am_j2c_2.Db2Common;

@PropertySource(value = "classpath:email.properties", encoding="UTF-8")
@Controller
public class AccountRest extends Db2Common{
	protected static final Logger logger = LoggerFactory.getLogger(AccountRest.class);
	@PostMapping("/r/activateAccount")
	public @ResponseBody Map<String, Object> activateAccount(
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
			) {
		
		logger.info("\n\n-- 33 -- \n"
				+ "/r/activateAccount"
				+ "\n"
				+ data
				);
		return data;
	}
	@PostMapping("/r/send_eMail")
	public @ResponseBody Map<String, Object> send_eMail(
			@RequestBody Map<String, Object> data
			,HttpServletRequest request
			,Principal principal
			) {
		logger.info("\n\n-- 46 -- \n"
				+ "/r/send_eMail"
				+ "\n"
				+ data
				);
		try {
			sendEmail(data);
			return data;
		}catch(Exception ex) {
			System.err.println(ex);
			System.err.println("------39-------------------");
			System.err.println(ex.getMessage());
			data.put("ex", ex.getMessage());
			return data;
		}
//		return data;
	}
	private void sendEmail(Map<String, Object> data) throws MessagingException {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		String email = (String) data.get("email");
		System.err.println(email);
		helper.setTo(email);
//		helper.setTo("roman.mishchenko@gmail.com");
		String algoritmedMailSubjectConfirm = env.getProperty("algoritmed.mail.subject.confirm1");
		helper.setSubject(algoritmedMailSubjectConfirm);
		String algoritmedMailConfirm = env.getProperty("algoritmed.mail.sendText.confirm1");
		String uuid = (String) data.get("uuid");
		algoritmedMailConfirm = algoritmedMailConfirm.replaceAll(":uuid", uuid);
		helper.setText(algoritmedMailConfirm, true);
		sender.send(message);
	}

	@Autowired private JavaMailSender sender;

}
