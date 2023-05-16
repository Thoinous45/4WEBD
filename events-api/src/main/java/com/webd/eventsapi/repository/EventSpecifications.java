package com.webd.eventsapi.repository;

import com.webd.eventsapi.model.Event;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;
import java.util.List;


public interface EventSpecifications {

    static Specification<Event> nameContains(String name) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    static Specification<Event> addressContains(String address) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("address")), "%" + address.toLowerCase() + "%");
    }

    static Specification<Event> startDateEquals(Date startDate) {
        return (root, query, builder) -> {
            // extract the date part from the start date attribute of the Event entity
            Expression<Date> startDateExpr = builder.function("date", Date.class, root.get("startDate"));

            // extract the date part from the provided startDate parameter
            Expression<Date> startDateParamExpr = builder.function("date", Date.class, builder.literal(startDate));

            // compare the two date parts for equality
            return builder.equal(startDateExpr, startDateParamExpr);
        };
    }

    static Specification<Event> hasFreePlaces() {
        return (root, query, builder) -> builder.greaterThan(root.get("nbOfPlaces"), 0);
    }

    static Specification<Event> eventTypeIn(List<Long> eventTypeIds) {
        return (root, query, builder) -> root.get("eventType").get("id").in(eventTypeIds);
    }

    // add more static methods as needed
}