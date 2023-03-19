package com.mshz.web.rest;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.DiscoveryClient;

@RestController
@RequestMapping("/api/config")
public class ConfigResource {

    Logger log = LoggerFactory.getLogger(ConfigResource.class);

    private final DiscoveryClient discoveryClient;

    @Value("${module.up}")
    private String customServices;

    public ConfigResource(DiscoveryClient discoveryClient){
        this.discoveryClient = discoveryClient;
    }

    @GetMapping("/services")
    public ResponseEntity<List<String>> getServices(){
        log.debug("get all deloyed services");
        List<String> apps = discoveryClient.getServices();
        if(customServices != null){
            if(customServices.toLowerCase().indexOf(",") == -1){
                apps.add(customServices);
            }else{
                String[] cModues = customServices.split(",");
                apps.addAll(Arrays.asList(cModues));
            }
        }
        return ResponseEntity.ok().body(apps);
    }
}
