package com.webd.eventsapi.model.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class EventSearchRequest {
    private String nameContains;
    private String addressContains;
    private boolean isAvailable;
    private Date startDateEquals;
    private List<Long> eventTypeIdsIn;
}