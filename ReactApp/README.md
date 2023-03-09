# MAML_Editor
The code above is for the maml editor. For more details about the editor read about it in the research paper.
This readme describes the functionalities of the code. It also presents some limitations and some issues that
need to be considered.

## BACKEND
Backend is written in python-flask with sqlalchemy as the database. The main files to look at is the routes.py
and the models.py. The routes shows all the endpoints used to make requests between backend and frontend.
The models file shows all the database models used and their usual functionalities.

### ROUTES
The following are the main endpoints being used in the project:
1. UploadPage endpoint (CREATE): This is the main endpoint that is used to create a new page. It takes all the files in the
request and creates a path on the disk to store them. Also it takes the maml doc as well as other contents and
store them in the database.

2. AdddCurrentPost (CREATE): This end point is used to save a page. THe saved page can be recreated on the front end.
Just like the uploadPage, it also stores images on disk. Also, it creates a new Post object and save it in 
the database.

3. UpdateCUrrentPost (UPDATE): This endpoint is used to update an already saved post object.
4. GetCurrentPOst (READ): This returns a specific post of a particular id and a particular post id.
5. GetAllPosts (READ): This endpoint returns all the posts of a particular user.

### MODELS
The main models for our database are the 
1. User model
2. Page model : Represents an individual page of a user.
3. Post model : Represents a saved post. This model is just for the regeneration of the already saved/incompleted work.
### MAIN ISSUE TO LOOK AT IN THE BACKEND
When retrieveing saved images on the disk, we currently retrieve only their paths on the apache server and 
display them on the frontend. Based on the nature of the frontend, we need to rather send all the files to
the frontend instead of just their paths. So we need to find ways to either send all the files to the frontend
or convert the paths to actual files on the frontend.
