package com.webd.eventsapi.service;

import com.webd.eventsapi.model.Event;
import com.webd.eventsapi.model.dto.EventSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface EventService {
    Page<Event> getAllEvents(Pageable pageable);

    Optional<Event> getEventById(Long eventId);

    Page<Event> searchEvents(EventSearchRequest request, Pageable pageable);

    Event createEvent(Event event);

    Event updateEvent(Event event);

    void deleteEvent(Long eventId);
}
