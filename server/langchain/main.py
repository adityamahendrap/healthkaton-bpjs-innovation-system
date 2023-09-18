import os
from dotenv import load_dotenv
load_dotenv()
import ast
import re
from langchain.utilities import SQLDatabase
from langchain.llms import OpenAI
from langchain_experimental.sql import SQLDatabaseChain
from langchain.chat_models import ChatOpenAI
from langchain.chains import create_sql_query_chain
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import AgentExecutor
from langchain.agents.agent_types import AgentType
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document
from langchain.agents.agent_toolkits import create_retriever_tool
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from sqlalchemy import create_engine
from flask import Flask
from flask import request
import time

app = Flask(__name__)

@app.route("/langchain", methods=['POST'])
def langchain():
    specific_value = request.get_json()
    openAiRequestCount = specific_value.get('openAiRequestCount')
    if(openAiRequestCount == "3" or openAiRequestCount == 3):
        print("waiting 60 seconds for time limit exceeded")
        time.sleep(60)
    question = specific_value.get('question')
    answer = SQLAgent(question)
    return answer

db_uri = "mysql+mysqlconnector://root:@localhost:3306/jkn_bpjs"
db = SQLDatabase.from_uri(db_uri)
few_shots = {'List all artists.': 'SELECT * FROM artists;',
             "Find all albums for the artist 'AC/DC'.": "SELECT * FROM albums WHERE ArtistId = (SELECT ArtistId FROM artists WHERE Name = 'AC/DC');",
             "List all tracks in the 'Rock' genre.": "SELECT * FROM tracks WHERE GenreId = (SELECT GenreId FROM genres WHERE Name = 'Rock');",
             'Find the total duration of all tracks.': 'SELECT SUM(Milliseconds) FROM tracks;',
             'List all customers from Canada.': "SELECT * FROM customers WHERE Country = 'Canada';",
             'How many tracks are there in the album with ID 5?': 'SELECT COUNT(*) FROM tracks WHERE AlbumId = 5;',
             'Find the total number of invoices.': 'SELECT COUNT(*) FROM invoices;',
             'List all tracks that are longer than 5 minutes.': 'SELECT * FROM tracks WHERE Milliseconds > 300000;',
             'Who are the top 5 customers by total purchase?': 'SELECT CustomerId, SUM(Total) AS TotalPurchase FROM invoices GROUP BY CustomerId ORDER BY TotalPurchase DESC LIMIT 5;',
             'Which albums are from the year 2000?': "SELECT * FROM albums WHERE strftime('%Y', ReleaseDate) = '2000';",
             'How many employees are there': 'SELECT COUNT(*) FROM "employee"'
            }

def generateInstantAnswer(question):
    llm = OpenAI(temperature=0, verbose=True)
    db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)
    db_chain.run(question)

# Bassicaly generateInstantAnswer with more verbose but powerfull
def SQLAgent(question):
    agent_executor = create_sql_agent(
        llm=OpenAI(temperature=0),
        toolkit=SQLDatabaseToolkit(db=db, llm=OpenAI(temperature=0)),
        verbose=True,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    )
    result = agent_executor.run(question)
    return result
    
def generateSQLByQuestion(question):
    chain = create_sql_query_chain(ChatOpenAI(temperature=0), db)
    response = chain.invoke({"question":question})
    return response

def runSQLQuery(sql):
    return db.run(sql)

def tableInfo(tableName) :
    db = SQLDatabase.from_uri(
        db_uri,
        include_tables=[tableName],
        sample_rows_in_table_info=2
    )
    return db.table_info

# Langchain's retriever is used to suggest the SQL query based on the user's question and the retrieved SQL query. 
# Note that the matched SQL query in dictionary is not executed, but only used to retrieve the relevant examples.
def SQLAgentWithRetriever(question):
    if question in few_shots:
        sql_query = few_shots[question]
    else:
        sql_query = "DEFAULT_SQL_QUERY" 

    embeddings = OpenAIEmbeddings()
    few_shot_docs = [Document(page_content=question, metadata={'sql_query': sql_query})]
    vector_db = FAISS.from_documents(few_shot_docs, embeddings)
    retriever = vector_db.as_retriever()

    tool_description = """
    This tool will help you understand similar examples to adapt them to the user question.
    Input to this tool should be the user question.
    """
    
    custom_suffix = """
    I should first get the similar examples I know.
    If the examples are enough to construct the query, I can build it.
    Otherwise, I can then look at the tables in the database to see what I can query.
    Then I should query the schema of the most relevant tables
    """

    retriever_tool = create_retriever_tool(
        retriever,
        name='sql_get_similar_examples',
        description=tool_description
    )
    custom_tool_list = [retriever_tool]
    agent_executor = create_sql_agent(
        llm=ChatOpenAI(temperature=0),
        toolkit=SQLDatabaseToolkit(db=db, llm=ChatOpenAI(temperature=0)),
        custom_tool_list=custom_tool_list,
        verbose=True,
        agent_type=AgentType.OPENAI_FUNCTIONS,
        suffix=custom_suffix
    )
    agent_executor.run(question)
    
# i don't what this is
def storePrompt():
    def run_query_save_results(db, query):
        res = db.run(query)
        res = [el for sub in ast.literal_eval(res) for el in sub if el]
        res = [re.sub(r'\b\d+\b', '', string).strip() for string in res]
        return res

    artists = run_query_save_results(db, "SELECT Name FROM Artist")
    albums = run_query_save_results(db, "SELECT Title FROM Album")
    
    texts = (artists + albums)

    embeddings = OpenAIEmbeddings()
    vector_db = FAISS.from_texts(texts, embeddings)
    retriever = vector_db.as_retriever()

    retriever_tool = create_retriever_tool(
        retriever,
        name='name_search',
        description='use to learn how a piece of data is actually written, can be from names, surnames addresses etc'
    )
    custom_tool_list = [retriever_tool]
    
