from sqlalchemy import Table, Column, Integer, ForeignKey

from app.main import db

event_has_host = Table('event_has_host', db.Model.metadata,
                       Column('event_id', Integer, ForeignKey('event.id')),
                       Column('host_id', Integer, ForeignKey('host.id'))
                       )
