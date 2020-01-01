from flask_restplus import Resource, Namespace

special_preparation_ns = Namespace('Special preparation', description='Special preparation operations')


@special_preparation_ns.route('/')
class SpecialPreparationResource(Resource):
    def get(self):
        """
        List special preparations
        """
        return []
