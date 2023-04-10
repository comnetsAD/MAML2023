

from datetime import datetime

import json
import pymysql

from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
   # _tablename_ = u'user'
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    password = db.Column(db.Text())
    jwt_auth_active = db.Column(db.Boolean())
    date_joined = db.Column(db.DateTime(), default=datetime.utcnow)
    #pages = db.relationship('Pages', backref="user", lazy = True)
    #pages= db.relationship("u'Pages'", backref="u'user'")

    def __repr__(self):
        return f"User {self.username}"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def update_email(self, new_email):
        self.email = new_email

    def update_username(self, new_username):
        self.username = new_username

    def check_jwt_auth_active(self):
        return self.jwt_auth_active

    def set_jwt_auth_active(self, set_status):
        self.jwt_auth_active = set_status

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def toDICT(self):

        cls_dict = {}
        cls_dict['_id'] = self.id
        cls_dict['username'] = self.username
        cls_dict['email'] = self.email

        return cls_dict

    def toJSON(self):

        return self.toDICT()

class Pages(db.Model):
    #_tablename_ = u'Pages'
    id = db.Column(db.Integer(), primary_key=True)
    created_At = db.Column(db.DateTime(), default=datetime.utcnow)
    pageId= db.Column(db.String(32), nullable=False)
    userId = db.Column(db.Integer(),  nullable=False)
    stateJSON = db.Column(db.Text(), default="{yes}")
    textMap = db.Column(db.Text(), default="{yes}")
    #userId = db.relationship(u'user', primaryjoin='u\'Pages\'.userId == u\'user\'.id')

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update_userId(self, new_userId):
        self.userId = new_userId

    def update_pageId(self, new_pageId):
        self.pageId= new_pageId

    @classmethod
    def get_all_pages(cls, uid):
        return cls.query.filter_by(userId=uid).all()

    @classmethod
    def get_specific_page(cls, uid, pageId):
        return cls.query.filter_by(userId=uid, pageId=pageId).first()

class Posts(db.Model):
	id = db.Column(db.Integer(), primary_key=True)
	userId = db.Column(db.Integer(),  nullable=False)
	postId = db.Column(db.Integer(), nullable=False)
	created_At = db.Column(db.DateTime(), default=datetime.utcnow)
	content = db.Column(db.Text(), default="{yes}")
	textMap = db.Column(db.Text(), nullable=True)
	

	def save(self):
		db.session.add(self)
		db.session.commit()

	def update_content(self, new_content):
		self.content = new_content

	def update_textMap(self, new_textMap):
		self.textMap = new_textMap

	@classmethod
	def get_specific_post(cls, uid, postId):
		return cls.query.filter_by(userId=uid, postId=postId).first()

	@classmethod
	def get_all_unique_posts(cls, uid):
		return cls.query.filter_by(userId=uid).all()

	@classmethod
	def delete_post(cls, uid, postId):
		post = cls.query.filter_by(userId=uid, postId=postId).first()
		db.session.delete(post)
		db.session.commit()


class JWTTokenBlocklist(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    jwt_token = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)

    def __repr__(self):
        return f"Expired Token: {self.jwt_token}"

    def save(self):
        db.session.add(self)
        db.session.commit()
