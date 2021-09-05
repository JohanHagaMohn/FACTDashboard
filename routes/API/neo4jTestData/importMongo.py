import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../../.env")


def mongoConnect():
    USERNAME = os.getenv("MONGO_DB_USERNAME")
    PASSWORD = os.getenv("MONGO_DB_PASSWORD")
    DBIP = os.getenv("MONGO_DB_IP")
    DBNAME = os.getenv("MONGO_DB_DBNAME")
    DBPORT = os.getenv("MONGO_DB_PORT")
    DBURL = f"mongodb://{USERNAME}:{PASSWORD}@{DBIP}:{DBPORT}/{DBNAME}?authMechanism=DEFAULT"
    client = MongoClient(DBURL)
    print("Connected successfully to Mongo DB")
    DB = client[DBNAME]
    tweetCol = DB.collection["tweets"]
    userCol = DB.collection["users"]

    print(
        client,
        "\n",
        DB.list_collection_names(),
        tweetCol.find_one({"id_str": "1295320924938481667"}),
        tweetCol.count_documents({}),
    )
    import pprint

    pprint.pprint(tweetCol.find_one())


mongoConnect()
