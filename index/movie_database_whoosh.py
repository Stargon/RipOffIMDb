#!/usr/bin/python

from flask import Flask, request, jsonify
from flask_cors import CORS
import whoosh
import csv
import os.path
from whoosh.index import create_in, open_dir, exists_in, Index
from whoosh.fields import *
from whoosh.qparser import QueryParser, MultifieldParser, GtLtPlugin, query
from whoosh import qparser
import pandas as pd
from fuzzy_search.BKTree import BKTree

app = Flask(__name__,
            template_folder='./frontend/src')
CORS(app)
# this is temporary need to develop a vocab of words found in movie database
imdb_vocab = ['star', 'esta', 'start', 'village', 'mission', 'million']

fuzzy_tree = None

csv_file = 'database/database_master.csv'


# homepage route
@app.route('/', methods=['GET', 'POST'])
def results():
    """ route for fetch request from frontend
    :var searchType: One of two values: basic or advanced to specify the type of search executed - required field
    :var keywordQuery: movie title for advanced search or query for basic search - required field
    :var fuzzySearch: boolean of if fuzzysearch if used within basic search - optional field
    :var actor: advanced search field - optional field
    :var production_company: advanced search field - optional field
    :var genre: advanced search field - optional field
    :var runTime: integer passed as the minimum runtime of the advanced search results - optional field
    """
    theWhooshSearch = WhooshSearch()
    theWhooshSearch.index()
    global fuzzy_tree

    if not fuzzy_tree:
        fuzzy_tree = createBKTree()
    fuzzyTerms = []
    results = []

    if request.method == 'POST':
        data = request.form
    else:
        data = request.args

    searchType = data.get('searchType')
    keywordQuery = data.get('keywordQuery')
    fuzzySearch = data.get('fuzzySearch')

    if searchType == 'advanced':
        actor = data.get('actor')
        production_company = data.get('production')
        director = data.get('director')
        genre = data.get('genre')
        runTime = data.get('runtime')
        results = theWhooshSearch.advancedSearch(keywordQuery, actor, production_company, director, genre, runTime)
    else:
        if fuzzySearch == 'True':
            keywordQuery = keywordQuery.split()
            for word in keywordQuery:
                fuzzyTerms += fuzzy_tree.autocorrect(word, 1)
            for term in fuzzyTerms:
                results += theWhooshSearch.basicSearch(term[0])
        else:
            results = theWhooshSearch.basicSearch(keywordQuery)

    return jsonify(results)


def createBKTree():
    vocab = []
    with open('database/vocabulary.csv', encoding='utf-8', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for line in reader:
            vocab.append(line[0])

    return BKTree(vocab, 0)


class WhooshSearch(object):
    def __init__(self):
        super(WhooshSearch, self).__init__()

    def basicSearch(self, query_entered):
        returnables = []
        with self.indexer.searcher() as search:
            query = MultifieldParser(['Title', 'Actors'], schema=self.indexer.schema)
            query = query.parse(query_entered)
            results = search.search(query, limit=None, terms=True)

            # return the stored attributes
            for result in results:
                returnables.append(
                    {'id': result['id'], 'page_url': result['page_url'], 'image_url': result['image_url'],
                     'title': result['Title'],
                     'actors': result['Actors'], 'production': result['Production'], 'director': result['Director'],
                     'release_date': result['Release_date'],
                     'genre': result['Genre'], 'awards': result['Awards'], 'critics': result['Critic_Score'],
                     'runtime': result['RunTime']})
            return returnables

    def advancedSearch(self, query_entered, Actor, Production, Director, Genre, minRuntime):
        ''' provides filters to search across multiple fields based on user input
        	query_entered/title is a required field, all other fields are optional
        '''
        title = query_entered

        if not minRuntime:
            minRuntime = None
        else:
            minRuntime = int(minRuntime)

        returnables = []

        # reset filter before each search
        allow_q = None

        with self.indexer.searcher() as search:
            qp = qparser.QueryParser('Title', self.indexer.schema)
            user_q = qp.parse(title)

            if Actor and Genre and Director and Production:
                allow_q = query.Term('Actor', Actor) and query.Term('Genre', Genre) and query.Term('Director',
                                                                                                   Director) and query.Term(
                    'Production', Production)
            elif Actor and Genre and Director:
                allow_q = query.Term('Actor', Actor) and query.Term('Genre', Genre) and query.Term('Director', Director)
            elif Actor and Genre and Production:
                allow_q = query.Term('Actor', Actor) and query.Term('Genre', Genre) and query.Term('Production',
                                                                                                   Production)
            elif Actor and Director and Production:
                allow_q = query.Term('Actor', Actor) and query.Term('Director', Director) and query.Term('Production',
                                                                                                         Production)
            elif Genre and Director and Production:
                allow_q = query.Term('Genre', Genre) and query.Term('Director', Director) and query.Term('Production',
                                                                                                         Production)
            elif Actor and Genre:
                allow_q = query.Term('Genre', Genre) and query.Term('Actors', Actor)
            elif Actor and Director:
                allow_q = query.Term('Director', Director) and query.Term('Actors', Actor)
            elif Actor and Production:
                allow_q = query.Term('Production', Production) and query.Term('Actors', Actor)
            elif Genre and Director:
                allow_q = query.Term('Director', Director) and query.Term('Genre', Genre)
            elif Genre and Production:
                allow_q = query.Term('Production', Production) and query.Term('Genre', Genre)
            elif Production and Director:
                allow_q = query.Term('Director', Director) and query.Term('Production', Production)
            elif Actor:
                allow_q = query.Term('Actors', Actor)
            elif Director:
                allow_q = query.Term('Director', Director)
            elif Genre:
                allow_q = query.Term('Genre', Genre)
            elif Production:
                allow_q = query.Term('Production', Production)

            if allow_q:
                results = search.search(user_q, filter=allow_q)
            else:
                results = search.search(user_q)
            for result in results:
                returnables.append(
                    {'id': result['id'], 'page_url': result['page_url'], 'image_url': result['image_url'],
                     'title': result['Title'],
                     'actors': result['Actors'], 'production': result['Production'], 'director': result['Director'],
                     'release_date': result['Release_date'],
                     'genre': result['Genre'], 'awards': result['Awards'], 'critics': result['Critic_Score'],
                     'runtime': result['RunTime']})
            return returnables

    def index(self):
        """ Establishes the whoosh database for the documents in our csv file
                Only indexes if a database does not already exist
                All fields of extracted data are indexed for the advanced search
                """
        # set up to only index once
        schema = Schema(id=ID(stored=True),
                        image_url=TEXT(stored=True),
                        page_url=TEXT(stored=True),
                        Title=TEXT(stored=True),
                        Actors=TEXT(stored=True),
                        Production=TEXT(stored=True),
                        Director=TEXT(stored=True),
                        Release_date=TEXT(stored=True),
                        Genre=TEXT(stored=True),
                        Awards=TEXT(stored=True),
                        Critic_Score=TEXT(stored=True),
                        RunTime=TEXT(stored=True))

        if not os.path.exists('indexdir'):
            os.mkdir('indexdir')

        if (exists_in('indexdir') != True):
            indexer = create_in('indexdir', schema)
            writer = indexer.writer()

            df = pd.read_csv(csv_file, encoding='iso-8859-1')

            for i in range(len(df)):
                writer.add_document(id=str(df.loc[i, 'id']),
                                    image_url=str(df.loc[i, 'image_url']),
                                    page_url=str(df.loc[i, 'page_url']),
                                    Title=str(df.loc[i, 'Title']),
                                    Actors=str(df.loc[i, 'Actors']),
                                    Production=str(df.loc[i, 'Production']),
                                    Director=str(df.loc[i, 'Director']),
                                    Release_date=str(df.loc[i, 'Release_date']),
                                    Genre=str(df.loc[i, 'Genre']),
                                    Awards=str(df.loc[i, 'Awards']),
                                    Critic_Score=str(df.loc[i, 'Critic_Score']),
                                    RunTime=str(df.loc[i, 'Runtime']))
            writer.commit()
            self.indexer = indexer

        else:
            self.indexer = open_dir('indexdir')


if __name__ == '__main__':
    global theWhooshSearch
    theWhooshSearch = WhooshSearch()
    theWhooshSearch.index()
    app.run(debug=True)
