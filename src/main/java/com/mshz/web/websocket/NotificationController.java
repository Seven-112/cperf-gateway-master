package com.mshz.web.websocket;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import com.mshz.web.websocket.dto.NotifEntity;
import com.mshz.web.websocket.dto.NotifTriggerDTO;
import com.mshz.web.websocket.dto.NotificationDTO;

import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class NotificationController {

    Logger logger = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationDispatcher notifMailService;

    public NotificationController(NotificationDispatcher notifMailService) {
        this.notifMailService = notifMailService;
    }
    

    @MessageMapping("/topic/notify")
    @SendToUser("/topic/notifications")
    public NotificationDTO index(@Payload NotificationDTO notification){
        return notification;
    }

    @PostMapping("/topic/api/notify")
    @ResponseBody
    @ResponseStatus(value = HttpStatus.OK)
    public void apiNotifInterceptor(@RequestBody NotifTriggerDTO note, HttpServletRequest request){
        logger.info("received notification {}", note.toString());
        note.setSenderLogin(request.getRemoteUser());
        // remove html tag to notification entities names
        if(note.getEntities() != null){
            List<NotifEntity> htmlStriptedEntities = note.getEntities()
                .stream().map(ne -> {
                     ne.setName(Jsoup.parse(ne.getName()).text());
                     return ne;
                 }).collect(Collectors.toList());
            note.setEntities(htmlStriptedEntities);
        }
        notifMailService.dispatchNotification(note);
    }
}
