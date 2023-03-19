package com.mshz.web.websocket.dto;

import java.time.Instant;

import com.mshz.domain.enumeration.NotifType;

public class NotificationDTO{
    private Long id;
    private String destUserName;
    private String title;
    private String note;
    private String link;
    private NotifType type;
    private Instant createdAt;
    private Long senderId;
    private Long targetId;
    private Boolean seen;
    private Boolean blankTarget;
    private String tag;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDestUserName() {
        return destUserName;
    }

    public void setDestUserName(String destUserName) {
        this.destUserName = destUserName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public NotifType getType() {
        return type;
    }

    public void setType(NotifType type) {
        this.type = type;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public Boolean isSeen() {
        return seen;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    public Boolean isBlankTarget() {
        return blankTarget;
    }

    public void setBlankTarget(Boolean blankTarget) {
        this.blankTarget = blankTarget;
    }

    public Boolean getSeen() {
        return this.seen;
    }


    public Boolean getBlankTarget() {
        return this.blankTarget;
    }


    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NotificationDTO)) {
            return false;
        }
        return id != null && id.equals(((NotificationDTO) o).id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "{" +
            "id:" + getId() +
            ", title:'" + getTitle() + "'" +
            ", note:'" + getNote() + "'" +
            ", link:'" + getLink() + "'" +
            ", type:'" + getType() + "'" +
            ", createdAt:'" + getCreatedAt() + "'" +
            ", senderId:" + getSenderId() +
            ", targetId:" + getTargetId() +
            ", tag:" + getTag() +
            ", seen:'" + isSeen() + "'" +
            "}";
    }
}
