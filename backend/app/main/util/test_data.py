from datetime import datetime

from app.main import db
from app.main.model.allergen import Allergen
from app.main.model.host import Host
from app.main.model.invitation import Invitation
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
    if not Invitation.query.all():
        db.session.add(Invitation(name="Smith", code='example1'))
        db.session.add(Invitation(name="Jones", code='example2'))
    if not Host.query.all():
        db.session.add(Host(
            username='user@example.com',
            password='example',
            registered_on=datetime.utcnow()
        ))

    db.session.commit()
