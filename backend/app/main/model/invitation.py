from app.main import db


class Invitation(db.Model):
    """ Invitations to events """
    __tablename__ = "invitation"

    # TODO event ID ??
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    code = db.Column(db.String(255), unique=True, nullable=False)

    def __repr__(self):
        return "<SpecialPreparation '{}'>".format(self.name)
