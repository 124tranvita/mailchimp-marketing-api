from flask import Blueprint, render_template, session, redirect, url_for
from mailchimp.authen.forms import AuthenForm

authen_blueprint = Blueprint('authen', __name__)

@authen_blueprint.route('/', methods=['POST', 'GET'])
@authen_blueprint.route('/index', methods=['POST', 'GET'])
def authen():
  form = AuthenForm()

  if form.validate_on_submit():
    session['url'] = form.url.data
    session['api_key'] = form.api_key.data

    return redirect(url_for('core.lists'))
  
  return render_template('authen.html', form=form)