import os
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.json_util import loads

load_dotenv(dotenv_path="../../../.env")


class mongo:
    def connect(self):
        self.USERNAME = os.getenv("MONGO_DB_USERNAME")
        self.PASSWORD = os.getenv("MONGO_DB_PASSWORD")
        self.DBIP = os.getenv("MONGO_DB_IP")
        self.DBNAME = os.getenv("MONGO_DB_DBNAME")
        self.DBPORT = os.getenv("MONGO_DB_PORT")
        self.DBURL = f"mongodb://{self.USERNAME}:{self.PASSWORD}@{self.DBIP}:{self.DBPORT}/{self.DBNAME}?authMechanism=DEFAULT"
        client = MongoClient(self.DBURL)
        print("Connected successfully to Mongo DB")
        self.DB = client[self.DBNAME]
        self.DB.tweets.remove({})
        self.DB.users.remove({})
        # print(DB.tweets.find_one({}))

    def addUser(self, tweet):
        # print(self.DB.tweets.find_one({}))
        res1 = self.DB.tweets.insert_one(tweet["status"])
        del tweet["status"]
        self.DB.users.insert_one(tweet)
        print(res1.inserted_id, self.DB.tweets.count_documents({}))


# mongoConnect()
