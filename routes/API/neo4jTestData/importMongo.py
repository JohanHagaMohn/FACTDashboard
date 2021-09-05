import os
from pymongo import MongoClient


def mongoConnect():
    USERNAME = os.environ["MONGO_DB_USERNAME"]
    PASSWORD = os.environ["MONGO_DB_PASSWORD"]
    DBIP = os.environ["MONGO_DB_IP"]
    DBNAME = os.environ["MONGO_DB_DBNAME"]
    DBPORT = os.environ["MONGO_DB_PORT"]
    DBURL = f"mongodb://{USERNAME}:{PASSWORD}@{DBIP}:{DBPORT}/{DBNAME}?authMechanism=DEFAULT"
    client = MongoClient(DBURL)
    print("Connected successfully to Mongo DB")
    DB = client[DBNAME]
    tweetCol = DB.collection["tweets"]
    userCol = DB.collection["users"]

    print(client, "\n", DB.list_collection_names(), tweetCol.find_one({}))
