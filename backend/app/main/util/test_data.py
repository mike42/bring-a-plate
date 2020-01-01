from app.main import db
from app.main.model.allergen import Allergen
from app.main.model.special_preparation import SpecialPreparation


def go():
    if not Allergen.query.all():
        db.session.add(Allergen(name="Eggs"))
        db.session.add(Allergen(name="Fish"))
        db.session.add(Allergen(name="Milk"))
        db.session.add(Allergen(name="Peanuts"))
        db.session.add(Allergen(name="Sesame seeds"))
        db.session.add(Allergen(name="Shellfish"))
        db.session.add(Allergen(name="Soy"))
        db.session.add(Allergen(name="Tree nuts"))
        db.session.add(Allergen(name="Wheat"))
    if not SpecialPreparation.query.all():
        db.session.add(SpecialPreparation(name="Fructose free"))
        db.session.add(SpecialPreparation(name="Gluten free"))
        db.session.add(SpecialPreparation(name="Lactose free"))
        db.session.add(SpecialPreparation(name="Tasty food"))
        db.session.add(SpecialPreparation(name="Vegan"))
        db.session.add(SpecialPreparation(name="Vegetarian"))
    db.session.commit()
