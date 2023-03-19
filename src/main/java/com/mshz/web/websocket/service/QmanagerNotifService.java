package com.mshz.web.websocket.service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import com.mshz.domain.UserExtra;
import com.mshz.domain.enumeration.NotifType;
import com.mshz.service.MailService;
import com.mshz.web.websocket.WSNotificationManager;
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
public class QmanagerNotifService {
    Logger logger = LoggerFactory.getLogger(QmanagerNotifService.class);

    private static final String BASE_URL = "baseUrl";
    
    private final JHipsterProperties jHipsterProperties;

    private final MailService mailService;
    
    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    private final WSNotificationManager wsNotificationManager;
    
    public QmanagerNotifService(MailService mailService, 
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
            String title = messageSource.getMessage("query.notif.title", null, locale);
            String content = "";
            String link = "/todolist/queries"; // default link for task status change notif
            boolean linkBlankTarget = false;
            String entity = joinNoteEntities(note.getEntities());
            switch(note.getAction()){
                case Q_CREATED:
                    // title = messageSource.getMessage("query.created.title", null, locale);
                    content = messageSource.getMessage("query.created", new String[]{entity}, locale);
                    break;
                case Q_INSANCE_CREATED:
                    // title = messageSource.getMessage("query.instance.created.title", null, locale);
                    content = messageSource.getMessage("query.instance.created", new String[]{entity}, locale);
                    break;
                case Q_INSTANCE_TO_VALIDE: 
                case Q_INSTANCE_TO_POST_VALIDATE:
                    // title = messageSource.getMessage("query.insatance.tovalide.title", null, locale);
                    content = messageSource.getMessage("query.insatance.tovalide", new String[]{entity}, locale);
                    link = link.concat("/toValidate");
                    break;
                case Q_INSTANCE_VALIDATED:
                    // title = messageSource.getMessage("query.insatance.tovalide.title", null, locale);
                    content = messageSource.getMessage("query.insatance.validated", new String[]{entity}, locale);
                    break;
                case Q_INSTANCE_REJECTED:
                    // title = messageSource.getMessage("query.insatance.tovalide.title", null, locale);
                    content = messageSource.getMessage("query.insatance.rejected", new String[]{entity}, locale);
                    break; 
                default:
                    content = "";
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
