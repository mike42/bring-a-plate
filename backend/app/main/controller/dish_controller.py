from flask import request
from flask_login import login_required
from flask_restplus import Resource, Namespace, fields, abort

from app.main import db
from app.main.model.allergen import Allergen
from app.main.model.dish import Dish, FoodType
from app.main.model.special_preparation import SpecialPreparation

dish_ns = Namespace('Dish', description='Dish operations')

dish_specialpreparation_dto = dish_ns.model('DishSpecialPreparation', {
    'id': fields.Integer(required=True, description='ID'),
    'name': fields.String(required=True, description='Name'),
})

dish_allergen_dto = dish_ns.model('DishAllergen', {
    'id': fields.Integer(required=True, description='ID'),
    'name': fields.String(required=True, description='Name'),
})

# dish_invitation_id_dto = dish_ns.model('DishInvitationId', {
#     'id': fields.Integer(required=True, description='ID'),
# })

dish_dto = dish_ns.model('Dish', {
    'id': fields.Integer(description='Dish ID'),
    'name': fields.String(required=True, description='Dish Name'),
    'desc': fields.String(required=True, description='Dish description'),
    'dish_type': fields.String(required=True, description='Type of dish'),
    'special_preparations': fields.List(fields.Nested(dish_specialpreparation_dto)),
    'allergens': fields.List(fields.Nested(dish_allergen_dto)),
    'invitation_id': fields.Integer(description='Invitation ID'),
})


@dish_ns.route('/')
class DishListResource(Resource):
    @dish_ns.marshal_list_with(dish_dto, envelope='items')
    @login_required
    def get(self):
        return Dish.query.all()

    @dish_ns.expect(dish_dto)
    @login_required
    def post(self):
        if request.json['dish_type'] == 'FoodType.DESSERT':
            dt = FoodType.DESSERT
        elif request.json['dish_type'] == 'FoodType.SALAD':
            dt = FoodType.SALAD
        elif request.json['dish_type'] == 'FoodType.MAIN':
            dt = FoodType.MAIN
        else:
            abort(400, 'Invalid dish type')
        dish = Dish(
            name=request.json['name'],
            dish_type=dt,
            desc=request.json['desc'],
            invitation_id=request.json['invitation_id'])
        # Find and add related entities
        for special_preparation in request.json['special_preparations']:
            dish.special_preparations.append(SpecialPreparation.query.filter_by(id=special_preparation['id']).first())
        for allergen in request.json['allergens']:
            dish.allergens.append(Allergen.query.filter_by(id=allergen['id']).first())
        db.session.add(dish)
        db.session.commit()
        return {}


@dish_ns.response(404, 'Dish not found')
@dish_ns.route('/<int:id>')
class DishResource(Resource):
    @dish_ns.marshal_list_with(dish_dto)
    @login_required
    def get(self, id):
        the_dish = Dish.query.filter_by(id=id).first()
        if the_dish is None:
            abort(404, 'Dish not found')
        return the_dish

    @dish_ns.expect(dish_dto)
    @login_required
    def put(self, id):
        the_dish = Dish.query.filter_by(id=id).first()
        if the_dish is None:
            abort(404, 'Dish not found')
        if request.json['dish_type'] == 'FoodType.DESSERT':
            the_dish.dish_type = FoodType.DESSERT
        elif request.json['dish_type'] == 'FoodType.SALAD':
            the_dish.dish_type = FoodType.SALAD
        elif request.json['dish_type'] == 'FoodType.MAIN':
            the_dish.dish_type = FoodType.MAIN
        else:
            abort(400, 'Invalid dish type')
        the_dish.name = request.json['name']
        the_dish.desc = request.json['desc']
        the_dish.special_preparations = []
        for special_preparation in request.json['special_preparations']:
            the_dish.special_preparations.append(SpecialPreparation.query.filter_by(id=special_preparation['id']).first())
        the_dish.allergens = []
        for allergen in request.json['allergens']:
            the_dish.allergens.append(Allergen.query.filter_by(id=allergen['id']).first())

        db.session.commit()
        return {}

    @login_required
    def delete(self, id):
        the_dish = Dish.query.filter_by(id=id).first()
        if the_dish is None:
            abort(404, 'Dish not found')
        db.session.delete(the_dish)
        db.session.commit()
        return {}
