package com.acronexus.service;

import com.acronexus.dto.request.NotificationRequest;
import com.acronexus.dto.response.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    NotificationResponse createNotification(NotificationRequest request);
    NotificationResponse updateNotification(UUID id, NotificationRequest request);
    void deleteNotification(UUID id);
    NotificationResponse getNotification(UUID id);
    List<NotificationResponse> listUserNotifications(UUID userId);
    List<NotificationResponse> getMyNotifications();
    void markAsRead(UUID id);
    void markAllAsRead();
    long getUnreadCount();
}
