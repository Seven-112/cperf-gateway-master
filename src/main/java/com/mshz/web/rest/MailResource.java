package com.mshz.web.rest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import  com.mshz.service.MailService;

@RestController
@RequestMapping("/api")
public class MailResource {
    
    private final Logger log = LoggerFactory.getLogger(MailResource.class);

    private static final String ENTITY_NAME = "department";

    @Autowired
    private MailService mailService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    /**
     * {@code GET  /send-providers-tender-lunched-emails/:emails} : send tender lunched email to the "emails".
     *
     * @param emails the emails of providers.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @GetMapping("/send-providers-tender-lunched-emails/{emails}")
    public ResponseEntity<Void> sendProvidersTenderLunchedEmails(@PathVariable String[] emails) {
        log.debug("REST request to send tender lunched emails");
        if(emails != null){
            for(int i=0; i < emails.length; i++){
                mailService.setTenderLunchedMail(emails[i]);
            }
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * {@code GET  /send-providers-tender-lunched-emails/:emails} : send tender lunched email to the "emails".
     *
     * @param emails the emails of providers.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @GetMapping("/send-email-to-tender-selected-provider")
    public ResponseEntity<Void> sendTenderSelectedProviderEmail(
        @RequestParam(name = "object", value = "") String object,
        @RequestParam("email") String email) {
        log.debug("REST request to send tender lunched emails");
        if(email != null){
            mailService.sentTenderSelectedProviderMail(object,email);
        }
        return ResponseEntity.noContent().build();
    }
}
