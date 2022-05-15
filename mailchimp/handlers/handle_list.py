import json
import requests

def get_all_lists(url: str, username: str, api_key: str) -> dict:
  endpoint = url + 'lists' 
  print(f"API Endpoint: {endpoint}")
  try:
    # request to mailchimp API to get list of member (use GET method)
    response = requests.get(endpoint, auth=(username, api_key))

    print(f"Respone Status: {response.status_code}")
    #print(response.json())
    return response
    
  except requests.ConnectionError as e:
    print("Error: {}".format(e))


def get_list_members_info(url: str, list_id: str, username: str, api_key: str):
  endpoint = url + f'lists/{list_id}/members' 
  print(f"API Endpoint: {endpoint}")
  try:
    # request to mailchimp API to get list of member (use GET method)
    response = requests.get(endpoint, auth=(username, api_key))

    print(f"Respone Status: {response.status_code}")
    #print(response.json())
    return response

  except requests.ConnectionError as e:
    print("Error: {}".format(e))

def get_list_members_info_countable(url: str, list_id: str, count: int, username: str, api_key: str):
  endpoint = url + f'lists/{list_id}/members' 
  print(f"API Endpoint: {endpoint}")

  params = {
    "count": count
  }

  #dataJSON = json.dumps(data)

  try:
    # request to mailchimp API to get list of member (use GET method)
    response = requests.get(endpoint, auth=(username, api_key), params=params)

    print(f"Respone Status: {response.status_code}")
    #print(response.json())
    return response

  except requests.ConnectionError as e:
    print("Error: {}".format(e))

def member_subscribe(url: str, list_id: str, members: dict, username: str, api_key: str):
  endpoint = url + f'lists/{list_id}' 
  print(f"API Endpoint: {endpoint}")

  data = {
    "members": members,
    "sync_tags": True,
    "update_existing": True,
  }

  dataJSON = json.dumps(data)

  print(dataJSON)

  try:
    # request to mailchimp API to update list member info (use POST method)
    response = requests.post(endpoint, auth=(username, api_key), data=dataJSON)

    print(f"Respone Status: {response.status_code}")
    print(response.json())
    return response

  except requests.ConnectionError as e:
    print("Error: {}".format(e))