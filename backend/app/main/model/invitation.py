import enum

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.main import db
from app.main.model.weak_entities import person_has_special_preparation, person_has_allergen


class Attending(enum.Enum):
    YES = 1
    NO = 2
    NO_RESPONSE = 3


class Invitation(db.Model):
    """ Invitations to events """
    __tablename__ = "invitation"

    # TODO event ID ??
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    code = db.Column(db.String(255), unique=True, nullable=False)
    event_id = db.Column(db.Integer, ForeignKey('event.id'))

    people = relationship("InvitationPerson")
    dishes = relationship("Dish")

    def __repr__(self):
        return "<Invitation '{}'>".format(self.name)


class InvitationPerson(db.Model):
    """ People on the invitation """
    __tablename__ = "invitationperson"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    invitation_id = db.Column(db.Integer, ForeignKey('invitation.id'))
    response = db.Column(db.Enum(Attending), default=Attending.NO_RESPONSE)
    special_preparations = relationship(
        "SpecialPreparation",
        secondary=person_has_special_preparation,
        back_populates="people",
        lazy='dynamic')
    allergens = relationship(
        "Allergen",
        secondary=person_has_allergen,
        back_populates="people",
        lazy='dynamic')

    def __repr__(self):
        return "<InvitationPerson '{}'>".format(self.name)
