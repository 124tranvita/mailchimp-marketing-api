from flask import Flask

app = Flask(__name__)

app.config['SECRET_KEY'] = 'my_key'

from mailchimp.core.views import core_blueprint
from mailchimp.authen.views import authen_blueprint

app.register_blueprint(core_blueprint)
app.register_blueprint(authen_blueprint)