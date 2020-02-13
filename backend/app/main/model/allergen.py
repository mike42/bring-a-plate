from sqlalchemy.orm import relationship

from app.main import db
from app.main.model.weak_entities import person_has_allergen


class Allergen(db.Model):
    """ Allergens """
    __tablename__ = "allergen"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    people = relationship(
        "InvitationPerson",
        secondary=person_has_allergen,
        back_populates="allergens")


    def __repr__(self):
        return "<Allergen '{}'>".format(self.name)
