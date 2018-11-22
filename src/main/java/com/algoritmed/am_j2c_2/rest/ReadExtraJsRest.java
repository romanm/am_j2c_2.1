package com.algoritmed.am_j2c_2.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/r/j")
public class ReadExtraJsRest extends ReadExtraFileRest{
	ReadExtraJsRest(){
		fileType = ".js";
		headContentType = "text/javascript;";
	}
}
