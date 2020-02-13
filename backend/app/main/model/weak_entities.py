from sqlalchemy import Table, Column, Integer, ForeignKey, Boolean

from app.main import db

event_has_host = Table('event_has_host', db.Model.metadata,
                       Column('event_id', Integer, ForeignKey('event.id')),
                       Column('host_id', Integer, ForeignKey('host.id'))
                       )

person_has_special_preparation = Table('person_has_preparation', db.Model.metadata,
                                       Column('person_id', Integer, ForeignKey('invitationperson.id')),
                                       Column('special_preparation_id', Integer, ForeignKey('special_preparation.id')))

person_has_allergen = Table('person_has_allergen', db.Model.metadata,
                            Column('person_id', Integer, ForeignKey('invitationperson.id')),
                            Column('allergen_id', Integer, ForeignKey('allergen.id')))
