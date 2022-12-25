from flask import Flask, request, render_template, send_from_directory, make_response, redirect, jsonify
from pymongo import MongoClient
from bson import ObjectId
import time
import os

app = Flask(__name__)
cluster = MongoClient("<dburl>")
database = cluster.get_database("codeshare")
credentials = database.get_collection("credentials")
posts = database.get_collection("posts")
allowedTypeIndex = [".jpg", ".jpeg", ".png"]

def getTime(element):
    return element["time"]

@app.route("/home")
def home():
    if credentials.count_documents({"username": request.cookies.get("un"), "password": request.cookies.get("pw")}) != 0:
        conditions = [os.path.exists("static/user-icon/@"+request.cookies.get("un")+".jpg"), os.path.exists("static/user-icon/@"+request.cookies.get("un")+".jpeg"), os.path.exists("static/user-icon/@"+request.cookies.get("un")+".png")]
        if any(conditions):
            return render_template("home.html", data={"usericon": "user-icon/@"+request.cookies.get("un")+allowedTypeIndex[conditions.index(True)]})
        else:
            return render_template("home.html", data={"usericon": "user-icon/default.jpeg"})
    else:
        resp = make_response(redirect("login"))
        resp.delete_cookie('un')
        resp.delete_cookie("pw")
        return resp 

@app.route("/profile")
def getProfile():
    if credentials.count_documents({"username": request.cookies.get("un"), "password": request.cookies.get("pw")}) != 0:
        conditions = [os.path.exists("static/user-icon/@"+request.cookies.get("un")+".jpg"), os.path.exists("static/user-icon/@"+request.cookies.get("un")+".jpeg"), os.path.exists("static/user-icon/@"+request.cookies.get("un")+".png")]
        if any(conditions):
            return render_template("page.html", data={"usericon": "user-icon/@"+request.cookies.get("un")+allowedTypeIndex[conditions.index(True)]})
        else:
            return render_template("page.html", data={"usericon": "user-icon/default.jpeg"})
    else:
        resp = make_response(redirect("login"))
        resp.delete_cookie('un')
        resp.delete_cookie("pw")
        return resp 

@app.route("/getPosts", methods=["POST"])
def getPosts():
    if credentials.count_documents({"username": request.cookies.get("un"), "password": request.cookies.get("pw")}) != 0:
        postss = []
        filter = {}
        if credentials.count_documents({"username": request.args.get("author")}) != 0:
            filter = {"author": request.args.get("author")}
        for post in posts.find(filter):
            postss.append({
                "author": post["author"],
                "title": post["title"],
                "caption": post["caption"],
                "code": post["code"],
                "time": post["time"],
                "_id": str(post["_id"])
            })
            postss.sort(reverse=True, key=getTime)
        return jsonify({
            "posts": postss
        })
    else:
        return "invalid"

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if request.cookies.get("un") is None or request.cookies.get("pw") is None:
            return render_template("login.html")
        else:
            if credentials.count_documents({"username": request.cookies.get("un"), "password": request.cookies.get("pw")}) != 0:
                return redirect("home")
    if request.method == "POST":
        username = request.args.get("un")
        password = request.args.get("pw")
        if credentials.count_documents({"username": username, "password": password}) == 0:
            return "no"
        else:
            return "<redirect>"

@app.route("/raw", methods=['GET', 'POST'])
def getRaw():
    if request.args.get("id") is not None:
        if posts.count_documents({"_id": ObjectId(request.args.get("id"))}) != 0:
            code = posts.find_one({
                "_id": ObjectId(request.args.get("id"))
            })
            codeRaw = code["code"]
            codeRaw = codeRaw.replace("<0x0A>", "\n")
            response = make_response(codeRaw, 200)
            response.mimetype = "text/plain"
            return response
        else:
            response = make_response("Invalid code ID supplied", 404)
            return response
    else:
        response = make_response("No code ID supplied", 404)
        return response

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        if request.cookies.get("un") is None or request.cookies.get("pw") is None:
            return render_template("signup.html")
        else:
            if credentials.count_documents({"username": request.cookies.get("un"), "password": request.cookies.get("pw")}) != 0:
                return redirect("home")
    if request.method == "POST":
        username = request.args.get("un")
        password = request.args.get("pw")
        if credentials.count_documents({"username": username}) == 0:
            credentials.insert_one({
                "username": username,
                "password": password,
                "time": int(time.time() * 1000)
            })
            return "<redirect>"
        else:
            return "no"

@app.route("/logout")
def logout():
    resp = make_response(redirect("login"))
    resp.delete_cookie('un')
    resp.delete_cookie("pw")
    return resp 

@app.route("/newPost", methods=["POST"])
def createNewPost():
    if credentials.count_documents({"username": request.cookies.get("un"), "password": request.cookies.get("pw")}) != 0:
        title = request.args.get("t")
        caption = request.args.get("c")
        code = request.args.get("co")
        posts.insert_one({
            "author": request.cookies.get("un"),
            "title": title,
            "caption": caption,
            "code": code,
            "time": int(time.time() * 1000)
        })
        return "success"
    else:
        return "fail"
    

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

@app.route('/user-icon/<path:path>')
def send_user_icon(path):
    return send_from_directory('static/user-icon', path)

app.run(host="0.0.0.0", port=8080)