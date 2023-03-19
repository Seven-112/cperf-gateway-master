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
public class MicroProcessNotifService {
    
    
    Logger logger = LoggerFactory.getLogger(MicroProcessNotifService.class);

    private static final String BASE_URL = "baseUrl";
    
    private final JHipsterProperties jHipsterProperties;

    private final MailService mailService;
    
    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    private final WSNotificationManager wsNotificationManager;

    public MicroProcessNotifService(MailService mailService, 
     JHipsterProperties jHipsterProperties, MessageSource messageSource,
     SpringTemplateEngine templateEngine, WSNotificationManager wsNotificationManager){
        this.mailService = mailService;
        this.jHipsterProperties = jHipsterProperties;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
        this.wsNotificationManager = wsNotificationManager;

    }

    public void sendNotification(NotifTriggerDTO note, UserExtra userExtra){
        if(note != null && note.getAction() != null &&  userExtra != null && userExtra.getUser() != null){
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
        Long firstEntityId = (note.getEntities() != null && !note.getEntities().isEmpty()) ? note.getEntities().get(0).getId() : null;
        if(note != null){
            String title = messageSource.getMessage("process.notif.title", null, locale);
            String content = "";
            String link = "/todolist/process"; // default link for task status change notif
            boolean linkBlankTarget = false;
            String entity = joinNoteEntities(note.getEntities());
            switch(note.getAction()){
                case TASK_STARTED:
                    content = messageSource.getMessage("task.started", new String[]{entity}, locale);
                    link = link.concat("/execute");
                    break;
                case TASK_EXECUTED:
                    content = messageSource.getMessage("task.executed", new String[]{entity}, locale);
                    link = link.concat("/submit");
                    break;
                case TASK_SUBMITTED:
                    content = messageSource.getMessage("task.submitted", new String[]{entity}, locale);
                    link = link.concat("/validate");
                    break;
                case TASK_COMPLETED:
                    content = messageSource.getMessage("task.completed", new String[]{entity}, locale);
                    link = link.concat("/yourTasks");
                    break;
                case TASK_CANCELED:
                    content = messageSource.getMessage("task.canceled", new String[]{entity}, locale);
                    link = link.concat("/yourTasks");
                    break;
                case TASK_LOG_CREATED:
                    content = messageSource.getMessage("task.log.created", new String[]{entity}, locale);
                    link = link.concat("/yourTasks");
                    break;
                case TASK_LOG_UPDATED:
                    content = messageSource.getMessage("task.log.updated", new String[]{entity}, locale);
                    link = link.concat("/yourTasks");
                    break;
                case TASK_ITEM_TO_CHECK:
                    content = messageSource.getMessage("task.item.created", new String[]{entity}, locale);
                    link = link.concat("/checkList");
                    break;
                case TASK_ITEM_CHECKED:
                    content = messageSource.getMessage("task.item.checked", new String[]{entity}, locale);
                    link = link.concat("/checkList");
                    break;
                case TASK_ITEM_UNCHECKED:
                    content = messageSource.getMessage("task.item.uncheked", new String[]{entity}, locale);
                    link = link.concat("/checkList");
                    break;
                case TASK_TO_CHECK:
                    content = messageSource.getMessage("task.item.tocheck", new String[]{entity}, locale);
                    link = link.concat("/checkList");
                    break;
                case PROCESS_CANCELED:
                    content = messageSource.getMessage("process.canceled", new String[]{entity}, locale);
                    link = (firstEntityId == null) ? link.concat("") : "/process/"+firstEntityId+"/logigram";
                    break;
                case PROCESS_EXECUTED:
                    content = messageSource.getMessage("process.executed", new String[]{entity}, locale);
                    link = (firstEntityId == null) ? link.concat("") : "/process/"+firstEntityId+"/logigram";
                    break;
                default:
                    content = messageSource.getMessage("task.status.changed.body", new String[]{entity}, locale);
                    link = link.concat("/yourTasks");
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
