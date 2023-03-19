package com.mshz.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import com.mshz.domain.enumeration.NotifType;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.InstantFilter;

/**
 * Criteria class for the {@link com.mshz.domain.Notification} entity. This class is used
 * in {@link com.mshz.web.rest.NotificationResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /notifications?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class NotificationCriteria implements Serializable, Criteria {
    /**
     * Class for filtering NotifType
     */
    public static class NotifTypeFilter extends Filter<NotifType> {

        public NotifTypeFilter() {
        }

        public NotifTypeFilter(NotifTypeFilter filter) {
            super(filter);
        }

        @Override
        public NotifTypeFilter copy() {
            return new NotifTypeFilter(this);
        }

    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter title;

    private NotifTypeFilter type;

    private StringFilter link;

    private BooleanFilter seen;

    private BooleanFilter blankTarget;

    private LongFilter senderId;

    private LongFilter targetId;

    private StringFilter tag;

    private InstantFilter createdAt;

    public NotificationCriteria() {
    }

    public NotificationCriteria(NotificationCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.title = other.title == null ? null : other.title.copy();
        this.type = other.type == null ? null : other.type.copy();
        this.link = other.link == null ? null : other.link.copy();
        this.seen = other.seen == null ? null : other.seen.copy();
        this.blankTarget = other.blankTarget == null ? null : other.blankTarget.copy();
        this.senderId = other.senderId == null ? null : other.senderId.copy();
        this.targetId = other.targetId == null ? null : other.targetId.copy();
        this.tag = other.tag == null ? null : other.tag.copy();
        this.createdAt = other.createdAt == null ? null : other.createdAt.copy();
    }

    @Override
    public NotificationCriteria copy() {
        return new NotificationCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getTitle() {
        return title;
    }

    public void setTitle(StringFilter title) {
        this.title = title;
    }

    public NotifTypeFilter getType() {
        return type;
    }

    public void setType(NotifTypeFilter type) {
        this.type = type;
    }

    public StringFilter getLink() {
        return link;
    }

    public void setLink(StringFilter link) {
        this.link = link;
    }

    public BooleanFilter getSeen() {
        return seen;
    }

    public void setSeen(BooleanFilter seen) {
        this.seen = seen;
    }

    public BooleanFilter getBlankTarget() {
        return blankTarget;
    }

    public void setBlankTarget(BooleanFilter blankTarget) {
        this.blankTarget = blankTarget;
    }

    public LongFilter getSenderId() {
        return senderId;
    }

    public void setSenderId(LongFilter senderId) {
        this.senderId = senderId;
    }

    public LongFilter getTargetId() {
        return targetId;
    }

    public void setTargetId(LongFilter targetId) {
        this.targetId = targetId;
    }

    public StringFilter getTag() {
        return tag;
    }

    public void setTag(StringFilter tag) {
        this.tag = tag;
    }

    public InstantFilter getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(InstantFilter createdAt) {
        this.createdAt = createdAt;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final NotificationCriteria that = (NotificationCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(title, that.title) &&
            Objects.equals(type, that.type) &&
            Objects.equals(link, that.link) &&
            Objects.equals(seen, that.seen) &&
            Objects.equals(blankTarget, that.blankTarget) &&
            Objects.equals(senderId, that.senderId) &&
            Objects.equals(targetId, that.targetId) &&
            Objects.equals(tag, that.tag) &&
            Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        title,
        type,
        link,
        seen,
        blankTarget,
        senderId,
        targetId,
        tag,
        createdAt
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NotificationCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (title != null ? "title=" + title + ", " : "") +
                (type != null ? "type=" + type + ", " : "") +
                (link != null ? "link=" + link + ", " : "") +
                (seen != null ? "seen=" + seen + ", " : "") +
                (blankTarget != null ? "blankTarget=" + blankTarget + ", " : "") +
                (senderId != null ? "senderId=" + senderId + ", " : "") +
                (targetId != null ? "targetId=" + targetId + ", " : "") +
                (tag != null ? "tag=" + tag + ", " : "") +
                (createdAt != null ? "createdAt=" + createdAt + ", " : "") +
            "}";
    }

}
