from sqlalchemy.orm import relationship

from app.main import db
from app.main.model.weak_entities import person_has_special_preparation, dish_has_special_preparation


class SpecialPreparation(db.Model):
    """ Special preparation """
    __tablename__ = "special_preparation"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    people = relationship(
        "InvitationPerson",
        secondary=person_has_special_preparation,
        back_populates="special_preparations")
    dishes = relationship(
        "Dish",
        secondary=dish_has_special_preparation,
        back_populates="special_preparations")

    def __repr__(self):
        return "<SpecialPreparation '{}'>".format(self.name)
