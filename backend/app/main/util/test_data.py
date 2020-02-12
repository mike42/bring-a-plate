from datetime import datetime

from app.main import db
from app.main.model.allergen import Allergen
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
        db.session.add(SpecialPreparation(name="Fructose free"))
        db.session.add(SpecialPreparation(name="Gluten free"))
        db.session.add(SpecialPreparation(name="Lactose free"))
        db.session.add(SpecialPreparation(name="Tasty food"))
        db.session.add(SpecialPreparation(name="Vegan"))
        db.session.add(SpecialPreparation(name="Vegetarian"))
    if not Event.query.all():
        example_event = Event(name="Example Event")

        smith_family = Invitation(name="Smith family", code='example1')
        example_event.invitations.append(smith_family)
        smith_family.people.append(InvitationPerson(name="Sally"))
        smith_family.people.append(InvitationPerson(name="Sam"))
        smith_family.people.append(InvitationPerson(name="Shaun"))
        jones_family = Invitation(name="Jones family", code='example2')
        jones_family.people.append(InvitationPerson(name="John"))
        jones_family.people.append(InvitationPerson(name="Jim"))
        jones_family.people.append(InvitationPerson(name="Joanne"))
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
