from app.main import db


class Allergen(db.Model):
    """ Allergens """
    __tablename__ = "allergen"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def __repr__(self):
        return "<Allergen '{}'>".format(self.name)
