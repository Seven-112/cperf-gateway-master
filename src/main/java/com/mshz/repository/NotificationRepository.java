package com.mshz.repository;

import java.time.Instant;
import java.util.List;

import com.mshz.domain.Notification;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Notification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {
    List<Notification> findByTargetIdAndSeen(Long targetId, Boolean seen);

    @Modifying(flushAutomatically = true)
    @Query("update Notification note set note.seen=:seen where note.targetId=:targetId")
    void changeUserNotificationsSeenValue(@Param("targetId") Long id, @Param("seen") Boolean seen);

    @Modifying(flushAutomatically = true)
    @Query("update Notification note set note.seen=:seen where note.targetId=:targetId and note.tag=:tag")
    void changeNotificationsSeenByTargetIdAndTag(@Param("targetId") Long id, @Param("tag") String tag, @Param("seen") Boolean seen);

    List<Notification> findByTargetIdOrderBySeen(Long targetId);

    void deleteBySeenTrueAndCreatedAtIsNullOrCreatedAtLessThanEqual(Instant instant);

    List<Notification> findByTargetIdOrderByCreatedAt(Long targetId);

    @Modifying(flushAutomatically = true)
    @Query("update Notification note set note.seen=:seen where note.targetId=:targetId and note.tag IN :tags")
    void changeNotificationsSeenByTargetIdAndTagIn(@Param("targetId") Long id,@Param("tags") List<String> tags,  @Param("seen") Boolean seen);
}
