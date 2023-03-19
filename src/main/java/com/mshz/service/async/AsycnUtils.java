package com.mshz.service.async;

import java.time.ZonedDateTime;

import com.mshz.repository.NotificationRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AsycnUtils {
    private final Logger log = LoggerFactory.getLogger(AsycnUtils.class);
    
    private final NotificationRepository notificationRepository;

    public AsycnUtils( NotificationRepository notificationRepository){
        this.notificationRepository = notificationRepository;
    }


    public void deleteSeenNotifications(){
        log.info("deleting seen notification fro the last week");
        ZonedDateTime zd = ZonedDateTime.now().minusWeeks(1);
        notificationRepository.deleteBySeenTrueAndCreatedAtIsNullOrCreatedAtLessThanEqual(zd.toInstant());
    }
}
