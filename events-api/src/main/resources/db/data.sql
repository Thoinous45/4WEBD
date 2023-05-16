INSERT INTO event_type (name)
VALUES ('Type d''événement 1'),
       ('Type d''événement 2'),
       ('Type d''événement 3'),
       ('Type d''événement 4'),
       ('Type d''événement 5'),
       ('Type d''événement 6'),
       ('Type d''événement 7'),
       ('Type d''événement 8'),
       ('Type d''événement 9'),
       ('Type d''événement 10');

INSERT INTO event (address, description, end_date, name, nb_of_places, start_date, reservation_limit_date,
                   event_type_id, ticket_price)
VALUES ('1 Rue de la Paix, 75001 Paris', 'Description de l''événement 1', '2023-05-10 18:00:00',
        'Nom de l''événement 1', 100, '2023-05-10 16:00:00', date_add(start_date, interval -2 hour), 1, 100.00),
       ('2 Rue de Rivoli, 75001 Paris', 'Description de l''événement 2', '2023-05-11 18:00:00', 'Nom de l''événement 2',
        200, '2023-05-11 16:00:00', date_add(start_date, interval -2 hour), 2, 100.00),
       ('3 Avenue des Champs-Élysées, 75008 Paris', 'Description de l''événement 3', '2023-05-12 18:00:00',
        'Nom de l''événement 3', 300, '2023-05-12 16:00:00', date_add(start_date, interval -2 hour), 3, 100.00),
       ('4 Rue de la Paix, 75001 Paris', 'Description de l''événement 4', '2023-05-13 18:00:00',
        'Nom de l''événement 4', 400, '2023-05-13 16:00:00', date_add(start_date, interval -2 hour), 4, 100.00),
       ('5 Rue de Rivoli, 75001 Paris', 'Description de l''événement 5', '2023-05-14 18:00:00', 'Nom de l''événement 5',
        500, '2023-05-14 16:00:00', date_add(start_date, interval -2 hour), 5, 100.00);
