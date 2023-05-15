package com.webd.eventsapi.service;

import com.webd.eventsapi.model.EventType;
import com.webd.eventsapi.repository.EventTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventTypeServiceImpl implements EventTypeService {

    private final EventTypeRepository eventTypeRepository;

    @Override
    public List<EventType> getAllEventTypes() {
        return eventTypeRepository.findAll();
    }

    @Override
    public EventType createEventType(EventType eventType) {
        assert eventType.getId() == null;
        return eventTypeRepository.save(eventType);
    }

    @Override
    public EventType updateEventType(EventType eventType) {
        eventTypeRepository.findById(eventType.getId()).orElseThrow();
        return eventTypeRepository.save(eventType);
    }

    @Override
    public void deleteEventType(Long eventTypeId) {
        eventTypeRepository.deleteById(eventTypeId);
    }
}
