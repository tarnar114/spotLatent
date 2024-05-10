from flask import Flask, request
from hashlib import sha256
from base64 import urlsafe_b64encode
from urllib.parse import urlencode
import requests
import os
import re
from flask_cors import CORS
import json
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)


# gets a verifier code
@app.route("/api/verifier", methods=["POST"])
def verify_gen() -> str:
    code_verifier = urlsafe_b64encode(os.urandom(60)).decode("utf-8")
    code_verifier = re.sub("[^a-zA-Z0-9]+", "", code_verifier)
    return code_verifier


@app.route("/api/auth")
def authorize() -> str:
    verify_str = request.args.get("auth")
    if verify_str is None:
        raise ValueError("verifier is not supplied")
    code_challenge = sha256(verify_str.encode("utf-8")).digest()
    code_challenge = urlsafe_b64encode(code_challenge).decode("utf-8")
    code_challenge = code_challenge.replace("=", "")

    url = "https://accounts.spotify.com/authorize?"
    CLIENT_ID = "e6f607ae527a4181a4bfdfcc7adec314"
    redirect_uri = "http://localhost:5173"
    scope = "playlist-read-private user-library-read"
    x = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "scope": scope,
        "code_challenge_method": "S256",
        "code_challenge": code_challenge,
        "redirect_uri": redirect_uri,
    }
    query = urlencode(x)
    auth = url + query
    return auth


@app.route("/api/token")  # make sure to set httponly cookie for refresh cookie
def request_token() -> dict:
    code = request.args.get("code", type=str)
    if code is None:
        raise ValueError("code is not supplied")
    verify = request.args.get("verify")
    if verify is None:
        return {"error": "verify is not supplied"}
    verify.encode().rstrip(b"=")

    headers = {"Content-type": "application/x-www-form-urlencoded"}
    data = {
        "client_id": "e6f607ae527a4181a4bfdfcc7adec314",
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:5173",
        "code_verifier": verify,
    }
    res = requests.post(
        "https://accounts.spotify.com/api/token", data=data, headers=headers
    )
    resData = res.json()
    headers = {"Authorization": f"Bearer {resData.get('access_token')}"}
    profile = requests.get("https://api.spotify.com/v1/me", headers=headers)
    profileJson = profile.json()
    resData = {**resData, **profileJson}
    return resData


@app.route("/api/get_user_playlists")
def get_playlists():
    token = request.args.get("token")
    user_id = request.args.get("user_id")
    headers = {"Authorization": f"Bearer {token}"}

    user_playlists = requests.get(
        f"https://api.spotify.com/v1/users/{user_id}/playlists", headers=headers
    )
    user_playlists_json = user_playlists.json()
    return user_playlists_json["items"]


@app.route("/api/model")
def get_model() -> dict:
    playId = request.args.get("ID")
    token = request.args.get("token")
    idList = ""
    name_list = []
    headers = {"Authorization": f"Bearer {token}"}
    params = {"fields": "items(track(id,name,url,href))"}
    user_playlist = requests.get(
        f"https://api.spotify.com/v1/playlists/{playId}/tracks",
        headers=headers,
        params=params,
    ).json()
    for val in user_playlist["items"]:
        track = val["track"]
        idList += track["id"]
        idList += ","
        name_list.append(track["name"])
    params = {"ids": idList}
    track_features = requests.get(
        "https://api.spotify.com/v1/audio-features", headers=headers, params=params
    ).json()
    json_str = json.dumps(track_features)
    parsed_json = json.loads(json_str)
    json_arr = parsed_json["audio_features"]
    json_arr_asJson = json.dumps(json_arr)
    df = pd.read_json(json_arr_asJson)
    df["name"] = name_list
    df.drop(
        axis=1,
        labels=["type", "track_href", "duration_ms"],
        inplace=True,
    )
    pca_data = PCA_analysis(df)
    res = pd.concat([df, pca_data], axis=1)
    print(res.head())
    return res.to_dict("records")


def PCA_analysis(df):
    data = df.drop(axis=1, labels=["id", "uri", "analysis_url", "name"])
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)
    cluster_means = KMeans(n_clusters=2)
    data["clusters"] = cluster_means.fit_predict(scaled_data)
    reduced_data = PCA(n_components=2).fit_transform(scaled_data)
    res = pd.DataFrame(reduced_data)
    res.columns = ["PCA1", "PCA2"]
    return res
