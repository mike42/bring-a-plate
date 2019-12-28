from flask import Flask, Blueprint
from flask_restplus import Api, Resource
import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

app = Flask(__name__)
blueprint = Blueprint('api', __name__, url_prefix='/api')

api = Api(blueprint, version='1.0', title='Bring a Plate',
          description='REST API for event management.')
app.register_blueprint(blueprint)

dish = api.namespace('dish', description='Dish operations')
event = api.namespace('event', description='Event operations')
allergen = api.namespace('allergen', description='Allergen operations')
dietaryRequirement = api.namespace('requirement', description='Dietary requirement operations')

@app.route("/")
def home():
    return "This is an API service, try /api"


@dish.route('/<int:id>')
@dish.response(404, 'Dish not found')
class DishResource(Resource):
    def get(self, id):
        return {'id': id}


@event.route('/')
class EventResource(Resource):
    def get(self):
        '''
        List events visible to this user
        '''
        return []


@event.route('/<int:id>')
@event.response(404, 'Event not found')
class EventResource(Resource):
    def get(self, id):
        return {'id': id}


@allergen.route('/<int:id>')
@allergen.response(404, 'Allergen not found')
class AllergenResource(Resource):
    def get(self, id):
        return {'id': id}

# WIP SQLAlchemy example
class Person(Base):
    __tablename__ = 'person'
    # Here we define columns for the table person
    # Notice that each column is also a normal Python instance attribute.
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)


class Address(Base):
    __tablename__ = 'address'
    # Here we define columns for the table address.
    # Notice that each column is also a normal Python instance attribute.
    id = Column(Integer, primary_key=True)
    street_name = Column(String(250))
    street_number = Column(String(250))
    post_code = Column(String(250), nullable=False)
    person_id = Column(Integer, ForeignKey('person.id'))
    person = relationship(Person)


if __name__ == "__main__":
    engine = create_engine('sqlite:///bring_a_plate.db')
    Base.metadata.create_all(engine)
    app.run()
