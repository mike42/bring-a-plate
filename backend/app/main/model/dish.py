import enum

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.main import db
from app.main.model.weak_entities import dish_has_allergen, dish_has_special_preparation


class FoodType(enum.Enum):
    MAIN = 1
    SALAD = 2
    DESSERT = 3


class Dish(db.Model):
    """ Dish """
    __tablename__ = "dish"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    desc = db.Column(db.String(255), unique=False, nullable=False)

    invitation_id = db.Column(db.Integer, ForeignKey('invitation.id'))
    dish_type = db.Column(db.Enum(FoodType))

    special_preparations = relationship(
        "SpecialPreparation",
        secondary=dish_has_special_preparation,
        back_populates="dishes",
        lazy='dynamic')

    allergens = relationship(
        "Allergen",
        secondary=dish_has_allergen,
        back_populates="dishes",
        lazy='dynamic')
