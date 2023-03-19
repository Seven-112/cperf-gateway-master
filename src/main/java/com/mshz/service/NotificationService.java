package com.mshz.service;

import com.mshz.domain.Notification;
import com.mshz.domain.User;
import com.mshz.repository.NotificationRepository;
import com.mshz.repository.UserRepository;
import com.mshz.security.SecurityUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Notification}.
 */
@Service
@Transactional
public class NotificationService {

    private final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a notification.
     *
     * @param notification the entity to save.
     * @return the persisted entity.
     */
    public Notification save(Notification notification) {
        log.debug("Request to save Notification : {}", notification);
        if(notification != null && notification.getCreatedAt() == null)
            notification.setCreatedAt(Instant.now());
        return notificationRepository.save(notification);
    }

    /**
     * Get all the notifications.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Notification> findAll(Pageable pageable) {
        log.debug("Request to get all Notifications");
        return notificationRepository.findAll(pageable);
    }


    /**
     * Get one notification by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Notification> findOne(Long id) {
        log.debug("Request to get Notification : {}", id);
        return notificationRepository.findById(id);
    }

    /**
     * Delete the notification by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Notification : {}", id);
        notificationRepository.deleteById(id);
    }

    /**
     * 
     * @param userId
     * @param seen
     * @return List of founded notifications
     */
    public List<Notification> getUserTargetedNotifications(Long userId, Boolean seen){
        return notificationRepository.findByTargetIdAndSeen(userId, seen);
    }

    public List<Notification> getAllForTarget(){
        String userLogin = SecurityUtils.getCurrentUserLogin().orElse(null);
        if(userLogin != null){
            User user = userRepository.findOneByLogin(userLogin).orElse(null);
            if(user != null)
                return notificationRepository.findByTargetIdOrderByCreatedAt(user.getId());
        }
        return new ArrayList<>();
    }

    public List<Notification> getUserNotifications(Boolean seen) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElse(null);
        if(userLogin != null){
            User user = userRepository.findOneByLogin(userLogin).orElse(null);
            if(user != null)
                return notificationRepository.findByTargetIdAndSeen(user.getId(), seen);
        }
        return new ArrayList<>();
    }

    public void changeUserNotificationsSeenValue(Boolean seen) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElse(null);
        if(userLogin != null){
            User user = userRepository.findOneByLogin(userLogin).orElse(null);
            if(user != null)
                notificationRepository.changeUserNotificationsSeenValue(user.getId(), seen);
        }
    }

    public List<Notification> changeSeenByTargetAndTagIn(List<String> tags, Boolean seen) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElse(null);
        if(userLogin != null){
            User user = userRepository.findOneByLogin(userLogin).orElse(null);
            if(user != null){
                notificationRepository.changeNotificationsSeenByTargetIdAndTagIn(user.getId(), tags, seen);
                return notificationRepository.findByTargetIdAndSeen(user.getId(), seen);
            }
        }
        return new ArrayList<>();
    }
}
