from app.main import db


class SpecialPreparation(db.Model):
    """ Special preparation """
    __tablename__ = "special_preparation"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def __repr__(self):
        return "<SpecialPreparation '{}'>".format(self.name)
