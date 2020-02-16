import csv
import io

from flask import request, make_response
from flask_login import login_required, current_user
from flask_restplus import Resource, Namespace, fields, abort

from app.main import db
from app.main.model.allergen import Allergen
from app.main.model.dish import Dish, FoodType
from app.main.model.invitation import Invitation
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


@dish_ns.route('/export')
class DishExportResource(Resource):
    @login_required
    def get(self):
        """
        List all dishes (CSV version)
        """
        if not current_user.is_host():
            abort(403, "Forbidden")
        all_dishes = Dish.query.all()
        rows = []
        for dish in all_dishes:
            invitation = Invitation.query.filter_by(id=dish.invitation_id).first();
            if invitation is None:
                continue
            rows.append({
                'id': dish.id,
                'dish_type': dish.dish_type,
                'name': dish.name,
                'desc': dish.desc,
                'invitation_id': dish.invitation_id,
                'invitation_name': invitation.name,
                'allergens': ", ".join([x.name for x in dish.allergens]),
                'special_preparation': ", ".join([x.name for x in dish.special_preparations]),
            })
        si = io.StringIO()
        keys = rows[0].keys() if len(rows) > 0 else []
        cw = csv.DictWriter(si, fieldnames=keys)
        cw.writeheader()
        cw.writerows(rows)
        output = make_response(si.getvalue())
        output.headers["Content-Disposition"] = "attachment; filename=food.csv"
        output.headers["Content-type"] = "text/csv"
        return output


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
