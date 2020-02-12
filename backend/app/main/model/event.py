from sqlalchemy.orm import relationship

from app.main import db
from app.main.model.weak_entities import event_has_host


class Event(db.Model):
    """ Events """
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    hosts = relationship(
        "Host",
        secondary=event_has_host,
        back_populates="events")
    invitations = relationship("Invitation")

    # TODO Start date, end date, location
    # created_on = db.Column(db.DateTime, nullable=False)
