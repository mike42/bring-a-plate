import enum

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.main import db


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

    def __repr__(self):
        return "<Invitation '{}'>".format(self.name)


class InvitationPerson(db.Model):
    """ People on the invitation """
    __tablename__ = "invitationperson"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    invitation_id = db.Column(db.Integer, ForeignKey('invitation.id'))
    response = db.Column(db.Enum(Attending), default=Attending.NO_RESPONSE)

    def __repr__(self):
        return "<InvitationPerson '{}'>".format(self.name)
