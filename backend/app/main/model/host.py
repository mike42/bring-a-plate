from sqlalchemy.orm import relationship

from .weak_entities import event_has_host
from .. import db, flask_bcrypt


# Based on 'User' example https://github.com/cosmic-byte/flask-restplus-boilerplate
class Host(db.Model):
    """ Event hosts """
    __tablename__ = "host"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    username = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(100))
    events = relationship(
        "Event",
        secondary=event_has_host,
        back_populates="hosts")

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = flask_bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return flask_bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User '{}'>".format(self.username)
