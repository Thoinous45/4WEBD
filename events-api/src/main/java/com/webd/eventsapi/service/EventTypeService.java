package com.webd.eventsapi.service;

import com.webd.eventsapi.model.EventType;

import java.util.List;

public interface EventTypeService {
    List<EventType> getAllEventTypes();

    EventType createEventType(EventType eventType);

    EventType updateEventType(EventType eventType);

    void deleteEventType(Long eventTypeId);
}
