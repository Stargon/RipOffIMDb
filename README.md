# RipOffIMDb

RipOffIMDB is a search engine that will take keyword queries from the webpage
and display the results to the user. The backend is constructed using Whoosh,
and will communcate to a web browser constructed using React.

# Current Status: Implementing the Web App 

# Running the Web App

To deploy the webapp (as a developer build), run both the frontend and backend
codebase in two separate processes at the same time. Instructions below assumes
two separate terminal windows are used.
### Frontend

[<img src="https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white"/>](https://www.python.org/) [<img src="https://img.shields.io/badge/flask%20-%23000.svg?&style=for-the-badge&logo=flask&logoColor=white"/>](https://flask.palletsprojects.com/en/1.1.x/) [<img src="https://img.shields.io/badge/pandas%20-%23150458.svg?&style=for-the-badge&logo=pandas&logoColor=white"/>](https://pandas.pydata.org/)

#### Dependencies

Pip is needed to get the dependencies of the backend. The following below are the 
dependencies of the project. 

```bash
pip3 install Flask
pip3 install flask-cors
pip3 install Whoosh
pip3 install pandas
```

#### Running the Server

Assuming that the current working directory is the home directory of the project:

```bash
# Enter the server/backend directory
cd index
# Execute the backend
python3 movie_database_whoosh.py
# If you are in a bash shell
./movie_database_whoosh.py
```

### Backend

[<img src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>](https://www.javascript.com/) [<img src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>](https://reactjs.org/) [<img src="https://img.shields.io/badge/material%20ui%20-%230081CB.svg?&style=for-the-badge&logo=material-ui&logoColor=white"/>](https://material-ui.com/)

#### Dependencies

NPM is needed to get the dependencies of the frontend. Please follow [the
link](https://www.npmjs.com/get-npm) for instructions on getting npm. 

To get the dependencies after installing npm:
```bash
# Enter into the client/frontend directory
cd frontend
# Download dependencies if they are not in the directory
npm install
```

#### Running the Client

Assuming that the current working directory is the home directory of the project:

```bash
# Enter into the client/frontend directory
cd frontend
# Execute the frontend
npm start
```

The frontend can also be accessed through [http://localhost:3000](http://localhost:3000) 
once it has been started through npm.
