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
        # self.DB.tweets.remove({})
        # self.DB.users.remove({})
        # print(DB.tweets.find_one({}))

    def addTweet(self, tweet):
        try:
            if not self.DB.tweets.find_one(
                {"id_str": {"$eq": tweet["status"]["id_str"]}}
            ):
                res1 = self.DB.tweets.insert_one(tweet["status"])
                print("Tweets: ", res1.inserted_id, self.DB.tweets.count_documents({}))
            else:
                print(
                    self.DB.tweets.find_one(
                        {"id_str": {"$eq": tweet["status"]["id_str"]}}
                    )
                )
        except KeyError:
            pass

    def addUser(self, tweet):
        # print(self.DB.tweets.find_one({}))
        try:
            del tweet["status"]
        except KeyError:
            pass
        if not self.DB.users.find_one({"id_str": {"$eq": tweet["id_str"]}}):
            res2 = self.DB.users.insert_one(tweet)
            print("Users: ", res2.inserted_id, self.DB.users.count_documents({}))


# mongoConnect()
