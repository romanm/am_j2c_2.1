package com.algoritmed.am_j2c_2;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class CommonRest {
	private static final Logger logger = LoggerFactory.getLogger(CommonRest.class);
	
    @GetMapping("/v/index")
    public RedirectView redirectIndex(RedirectAttributes attributes) {
        return new RedirectView("/");
    }
	
	@GetMapping("/v/{page1}")
	public String viewPage1(@PathVariable String page1, Model model) {
		logger.info(" \n\n--27-- --viewPage1-- /v/{page1} "+page1+"\n th_template = "+"\n ");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page1", page1);
		setModelAtribute(model, page1, "ng_template");
		setModelAtribute(model, page1, "script");
		String th_template = (String) 
				setModelAtribute(model, page1, "th_template");
		logger.info(" \n\n--34-- --viewPage1-- /v/{page1} "+page1+"\n th_template = "+th_template+"\n "+map);
		
		return th_template;
	}

	private Object setModelAtribute(Model model, String page1, String attribute) {
		Object att = getModelAttribute(page1, attribute);
		model.addAttribute(attribute, att);
		return att;
	}

	private Object getModelAttribute(String page1, String attribute) {
		Map<String, Object> configWebSite = readJsonFromFile.readConfigWebSite();
		@SuppressWarnings("unchecked")
		Map<String, Object> pageConfig = (Map<String, Object>) configWebSite.get(page1);
		Object ngController = null;
		if(pageConfig != null){
			if(pageConfig.containsKey(attribute))
				ngController = pageConfig.get(attribute);
			else
				ngController = configWebSite.get(attribute);
		}
		return ngController;
	}
	@Autowired	ReadJsonFromFile readJsonFromFile;
}
