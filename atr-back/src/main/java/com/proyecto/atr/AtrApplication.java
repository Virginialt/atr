package com.proyecto.atr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.proyecto.atr")
@EnableJpaRepositories("com.proyecto.atr")
public class AtrApplication {

    public static void main(String[] args) {
        SpringApplication.run(AtrApplication.class, args);
    }
}