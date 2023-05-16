package com.webd.eventsapi.controller;

import com.webd.eventsapi.model.EventType;
import com.webd.eventsapi.service.EventTypeService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-types")
@RequiredArgsConstructor
public class EventTypeController {

    private final EventTypeService eventTypeService;

    @GetMapping
    public ResponseEntity<List<EventType>> getAllEventTypes() {
        return new ResponseEntity<>(eventTypeService.getAllEventTypes(), HttpStatus.OK);
    }

    @PostMapping
    @RolesAllowed("{ADMIN, OPERATOR}")
    public ResponseEntity<EventType> createEventType(@RequestBody EventType eventType) {
        return new ResponseEntity<>(eventTypeService.createEventType(eventType), HttpStatus.CREATED);
    }

    @PutMapping
    @RolesAllowed("{ADMIN, OPERATOR}")
    public ResponseEntity<EventType> updateEventType(@RequestBody EventType eventType) {
        return new ResponseEntity<>(eventTypeService.updateEventType(eventType), HttpStatus.OK);
    }

    @DeleteMapping("/{eventTypeId}")
    @RolesAllowed("{ADMIN, OPERATOR}")
    public ResponseEntity<HttpStatus> deleteEventType(@PathVariable Long eventTypeId) {
        eventTypeService.deleteEventType(eventTypeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
