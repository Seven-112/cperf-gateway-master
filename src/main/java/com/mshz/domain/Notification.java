package com.mshz.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

import com.mshz.domain.enumeration.NotifType;

/**
 * A Notification.
 */
@Entity
@Table(name = "notification")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Notification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Size(max = 100)
    @Column(name = "title", length = 100)
    private String title;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "note")
    private String note;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotifType type;

    @Column(name = "link")
    private String link;

    @Column(name = "seen")
    private Boolean seen;

    @Column(name = "blank_target")
    private Boolean blankTarget;

    @Column(name = "sender_id")
    private Long senderId;

    @NotNull
    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "tag")
    private String tag;

    @Column(name = "created_at")
    private Instant createdAt;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Notification title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNote() {
        return note;
    }

    public Notification note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public NotifType getType() {
        return type;
    }

    public Notification type(NotifType type) {
        this.type = type;
        return this;
    }

    public void setType(NotifType type) {
        this.type = type;
    }

    public String getLink() {
        return link;
    }

    public Notification link(String link) {
        this.link = link;
        return this;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Boolean isSeen() {
        return seen;
    }

    public Notification seen(Boolean seen) {
        this.seen = seen;
        return this;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    public Boolean isBlankTarget() {
        return blankTarget;
    }

    public Notification blankTarget(Boolean blankTarget) {
        this.blankTarget = blankTarget;
        return this;
    }

    public void setBlankTarget(Boolean blankTarget) {
        this.blankTarget = blankTarget;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Notification senderId(Long senderId) {
        this.senderId = senderId;
        return this;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getTargetId() {
        return targetId;
    }

    public Notification targetId(Long targetId) {
        this.targetId = targetId;
        return this;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getTag() {
        return tag;
    }

    public Notification tag(String tag) {
        this.tag = tag;
        return this;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Notification createdAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Notification)) {
            return false;
        }
        return id != null && id.equals(((Notification) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Notification{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", note='" + getNote() + "'" +
            ", type='" + getType() + "'" +
            ", link='" + getLink() + "'" +
            ", seen='" + isSeen() + "'" +
            ", blankTarget='" + isBlankTarget() + "'" +
            ", senderId=" + getSenderId() +
            ", targetId=" + getTargetId() +
            ", tag='" + getTag() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
