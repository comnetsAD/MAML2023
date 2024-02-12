    

from datetime import datetime, timezone, timedelta

from functools import wraps
import os

from flask import request, json, render_template
from flask_cors import cross_origin
import json
from flask_restx import Api, Resource, fields

import jwt
import pymysql
from .models import db, Users, JWTTokenBlocklist, Pages, Posts
from .config import BaseConfig
from subprocess import Popen, PIPE

rest_api = Api(version="1.0", title="Users API")



"""
    Flask-Restx models for api request and response data
"""

signup_model = rest_api.model('SignUpModel', {"username": fields.String(required=True, min_length=2, max_length=32),
                                              "email": fields.String(required=True, min_length=4, max_length=64),
                                              "password": fields.String(required=True, min_length=4, max_length=16)
                                              })

login_model = rest_api.model('LoginModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                            "password": fields.String(required=True, min_length=4, max_length=16)
                                            })

user_edit_model = rest_api.model('UserEditModel', {"userID": fields.String(required=True, min_length=1, max_length=32),
                                                   "username": fields.String(required=True, min_length=2, max_length=32),
                                                   "email": fields.String(required=True, min_length=4, max_length=64)
                                                   })

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'maml', 'txt'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def transfer_folder():
    sudo_password = ''
    command = 'cp -R /home/yasir/Desktop/app3 /var/www'.split()

    p = Popen(['sudo', '-S'] + command, stdin=PIPE, stderr=PIPE,
          universal_newlines=True)
    sudo_prompt = p.communicate(sudo_password + '\n')[1]


"""
   Helper function for JWT token required
"""

def maml_to_html(username, pageName, data):
    filepath = 'data/pages/'+username+'/'+pageName
    maml= data

    # with open(filepath, 'r') as f:
    #     maml+=f.read()
    #     print("Maml", maml)


    html = ""
    html += "<html>\n<head>\n" + '''<style>
            /* Dropdown Button */
    .dropbtn {
      background-color: rgba(239,239,239);
      color: black;
      font-size: 16px;
      border: none;
      width: 100%;
      height: 100%
    }

    /* The container <div> - needed to position the dropdown content */
    .dropdown {
      position: relative;
      display: inline-block;
    }

    /* Dropdown Content (Hidden by Default) */
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f1f1f1;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }

    /* Links inside the dropdown */
    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }

    /* Change color of dropdown links on hover */
    .dropdown-content a:hover {background-color: #ddd;}

    /* Show the dropdown menu on hover */
    .dropdown:hover .dropdown-content {display: block;}

    /* Change the background color of the dropdown button when the dropdown content is shown */
    .dropdown:hover .dropbtn {background-color: rgba(200,200,200);}

    .carousel-inner {
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    .carousel-open:checked + .carousel-item {
        position: static;
        opacity: 100;
    }

    .carousel-item {
        position: absolute;
        opacity: 0;
        -webkit-transition: opacity 0.6s ease-out;
        transition: opacity 0.6s ease-out;
    }

    .carousel-item img {
        display: block;
        height: auto;
        max-width: 100%;
    }

    .carousel-control {
        background: rgba(0, 0, 0, 0.28);
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        display: none;
        font-size: 40px;
        height: 40px;
        line-height: 35px;
        position: absolute;
        top: 50%;
        -webkit-transform: translate(0, -50%);
        cursor: pointer;
        -ms-transform: translate(0, -50%);
        transform: translate(0, -50%);
        text-align: center;
        width: 40px;
        z-index: 10;
    }

    .carousel-control.prev {
        left: 2%;
    }

    .carousel-control.next {
        right: 2%;
    }

    .carousel-control:hover {
        background: rgba(0, 0, 0, 0.8);
        color: #aaaaaa;
    }

    #carousel-1:checked ~ .control-1,
    #carousel-2:checked ~ .control-2,
    #carousel-3:checked ~ .control-3 {
        display: block;
    }

    .carousel-indicators {
        list-style: none;
        margin: 0;
        padding: 0;
        position: absolute;
        bottom: 2%;
        left: 0;
        right: 0;
        text-align: center;
        z-index: 10;
    }

    .carousel-indicators li {
        display: inline-block;
        margin: 0 5px;
    }

    .carousel-bullet {
        color: #fff;
        cursor: pointer;
        display: block;
        font-size: 35px;
    }

    .carousel-bullet:hover {
        color: #aaaaaa;
    }

    #carousel-1:checked ~ .control-1 ~ .carousel-indicators li:nth-child(1) .carousel-bullet,
    #carousel-2:checked ~ .control-2 ~ .carousel-indicators li:nth-child(2) .carousel-bullet,
    #carousel-3:checked ~ .control-3 ~ .carousel-indicators li:nth-child(3) .carousel-bullet {
        color: #428bca;
    }

        </style>\n''' + "</head>\n<body>" + "\n"
    # html += "<head></head>" + "\n"
    # maml = '{"type":"rect","x":70,"y":0,"w":1200,"h":50,"color":"#808080"}\n{"type":"button","template":"POST","txt":"phillip","txtFields":"0","x":80,"y":10,"w":109,"h":30,"target":"sample.com"}\n{"type":"dropdown","template":"POST","items":["phillip I","phillip II"],"txtFields":2,"x":199,"y":10,"w":109,"h":30,"target":"sample.com"}\n{"type":"txt","txt":"Add Text","txtFields":"0","x":71,"y":51,"w":412,"h":201,"textX":86,"textY":63,"textW":382,"textH":18.453125,"font":"13px","font-family":"Helvetica, Arial, sans-serif","color":"rgb(51, 51, 51)"}\n{"type":"img","uid":"0","format":"JPG","x":484,"y":51,"w":412,"h":272.8828125}\n'
    # maml += '{"type":"carousel","uid":"0","imageCnt":3,"formats":["JPG","JPG","JPG"],"x":897,"y":51,"w":412,"h":201}\n'
    # maml = '''{"type":"rect","x":70,"y":0,"w":2480,"h":50,"color":"#808080"}\n{"type":"button","template":"POST","txt":"phillip","txtFields":"0","x":80,"y":10,"w":196,"h":30,"target":"sample.com"}\n{"type":"dropdown","template":"POST","items":["phillip1","phillip 2"],"txtFields":2,"x":286,"y":10,"w":196,"h":30,"target":"sample.com"}\n{"type":"carousel","uid":"0","imageCnt":3,"formats":["JPG","JPG","JPG"],"x":897,"y":51,"w":412,"h":201}\n{"type":"img","uid":"1","format":"jpg","x":71,"y":51,"w":412,"h":257.5}\n{"type":"txt","txt":"Add Text","txtFields":"0","x":484,"y":51,"w":412,"h":201,"textX":499,"textY":63,"textW":382,"textH":18.453125,"font":"13px","font-family":"Helvetica, Arial, sans-serif","color":"rgb(51, 51, 51)"}\n'''
    #maml = '''{"type":"rect","x":70,"y":0,"w":2480,"h":50,"color":"#808080"}\n{"type":"button","template":"POST","txt":"phillip","txtFields":"0","x":80,"y":10,"w":196,"h":30,"target":"sample.com"}\n{"type":"dropdown","template":"POST","items":["phillip1","phillip 2"],"txtFields":2,"x":286,"y":10,"w":196,"h":30,"target":"sample.com"}\n{"type":"carousel","uid":"0","imageCnt":3,"formats":["JPG","JPG","JPG"],"x":897,"y":51,"w":412,"h":201}\n{"type":"img","uid":"1","format":"jpg","x":71,"y":51,"w":412,"h":257.5}\n{"type":"txt","txt":"Add Text","txtFields":"0","x":484,"y":51,"w":412,"h":201,"textX":499,"textY":63,"textW":382,"textH":36.9140625,"font":"26px","font-family":"Helvetica, Arial, sans-serif","color":"rgb(51, 51, 51)"}\n'''
    jsonArray = maml.split('\n')
    jsonArray.remove('')
    print("Arrray is", jsonArray)
    for jsonString in jsonArray:
        print(jsonString)
        print(type(jsonString))
        jsonObject = json.loads(jsonString)
        if (jsonObject["type"] == "rect"): 
            html += "<div style='position:absolute; width:%dpx; height:%dpx; left: %dpx; top: %dpx; background-color:%s'>\n</div>\n" % (jsonObject["w"], jsonObject["h"], jsonObject["x"], jsonObject["y"], jsonObject["color"])
        elif (jsonObject["type"] == "button"):
            html += "<button class=\"dropbtn\" style='position:absolute; width:%dpx; height:%dpx; left: %dpx; top: %dpx'>\n%s</button>\n" % (jsonObject["w"], jsonObject["h"], jsonObject["x"], jsonObject["y"], jsonObject["txt"])
        elif (jsonObject["type"] == "dropdown"):
            dropdownItems = jsonObject["items"]
            html += '<div class="dropdown" style=\'position:absolute; width:%dpx; height:%dpx; left: %dpx; top: %dpx\'>\n<button class="dropbtn" >' % (jsonObject["w"], jsonObject["h"], jsonObject["x"], jsonObject["y"]) + dropdownItems[0] + '</button>\n<div class="dropdown-content">\n' 
            for item in dropdownItems[1:]:
                html += '<a href="#">' + item + '</a>'
            html += "</div>\n</div>\n"
        elif (jsonObject["type"] == "txt"):
            # html += "<div style='position:absolute; width:%dpx; height:%dpx; left: %dpx; top: %dpx; background-color:white'>\n</div>\n" % (jsonObject["w"], jsonObject["h"], jsonObject["x"], jsonObject["y"])
            html += "<p style='margin:0px; position:absolute; width:%dpx; height:%dpx; left: %dpx; top: %dpx; color:%s; font-family:\"%s\"; font-size:%s'>\n%s</p>\n" % (jsonObject["textW"], jsonObject["textH"], jsonObject["textX"], jsonObject["textY"], jsonObject["color"], jsonObject["font-family"], jsonObject["font"], jsonObject["txt"])
        elif (jsonObject["type"] == "img"):
            html += "<img style='position:absolute; width:%dpx; height:%dpx; left: %dpx; top: %dpx' src=\"%s.%s\" alt=\"\">\n" % (jsonObject["w"], jsonObject["h"], jsonObject["x"], jsonObject["y"],  jsonObject["uid"], jsonObject["format"])
        elif (jsonObject["type"] == "carousel"):
            imageCnt = jsonObject["imageCnt"]
            html += '<div class="carousel" style=\'position:absolute; width:%dpx; height:%dpx; left: %dpx; top: %dpx\'>\n<div class="carousel-inner">\n' % (jsonObject["w"], jsonObject["h"], jsonObject["x"], jsonObject["y"])
            for index in range(imageCnt):
                html += '<input class="carousel-open" type="radio" id="carousel-%d" name="carousel" aria-hidden="true" hidden="" checked="checked">\n<div class="carousel-item">\n<img src="%s">\n</div>\n' % (index + 1, 'c' + jsonObject["uid"] + '-' + str(index) + "." + jsonObject["formats"][index])
                # html += '<input class="carousel-open" type="radio" id="carousel-%d" name="carousel" aria-hidden="true" hidden="" checked="checked">\n<div class="carousel-item">\n<img src="./data/pages/%s/%s/%s">\n</div>\n' % (index + 1, username, pageName, 'c' + jsonObject["uid"] + '-' + str(index) + "." + jsonObject["formats"][index])
            html += '<label for="carousel-%d" class="carousel-control prev control-1">‹</label>\n' % (imageCnt)
            html += '<label for="carousel-2" class="carousel-control next control-1">›</label>\n'
            for index in range(1, imageCnt - 1):
                html += '<label for="carousel-%d" class="carousel-control prev control-%d">‹</label>\n' % (index, index + 1)
                html += '<label for="carousel-%d" class="carousel-control next control-%d">‹</label>\n' % (index + 2, index + 1)
            html += '<label for="carousel-%d" class="carousel-control prev control-%d">‹</label>\n' % (imageCnt - 1, imageCnt)
            html += '<label for="carousel-1" class="carousel-control next control-%d">›</label>\n' % (imageCnt)
            html += '<ol class="carousel-indicators">'
            for index in range(imageCnt):
                html += '<li>\n<label for="carousel-%d" class="carousel-bullet">•</label>\n</li>\n' % (index + 1)
            html += '</ol>\n</div>\n</div>\n'


            print("6")

    html += "</body>\n</html>"
    file_name = pageName+".html"

    completeName=os.path.join(filepath, file_name)
    # print(jsonArray)
    f = open(completeName,"w")
    f.write(html)
    f.close()

def token_required(f):

    @wraps(f)
    def decorator(*args, **kwargs):

        token = None

        if "authorization" in request.headers:
            token = request.headers["authorization"].replace("Bearer ", "")
            print(token)

        if not token:
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            data = jwt.decode(token, BaseConfig.SECRET_KEY, algorithms=["HS256"])
            current_user = Users.get_by_email(data["email"])

            if not current_user:
                return {"success": False,
                        "msg": "Sorry. Wrong auth token. This user does not exist."}, 400

            token_expired = db.session.query(JWTTokenBlocklist.id).filter_by(jwt_token=token).scalar()

            if token_expired is not None:
                return {"success": False, "msg": "Token revoked."}, 400

            if not current_user.check_jwt_auth_active():
                return {"success": False, "msg": "Token expired."}, 400

        except:
            return {"success": False, "msg": "Token is invalid"}, 400

        return f(current_user, *args, **kwargs)

    return decorator


"""
    Flask-Restx routes
"""


@rest_api.route('/api/users/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @rest_api.expect(signup_model, validate=True)
    def post(self):
        print(request.get_json())
        req_data = request.get_json()


        _username = req_data.get("username")
        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)
        if user_exists:
            return {"success": False,
                    "msg": "Email already taken"}, 400

        new_user = Users(username=_username, email=_email)

        new_user.set_password(_password)
        new_user.save()

        return {"success": True,
                "userID": new_user.id,
                "msg": "The user was successfully registered"}, 200


@rest_api.route('/api/users/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)

        if not user_exists:
            return {"success": False,
                    "msg": "This email does not exist."}, 400

        if not user_exists.check_password(_password):
            return {"success": False,
                    "msg": "Wrong credentials."}, 400

        # create access token uwing JWT
        token = jwt.encode({'email': _email, 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)

        user_exists.set_jwt_auth_active(True)
        user_exists.save()

        return {"success": True,
                "token": token,
                "user": user_exists.toJSON()}, 200


@rest_api.route('/api/users/edit')
class EditUser(Resource):
    """
       Edits User's username or password or both using 'user_edit_model' input
    """

    @rest_api.expect(user_edit_model)
    @token_required
    def post(self, current_user):

        req_data = request.get_json()

        _new_username = req_data.get("username")
        _new_email = req_data.get("email")

        if _new_username:
            self.update_username(_new_username)

        if _new_email:
            self.update_email(_new_email)

        self.save()

        return {"success": True}, 200


@rest_api.route('/api/users/logout')
class LogoutUser(Resource):
    """
       Logs out User using 'logout_model' input
    """

    @token_required
    def post(self, current_user):

        _jwt_token = request.headers["authorization"].replace("Bearer ", "")

        jwt_block = JWTTokenBlocklist(jwt_token=_jwt_token, created_at=datetime.now(timezone.utc))
        jwt_block.save()

        self.set_jwt_auth_active(False)
        self.save()

        return {"success": True}, 200


@rest_api.route('/api/pages/upload')
class UploadPage(Resource):

    # @token_required
    def post(self):
        username = "gideon"
        pageName = request.form.get('pageName')
        UPLOAD_FOLDER='data/pages/'+username+"/"+pageName
        print(request.json)
        print(request.form.to_dict())
        data = request.form.get('maml')
        jsonState =json.dumps(request.form.get('stateJSON'))
        textMap = json.dumps(request.form.get('textMap'))
        print(type(jsonState))
        print(type(textMap))


        print("Data is ", data)
        mamlFileName = pageName+".maml"
        
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        completePath = os.path.join(UPLOAD_FOLDER, mamlFileName)
        f = open(completePath,"w")
        f.write(data)
        f.close()
        
        try:
            if 'files[]' in request.files:
                files = request.files.getlist("files[]")
                files2 = request.files.getlist("carousels[]")
                for file in files:
                    print(file.filename)
                    if file.filename =='':
                        return {"error": "File name empty"}, 404
                #     if file and allowed_file(file.filename):
                #         filename = file.filename
                    filename = file.filename
                    print("filename is", filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))

                for file in files2:
                    print(file.filename)
                    if file.filename =='':
                        return {"error": "File name empty"}, 404
                #     if file and allowed_file(file.filename):
                #         filename = file.filename
                    filename = file.filename
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    
            #     else:
                    
            #         return {"error": "File format not supported"}, 404
        except Exception as e:
            print(e)
            return {"error": "Exception raised"}, 404


        page_Info = Pages(pageId=pageName, userId= 1, created_At= datetime.now(timezone.utc), stateJSON=jsonState, textMap=textMap)
        page_Info.save()
        maml_to_html(username, pageName, data)
        return {"success": True}, 200



@rest_api.route('/api/pages/maml_to_html')
class Maml_to_Html(Resource):
    @token_required
    def post(self):
        username = "gideon"
        maml_to_html(username)

@rest_api.route('/api/users/getAll')
class getUsers(Resource):
    def get(self):
        users = Users.query.all()
        return render_template("users.html",
                           title="Users",
                           users=users)

@rest_api.route('/api/pages/getAll')
class getCurrentUserPages(Resource):
    @token_required
    def get(self, current_user):
        userId = self.id
        current_pages=Pages.get_all_pages(userId)
        print("Current pages", current_pages)
        pageNames = []
        for page in current_pages:
            pageNames.append(page.pageId)
        print(pageNames)
        return {"pages": pageNames, "success": True}, 200


@rest_api.route('/api/pages/getPage/<pageId>')
class getSpecificPage(Resource):
    @token_required
    def get(self, current_user, pageId):
        user = self.id
        specific_page = Pages.get_specific_page(user, pageId)
        print("specific page is", specific_page)
        jsonData= json.loads(specific_page.stateJSON)
        textMap = json.loads(specific_page.textMap)

        return {"stateJSON": jsonData, "textMap":textMap, "success": True}, 200



@rest_api.route('/api/posts/addPost')
class addCurrentPost(Resource):
    def post(self):
        user = 2
        username="akosah"
        content1 = request.form.get('content')
        textMap2 = json.dumps(request.form.get('textMap'))
        postName = request.form.get('pageName')
        UPLOAD_FOLDER='data/posts/'+username+"/"+postName
        
        postId = request.form.get('postID')


        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        try:                
            if 'files[]' in request.files:
                files = request.files.getlist("files[]")
                files2 = request.files.getlist("carousels[]")
                for file in files:
                    print(file.filename)
                    if file.filename =='':
                        return {"error": "File name empty"}, 404
                #     if file and allowed_file(file.filename):
                #         filename = file.filename
                    filename = file.filename
                    print("filename is", filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))

                for file in files2:
                    print(file.filename)
                    if file.filename =='':
                        return {"error": "File name empty"}, 404
                #     if file and allowed_file(file.filename):
                #         filename = file.filename
                    filename = file.filename
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                        
            #     else:
                    
            #         return {"error": "File format not supported"}, 404
        except Exception as e:
            print(e)
            return {"error": "Exception raised"}, 404

        
        current_post = Posts(userId=user, postId=postId, created_At=datetime.now(timezone.utc), content=content1, textMap=textMap2)

        current_post.save()
        transfer_folder()
        return {"success": True}, 200


@rest_api.route('/api/posts/updatePost', methods=['POST'])
class updateCurrentPost(Resource):
    def post(post):
        user = 2
        username = "akosah"
        content1 = request.form.get('content')
        textMap2 = json.dumps(request.form.get('textMap'))
        postName = request.form.get('pageName')
        UPLOAD_FOLDER = 'data/posts/'+username+"/"+postName
        postId = request.form.get('postID')
        print("Post id is", postId)

        if os.path.exists(UPLOAD_FOLDER):
            for f in os.listdir(UPLOAD_FOLDER):
                os.remove(os.path.join(UPLOAD_FOLDER, f))

        try:
            if 'files[]' in request.files:
                files = request.files.getlist("files[]")
                files2 = request.files.getlist("carousels[]")
                for file in files:
                    print(file.filename)
                    if file.filename =='':
                        return {"error": "File name empty"}, 404
                #     if file and allowed_file(file.filename):
                #         filename = file.filename
                    filename = file.filename
                    print("filename is", filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))

                for file in files2:
                    print(file.filename)
                    if file.filename =='':
                        return {"error": "File name empty"}, 404
                #     if file and allowed_file(file.filename):
                #         filename = file.filename
                    filename = file.filename
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
        except Exception as e:
            print(e)
            return {"error": "Exception raised"}, 404

        current_post = Posts.get_specific_post(user, postId)
        print(current_post)
        current_post.update_content(content1)
        current_post.update_textMap(textMap2)

        current_post.save()
        transfer_folder()

        return {"success": True}, 200



        




@rest_api.route('/api/posts/getPost/<postId>')
class getCurrentPost(Resource):
    def get(self, postId):
        user = 2
        specific_post = Posts.get_specific_post(user, postId)
        path = 'data/posts/akosah/12'
        imagelist = []
        carousellist = []
        for filename in os.listdir(path):
            if not filename[0].isalpha():
                imagelist.append("http://10.224.41.106/"+path+"/"+filename)
            elif filename[0]=="c":
                carousellist.append("http://10.224.41.106/"+path+"/"+filename)

        print(imagelist)

        # content = json.load(specific_post.content)

        print(type(specific_post.content))
        return {"content": specific_post.content,
        "imagelist": imagelist,
        "carousellist": carousellist,
        "textMap": specific_post.textMap,
         "success": True}, 200


@rest_api.route('/api/posts/getPosts')
class getAllPosts(Resource):
    def get(self):
        user = 2
        allPosts = Posts.get_all_unique_posts(user)

        print(allPosts[0].postId)

        size = len(allPosts)
        uniquePosts = []

        for item in allPosts:
            uniquePosts.append(item.postId)

        return {"size": size,
        "uniquePosts":uniquePosts,
        "success": True}, 200


@rest_api.route('/api/posts/deletePost/<id>', methods=['GET'])
class deletePost(Resource):
    def get(self, id):
        user = 2
        print(id)
        Posts.delete_post(user, id)

        return {"success": True}, 200






#Create an endpoint where you can send an array of pages a user has created as well as screenshots of each page to the backend
#WE  can send a json object where the key is the page_name or Id and the value is the screenshot.
#We need to create another endpoint where user can edit a page by receiving all the react states that were sent when the page was last edited.

# One user can create multiple pages. SO we have to store each new page created by any user under a new directory. The name of the directory 
# the unique name chosen by the user for 