package com.webapp.webApp;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Environment env;

    public WebConfig(Environment env) {
        this.env = env;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String staticLocations = env.getProperty("spring.web.resources.static-locations");
        System.out.println("DEBUG: spring.web.resources.static-locations is: " + staticLocations);

        // This is the direct mapping for /uploads/** to your physical uploads folder
        // Make sure this matches your app.upload.dir in application.properties
        String uploadsDir = env.getProperty("app.upload.dir");
        if (uploadsDir != null) {
            System.out.println("DEBUG: Mapping /uploads/** to file path: " + uploadsDir + "/");
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + uploadsDir + "/"); // Ensure trailing slash
        } else {
            System.err.println("ERROR: 'app.upload.dir' property is not set!");
        }

        // Also add default static handler for classpath:/static/ (if you want to keep it)
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}