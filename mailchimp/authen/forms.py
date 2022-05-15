from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired

class AuthenForm(FlaskForm):
  url = StringField('URL', validators=[DataRequired()])
  api_key = PasswordField('API Key', validators=[DataRequired()])
  submit = SubmitField('Auth')