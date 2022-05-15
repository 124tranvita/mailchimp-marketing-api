import json
from urllib import response
import requests

def add_list_member(url: str, list_id: str, email_address: str, status: str, username: str, api_key: str) -> response:
  endpoint = url + f'lists/{list_id}/members' 
  print(f"API Endpoint: {endpoint}")

  data = {
    "email_address": email_address,
    "status": status
  }
  print("Data:\n \tEmail Address: {}\n \tStatus: {}".format(data["email_address"], data["status"]))

  dataJSON = json.dumps(data)

  try:
    # request to mailchimp API to add new member to list (use POST method)
    response = requests.post(endpoint, auth=(username, api_key), data=dataJSON)

    print(f"Respone Status: {response.status_code}")
    print(response.json())
    return response

  except requests.ConnectionError as e:
    print("Error: {}".format(e))

def update_list_member(url: str, list_id: str, subscriber_hash: str, member_info: dict,  username: str, api_key: str) -> response:
  endpoint = url + f'lists/{list_id}/members/{subscriber_hash}' 
  print(f"API Endpoint: {endpoint}")

  dataJSON = json.dumps(member_info)

  try:
    # request to mailchimp API to update list member info (use POST method)
    response = requests.patch(endpoint, auth=(username, api_key), data=dataJSON)

    print(f"Respone Status: {response.status_code}")
    #print(response.json())
    return response

  except requests.ConnectionError as e:
    print("Error: {}".format(e))

def delete_list_member(url: str, list_id: str, subscriber_hash: str, username: str, api_key: str) -> response:
  endpoint = url + f'lists/{list_id}/members/{subscriber_hash}' 
  print(f"API Endpoint: {endpoint}")

  params = subscriber_hash

  try:
    response = requests.delete(endpoint, auth=(username, api_key), params=params)

    print(f"Respone Status: {response.status_code}")
    print(response.json())
    return response

  except requests.ConnectionError as e:
    print("Error: {}".format(e))