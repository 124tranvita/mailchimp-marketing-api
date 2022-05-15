import json
from flask import Blueprint, redirect, render_template, session, jsonify, make_response, request, url_for
from mailchimp.handlers.handle_member import add_list_member, update_list_member, delete_list_member
from mailchimp.handlers.handle_list import get_all_lists, get_list_members_info, member_subscribe, get_list_members_info_countable

core_blueprint = Blueprint('core', __name__)

USERNAME = 'anystring'

# INDEX (list all list belong user)
@core_blueprint.route('/lists')
def lists():
  try:
    username = USERNAME
    url = session['url']
    api_key = session['api_key']

    response = get_all_lists(url, username, api_key)

    status_code = response.status_code

    return render_template('lists.html', response=response.json(), status_code=status_code)
  except:
    return redirect(url_for('authen.authen'))

@core_blueprint.route('/lists/<list_id>')
def members(list_id):
  try:
    url = session['url']
    api_key = session['api_key']
    username = USERNAME
    list_id = list_id

    response = get_list_members_info(url, list_id, username, api_key)

    status_code = response.status_code

    return render_template('members.html', response=response.json(), status_code=status_code, list_id=list_id)
  except:
    return redirect(url_for('authen.authen'))

@core_blueprint.route('/add', methods=['POST'])
def add():
  username = USERNAME
  url = session['url']
  api_key = session['api_key']

  req = request.get_json()
  #print(req)

  list_id = req['list_id']
  email_address = req['email']
  status = req['status']

  respone = add_list_member(url, list_id, email_address, status, username, api_key)

  res = make_response(jsonify(respone.json()))

  return res

@core_blueprint.route('/update', methods=['POST'])
def update():
  username = USERNAME
  url = session['url']
  api_key = session['api_key']

  req = request.get_json()
  #print(req)

  list_id = req['list_id']
  subscriber_hash = req['contactId']

  if req['vip'] == 'true':
    vip = True
  else:
    vip = False
  
  member_info = {
    "email_address": req['email'],
    "status": req['status'],
    "email_type": req['emailType'],
    "language": req['language'],
    "merge_fields": {
                  "FNAME": req['merge_fields']['firstName'],
                  "LNAME": req['merge_fields']['lastName'],
                  "ADDRESS": req['merge_fields']['address'],
                  "PHONE": req['merge_fields']['phone'],
                  "BIRTHDAY": req['merge_fields']['birthday'],
                },
    "vip": vip
  }

  respone = update_list_member(url, list_id, subscriber_hash, member_info, username, api_key)

  res = make_response(jsonify(respone.json()))

  return res

@core_blueprint.route('/subscribe', methods=['POST'])
def subscribe():
  username = USERNAME
  url = session['url']
  api_key = session['api_key']

  req = request.get_json()
  #print(req)

  list_id = req['list_id']

  if req['vip'] == 'true':
    vip = True
  else:
    vip = False

  members = [{
    "email_address": req['email'],
    "status": req['status'],
    "email_type": req['emailType'],
    "language": req['language'],
    "merge_fields": {
                  "FNAME": req['merge_fields']['firstName'],
                  "LNAME": req['merge_fields']['lastName'],
                  "ADDRESS": req['merge_fields']['address'],
                  "PHONE": req['merge_fields']['phone'],
                  "BIRTHDAY": req['merge_fields']['birthday'],
                },
    "vip": vip
  }]

  #print(members)
  respone = member_subscribe(url, list_id, members, username, api_key)

  res = make_response(jsonify(respone.json()))

  return res

@core_blueprint.route('/batch_subscribe', methods=['POST'])
def batch_subscribe():
  username = USERNAME
  url = session['url']
  api_key = session['api_key']

  req = request.get_json()
  #print(req)

  list_id = req['list_id']
  members = req['members']

  respone = member_subscribe(url, list_id, members, username, api_key)

  #print(res)
  res = make_response(jsonify(respone.json()))

  return res

@core_blueprint.route('/archive', methods=['POST'])
def archive():
  username = USERNAME
  url = session['url']
  api_key = session['api_key']

  req = request.get_json()
  print(req)

  list_id = req['list_id']
  subscriber_hash = req['subscriber_hash']

  delete_list_member(url, list_id, subscriber_hash, username, api_key)

  #print(res)
  res = make_response(jsonify({"message": "Archived"}), 204)

  return res

@core_blueprint.route('/lists/<list_id>/view/<int:count>', methods=['POST', 'GET'])
def view(list_id, count):
  try:
    username = USERNAME
    url = session['url']
    api_key = session['api_key']

    print(count)

    response = get_list_members_info_countable(url, list_id, count, username, api_key)

    status_code = response.status_code

    return render_template('members.html', response=response.json(), status_code=status_code, list_id=list_id)
  except:
    return redirect(url_for('authen.authen'))

@core_blueprint.route('/session')
def session_page():
  try:
    username = USERNAME
    url = session['url']
    api_key = session['api_key']

    return render_template('sessionPage.html', username=username, url=url, api_key=api_key)
  except:
    return redirect(url_for('authen.authen'))

@core_blueprint.route('/logout')
def logout():
  session.clear()
  return redirect(url_for('authen.authen'))
