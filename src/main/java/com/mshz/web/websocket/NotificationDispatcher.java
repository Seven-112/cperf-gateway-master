package com.mshz.web.websocket;

import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.mshz.domain.UserExtra;
import com.mshz.repository.UserExtraRepository;
import com.mshz.web.websocket.dto.NotifAction;
import com.mshz.web.websocket.dto.NotifTriggerDTO;
import com.mshz.web.websocket.service.MicroProcessNotifService;
import com.mshz.web.websocket.service.MicroProjectNotifService;
import com.mshz.web.websocket.service.MicroRiskNotifService;
import com.mshz.web.websocket.service.QmanagerNotifService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationDispatcher {
    
    Logger logger = LoggerFactory.getLogger(NotificationDispatcher.class);

    private final MicroProcessNotifService microProcessService;

    private final UserExtraRepository userExtraRepository;

    private final QmanagerNotifService qmanagerNotifService;

    private final MicroRiskNotifService riskNotifService;

    private final MicroProjectNotifService projectNotifService;

    public NotificationDispatcher(
        MicroProcessNotifService microProcessService,
        UserExtraRepository userExtraRepository,  
        QmanagerNotifService qmanagerNotifService,
        MicroRiskNotifService riskNotifService,
        MicroProjectNotifService projectNotifService
    ){
        this.microProcessService = microProcessService;
        this.userExtraRepository = userExtraRepository;
        this.qmanagerNotifService = qmanagerNotifService;
        this.riskNotifService = riskNotifService;
        this.projectNotifService = projectNotifService;
    }


    private boolean isMicroProcessNotification(NotifAction action){
        return (action != null && action.name() != null && (action.name().startsWith("TASK_") || action.name().startsWith("PROCESS_")));
    }

    private boolean isQueryManagerNotification(NotifAction action){
        return (action != null && action.name() != null && action.name().startsWith("Q_"));
    }
    
    private boolean isMicroRiskNotification(NotifAction action){
        return (action != null && action.name() != null && (action.name().startsWith("AUDIT_") || action.name().startsWith("RECOM_")));
    }

    private boolean isMicroProjectNotification(NotifAction action){
        return (action != null && action.name() != null && action.name().startsWith("PRJ_TASK_"));
    }

    @Async
    public void dispatchNotification(NotifTriggerDTO note){
        if(note != null && note.getTargetUserIds() != null && !note.getTargetUserIds().isEmpty()){
            try {
                List<Long> targetIds = note.getTargetUserIds().stream()
                .filter(id -> id != null).map(id -> id.longValue())
                .sorted().map(id -> Long.valueOf(id)).collect(Collectors.toList());
                // finding all users
                List<UserExtra> userExtras = userExtraRepository.findDistinctByIdIn(targetIds);
                // sending emails
                for (UserExtra userExtra : userExtras) {
                    if(isMicroProcessNotification(note.getAction())){
                        // notification from the microprocess api service 
                        microProcessService.sendNotification(note, userExtra);
                    }else if(isQueryManagerNotification(note.getAction())){
                        // notification from the qmanager api service 
                        qmanagerNotifService.sendNotification(note, userExtra);
                    }else if(isMicroRiskNotification(note.getAction())){
                        // notification from the risk api service 
                        riskNotifService.sendNotification(note, userExtra);
                    }else if(isMicroProjectNotification(note.getAction())){
                        // notification from the project api service  
                        projectNotifService.sendNotification(note, userExtra);
                    }else{
                        logger.info("notifiction action not identified");
                    }

                }
            } catch (Exception e) {
                logger.error("error {}", e.getMessage());
                e.printStackTrace();
            }
        }
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

}
