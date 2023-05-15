package com.webd.eventsapi.service;

import com.webd.eventsapi.model.Event;
import com.webd.eventsapi.model.dto.EventSearchRequest;
import com.webd.eventsapi.repository.EventRepository;
import com.webd.eventsapi.repository.EventSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }

    @Override
    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    @Override
    public Page<Event> searchEvents(EventSearchRequest request, Pageable pageable) {
        Specification<Event> spec = Specification.where(null);

        if (request.getNameContains() != null) {
            spec = spec.and(EventSpecifications.nameContains(request.getNameContains()));
        }

        if (request.getAddressContains() != null) {
            spec = spec.and(EventSpecifications.addressContains(request.getAddressContains()));
        }

        if (request.getStartDateEquals() != null) {
            spec = spec.and(EventSpecifications.startDateEquals(request.getStartDateEquals()));
        }

        if (request.isAvailable()) {
            spec = spec.and(EventSpecifications.hasFreePlaces());
        }

        if (request.getEventTypeIdsIn() != null && !request.getEventTypeIdsIn().isEmpty()) {
            spec = spec.and(EventSpecifications.eventTypeIn(request.getEventTypeIdsIn()));
        }

        return eventRepository.findAll(spec, pageable);
    }

    @Override
    public Event createEvent(Event event) {
        assert event.getId() == null;
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Event event) {
        eventRepository.findById(event.getId()).orElseThrow();
        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long eventId) {
        Event eventToDelete = eventRepository.findById(eventId).orElseThrow();
        eventRepository.delete(eventToDelete);
    }
}
