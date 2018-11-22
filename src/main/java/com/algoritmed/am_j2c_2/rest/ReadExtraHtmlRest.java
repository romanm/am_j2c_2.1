package com.algoritmed.am_j2c_2.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/r/h")
public class ReadExtraHtmlRest extends ReadExtraFileRest{
	ReadExtraHtmlRest(){
		fileType = ".html";
//		headContentType = "text/plain;";
		headContentType = "text/html;";
	}
}
