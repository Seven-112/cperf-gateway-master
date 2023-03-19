package com.mshz.web.websocket;

import java.time.Instant;

import com.mshz.domain.Notification;
import com.mshz.domain.enumeration.NotifType;
import com.mshz.repository.NotificationRepository;
import com.mshz.web.websocket.dto.NotificationDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WSNotificationManager {
    Logger logger = LoggerFactory.getLogger(WSNotificationManager.class);

    private final SimpMessagingTemplate simpMessagingTemplate;

    private static final String WS_MESSAGE_TRANSFER_DESTINATION = "/topic/notifications";

    private final NotificationRepository notificationRepository;

    WSNotificationManager(SimpMessagingTemplate simpMessagingTemplate, 
        NotificationRepository notificationRepository) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.notificationRepository = notificationRepository;
    }

    public void sendNotification(NotificationDTO dto, boolean saveInDB){
        if(saveInDB)
            saveNotificationInDB(dto);
        else
            sendNoteToUser(dto);
    }

    private void saveNotificationInDB(NotificationDTO dto){
        if(dto != null && dto.getDestUserName() != null && dto.getId() == null){
            Notification entity = new Notification();
            entity.seen(false);
            entity.senderId(dto.getSenderId());
            entity.setBlankTarget(dto.getBlankTarget());
            entity.setLink(dto.getLink());
            entity.setNote(dto.getNote());
            entity.setTitle(dto.getTitle());
            entity.setTargetId(dto.getTargetId());
            entity.setType(NotifType.INFO);
            entity.setTag(dto.getTag());
            entity.setCreatedAt(Instant.now());
            notificationRepository.save(entity);
            if(entity != null){
                dto.setId(entity.getId());
            }
            dto.setType(NotifType.INFO);
            sendNoteToUser(dto);
        }
    }

    private void sendNoteToUser(NotificationDTO dto){
        if(dto != null && dto.getDestUserName() != null){
            logger.info("sending ws notigication to user: {}", dto.getDestUserName());
            simpMessagingTemplate.convertAndSendToUser(dto.getDestUserName(), WS_MESSAGE_TRANSFER_DESTINATION, dto);
        }
    }

    
}
