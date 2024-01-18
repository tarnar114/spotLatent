from flask import Flask,request
from hashlib import sha256
from base64 import urlsafe_b64encode
from urllib.parse import urlencode
import requests
import os
import re
from flask_cors import CORS
app=Flask(__name__)
CORS(app)
@app.route('/verifier',methods=['POST'])
def verify_gen()->bytes:
    code_verifier = urlsafe_b64encode(os.urandom(60)).decode("utf-8")
    code_verifier = re.sub("[^a-zA-Z0-9]+", "", code_verifier)
    return code_verifier 
@app.route('/auth')
def authorize()->str:
    verify_str=request.args.get('auth')

    code_challenge = sha256(verify_str.encode("utf-8")).digest()
    code_challenge = urlsafe_b64encode(code_challenge).decode("utf-8")
    code_challenge = code_challenge.replace("=", "")

    url="https://accounts.spotify.com/authorize?"
    CLIENT_ID="e6f607ae527a4181a4bfdfcc7adec314"
    redirect_uri='http://localhost:3000'
    scope='playlist-read-private user-library-read'
    x =  {
        "response_type": 'code',
        "client_id": CLIENT_ID,
        "scope": scope,
        "code_challenge_method": 'S256',
        "code_challenge": code_challenge,
        "redirect_uri": redirect_uri
    }
    query=urlencode(x)
    auth=url+query
    return auth
@app.route('/token')#make sure to set httponly cookie for refresh cookie
def request_token():
    code=request.args.get('code')
    verify=request.args.get('verify').encode().rstrip(b"=")
    print("token verifier: "+verify.decode())
    headers = {'Content-type': 'application/x-www-form-urlencoded'}
    data={'client_id':"e6f607ae527a4181a4bfdfcc7adec314",
          'grant_type':'authorization_code',
          'code':code,
          'redirect_uri':'http://localhost:3000',
          'code_verifier':verify}
    res=requests.post("https://accounts.spotify.com/api/token",data=data,headers=headers)
    resData=res.json()
    headers={'Authorization':f'Bearer {resData.get('access_token')}'}
    profile=requests.get("https://api.spotify.com/v1/me",headers=headers)
    profileJson=profile.json()
    resData={**resData,**profileJson}
    return resData

@app.route('/get_user_playlists')
def get_playlists():
    token=request.args.get('token')
    user_id=request.args.get('user_id')

    headers={'Authorization':f'Bearer {token}'}
    user_playlists=requests.get(f'https://api.spotify.com/v1/users/{user_id}/playlists',headers=headers)
    user_playlists_json=user_playlists.json()
    user_playlists_items=user_playlists_json["items"]
    return user_playlists_items


    




