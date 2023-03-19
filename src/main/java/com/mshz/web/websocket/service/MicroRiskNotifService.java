package com.mshz.web.websocket.service;


import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import com.mshz.domain.UserExtra;
import com.mshz.domain.enumeration.NotifType;
import com.mshz.service.MailService;
import com.mshz.web.websocket.WSNotificationManager;
import com.mshz.web.websocket.dto.NotifAction;
import com.mshz.web.websocket.dto.NotifEntity;
import com.mshz.web.websocket.dto.NotifTriggerDTO;
import com.mshz.web.websocket.dto.NotificationDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import io.github.jhipster.config.JHipsterProperties;

@Service
public class MicroRiskNotifService {
    
    
    Logger logger = LoggerFactory.getLogger(MicroRiskNotifService.class);

    private static final String BASE_URL = "baseUrl";
    
    private final JHipsterProperties jHipsterProperties;

    private final MailService mailService;
    
    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    private final WSNotificationManager wsNotificationManager;

    public MicroRiskNotifService(MailService mailService, 
     JHipsterProperties jHipsterProperties, MessageSource messageSource,
     SpringTemplateEngine templateEngine, WSNotificationManager wsNotificationManager){
        this.mailService = mailService;
        this.jHipsterProperties = jHipsterProperties;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
        this.wsNotificationManager = wsNotificationManager;

    }

    public void sendNotification(NotifTriggerDTO note, UserExtra userExtra){
        if(note != null && note.getAction() != null && userExtra != null && userExtra.getUser() != null){
            try{
                Locale locale = Locale.getDefault();
                String langKey =  userExtra.getUser() != null ? userExtra.getUser().getLangKey() : null;
                if(langKey != null)
                    locale = Locale.forLanguageTag(langKey);
                Context context = new Context(locale);
                // initalize notification with translated title and content, link and link target model(_black or not)
                NotificationDTO notif = translateNotificationContent(note, locale);
                // senting others notifications infos
                notif.setCreatedAt(Instant.now());
                notif.setDestUserName(userExtra.getUser().getLogin());
                notif.setSeen(false);
                notif.setSenderId(note.getSenderId());
                notif.setTargetId(userExtra.getUser().getId());
                notif.setType(NotifType.INFO);
                notif.setTag(note.getAction().name());
                notif.setCreatedAt(Instant.now());

                // sentting email template variables
                context.setVariable("title", notif.getTitle());
                context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
                context.setVariable("content", notif.getNote());
                context.setVariable("url", notif.getLink());
                // getting email content from template
                String content = templateEngine.process("/mail/notif/main", context);
                
                String destinataireEmail = (userExtra.getEmployee() != null && userExtra.getEmployee().getEmail() != null)
                                            ? userExtra.getEmployee().getEmail() : userExtra.getUser().getEmail();
                // sending email
                mailService.sendEmail(destinataireEmail, notif.getTitle(), content, false, true);

                // sending app notification
                wsNotificationManager.sendNotification(notif, true);
            }catch(Exception e){
                e.printStackTrace();
            }
        }
    }


    private NotificationDTO translateNotificationContent(NotifTriggerDTO note,Locale locale){
        NotificationDTO dto = new NotificationDTO();
        if(note != null){
            boolean isRecom = note.getAction() != null && note.getAction().name() != null && note.getAction().name().startsWith("RECOM_");
            String defaultTitleKey = isRecom ? "recom.notif.title" : "audit.notif.title";
            String title = messageSource.getMessage(defaultTitleKey,null, locale);
            String defaultContentKey = isRecom ? "recom.status.changed.body" : "audit.status.changed.body";
            String content = "";
            String link = "/todolist"; // default link for task status change notif
            boolean linkBlankTarget = false;
            String entity = joinNoteEntities(note.getEntities());
            switch(note.getAction()){
                case AUDIT_STARTED:
                    content = messageSource.getMessage("audit.started", new String[]{entity}, locale);
                    link = link.concat("/audits/execute");
                    break;
                case RECOM_STARTED:
                    content = messageSource.getMessage("recom.started", new String[]{entity}, locale);
                    link = link.concat("/recommandations/execute");
                    break;
                case AUDIT_EXECUTED:
                    content = messageSource.getMessage("audit.executed", new String[]{entity}, locale);
                    link = link.concat("/audits/submit");
                    break;
                case RECOM_EXECUTED:
                    content = messageSource.getMessage("recom.executed", new String[]{entity}, locale);
                    link = link.concat("/recommandations/submit");
                    break;
                case AUDIT_SUBMITTED:
                    content = messageSource.getMessage("audit.submitted", new String[]{entity}, locale);
                    link = link.concat("/audits/validate");
                    break;
                case RECOM_SUBMITTED:
                    content = messageSource.getMessage("recom.submitted", new String[]{entity}, locale);
                    link = link.concat("/recommandations/validate");
                    break;
                case AUDIT_COMPLETED:
                    content = messageSource.getMessage("audit.completed", new String[]{entity}, locale);
                    link = link.concat("/audits/execute");
                    break;
                case RECOM_COMPLETED:
                    content = messageSource.getMessage("recom.completed", new String[]{entity}, locale);
                    link = link.concat("/recommandations/execute");
                    break;
                case AUDIT_CANCELED:
                    content = messageSource.getMessage("audit.canceled", new String[]{entity}, locale);
                    link = link.concat("/audits/execute");
                    break;
                case RECOM_CANCELED:
                    content = messageSource.getMessage("recom.canceled", new String[]{entity}, locale);
                    link = link.concat("/recommandations/execute");
                    break;
                default:
                    content = messageSource.getMessage(defaultContentKey, new String[]{entity}, locale);
                    link = link.concat("/audits/execute");
            }
            dto.setNote(content);
            dto.setTitle(title);
            dto.setLink(link);
            dto.setBlankTarget(linkBlankTarget);
        }
        return dto;
    }
    
    private String joinNoteEntities(List<NotifEntity> entities){
        if(entities != null && !entities.isEmpty()){
            List<String> names = entities.stream()
                .filter(e -> e.getName() != null)
                .map(e -> e.getName()).collect(Collectors.toList());
            if(names != null && !names.isEmpty())
                return String.join("#", names);
        }
        return "";
    }

}
