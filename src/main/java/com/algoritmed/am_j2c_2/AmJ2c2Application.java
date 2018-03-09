package com.algoritmed.am_j2c_2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource("classpath:config-app-spring.xml")
public class AmJ2c2Application {

	public static void main(String[] args) {
		SpringApplication.run(AmJ2c2Application.class, args);
	}
}
