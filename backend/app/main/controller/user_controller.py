from flask_restplus import Resource, Namespace

from app.main.model.user import User

user_ns = Namespace('User', description='User operations')


@user_ns.route('/')
class UserResource(Resource):
    def get(self):
        """
        List users
        """
        return User.query.all()
