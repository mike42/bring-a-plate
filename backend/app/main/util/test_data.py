from datetime import datetime

from app.main import db
from app.main.model.allergen import Allergen
from app.main.model.dish import Dish, FoodType
from app.main.model.event import Event
from app.main.model.host import Host
from app.main.model.invitation import Invitation, InvitationPerson
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
        db.session.add(SpecialPreparation(name="Halal"))
        db.session.add(SpecialPreparation(name="Fructose free"))
        db.session.add(SpecialPreparation(name="Gluten free"))
        db.session.add(SpecialPreparation(name="Kosher"))
        db.session.add(SpecialPreparation(name="Lactose free"))
        db.session.add(SpecialPreparation(name="Delicious"))
        db.session.add(SpecialPreparation(name="Vegan"))
        db.session.add(SpecialPreparation(name="Vegetarian"))
    if not Event.query.all():
        example_event = Event(name="Example Event")
        smith_family = Invitation(name="Smith family", code='example1')
        example_event.invitations.append(smith_family)
        smith_family.people.append(InvitationPerson(name="Sally"))
        smith_family.people.append(InvitationPerson(name="Sam"))
        smith_family.people.append(InvitationPerson(name="Shaun"))
        kaleslaw = Dish(name="Kaleslaw", desc="Like coleslaw, but with kale!", dish_type=FoodType.SALAD)
        kaleslaw.special_preparations.append(SpecialPreparation.query.filter_by(name='Vegan').first())
        smith_family.dishes.append(kaleslaw)
        jones_family = Invitation(name="Jones family", code='example2')
        jones_family.people.append(InvitationPerson(name="John"))
        jones_family.people.append(InvitationPerson(name="Jim"))
        jones_family.people.append(InvitationPerson(name="Joanne"))
        lasagne = Dish(name="Lasagne", desc="Layered pasta and meat with cheese", dish_type=FoodType.MAIN)
        lasagne.allergens.append(Allergen.query.filter_by(name='Milk').first())
        lasagne.allergens.append(Allergen.query.filter_by(name='Wheat').first())
        lasagne.special_preparations.append(SpecialPreparation.query.filter_by(name='Delicious').first())
        jones_family.dishes.append(lasagne)
        example_event.invitations.append(jones_family)
        db.session.add(example_event)
    if not Host.query.all():
        example_host = Host(
            username='user@example.com',
            password='example',
            registered_on=datetime.utcnow()
        )
        db.session.add(example_host)
        example_host.events.append(Event.query.filter_by(id=1).first())

    db.session.commit()
