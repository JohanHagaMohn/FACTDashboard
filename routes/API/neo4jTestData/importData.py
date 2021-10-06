import sys
import os
import json
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../../.env")

URI = os.getenv("NEO4J_DB_URI")
USERNAME = os.getenv("NEO4J_DB_USERNAME")
PASSWORD = os.getenv("NEO4J_DB_PASSWORD")

PATH = "./Archive/"

import importMongo


class neo4jClient:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def query(self, query, data=None):
        with self.driver.session() as session:
            session.run(query, data)

    def addTweet(self, tweet):
        if (not "status" in tweet):
            return

        with self.driver.session() as session:
            result = session.run(
                "MATCH (n:tweet {id_str:$id_str}) RETURN n", id_str=tweet["status"]["id_str"]
            )
            if result.single() == None:
                session.run(
                    "CREATE (n:tweet {id_str: $id_str})",
                    {
                        "id_str": tweet["status"]["id_str"],
                    },
                )

                session.run(
                    """
                    MATCH (t:tweet {id_str: $tweet_id})
                    MATCH (u:user {id_str: $user_id})
                    CREATE (t)-[:created_by]->(u)
                    """,
                    {
                        "tweet_id": tweet["status"]["id_str"],
                        "user_id": tweet["id_str"]
                    }
                )

    def addUser(self, user):
        with self.driver.session() as session:
            result = session.run(
                "MATCH (n:user {id_str:$id_str}) RETURN n", id_str=user["id_str"]
            )
            if result.single() == None:

                session.run(
                    "CREATE (n:user {id_str: $id_str})",
                    {
                        "id_str": user["id_str"],
                    },
                )

                # if ("status" in user):
                #     self.addTweet(user["status"])
                #
                #     self.query("MATCH (u:user {id_str: $uid_str}) MATCH (t:tweet {id_str: $tid_str}) CREATE (u)-[:tweeted]->(t)", {
                #         "uid_str": user["id_str"],
                #         "tid_str": user["status"]["id_str"]
                #     })


def findDirs(dirpath):
    dirs = []
    for (dirpath, dirnames, filenames) in os.walk(dirpath):
        dirs.extend(dirnames)
        break

    return dirs


def createJSONFile(fileIn, fileOut):
    with open(fileIn, "r", encoding="utf-8") as usersFile, open(
        fileOut, "w", encoding="utf-8"
    ) as outFile:
        outFile.write("[\n")
        lines = usersFile.readlines()
        if(len(lines) == 0):
            return "empty"
        for i in range(len(lines) - 1):
            outFile.write(lines[i][:-1] + ",\n")
        outFile.write(lines[-1][:-1] + "\n")
        outFile.write("]\n")


def findRetweetTimes(CSVfile):
    ret = {}
    with open(CSVfile, "r", encoding="utf-8") as file:

        for i, line in enumerate(file.readlines()):
            if i > 0:
                split = line.split(",")
                ret[split[0]] = split[1][:-1]

    return ret

def addUserData(client, mongo, file):
    with open(file, encoding="utf-8") as json_file:
        tweetData = json.load(json_file)
        for tweet in tweetData:
            #client.addUser(tweet)
            #mongo.addTweet(tweet)
            #mongo.addUser(tweet)
            client.addTweet(tweet)

def addFollowernetwork(path, client):
    with open(f"{path}/edges.csv", "r", encoding="utf-8") as edges:

        for i, edge in enumerate(edges.readlines()):
            if i > 0:
                split = edge.split(",")
                src = split[0]
                trg = split[1][:-1]

                client.query(
                    "MATCH (a:user {id_str: $src}) MATCH (b:user {id_str: $trg}) CREATE (a)-[:FOLLOW]->(b)",
                    {"src": src, "trg": trg},
                )

def addRetweetsRelationship(path, client):
    with open(f"{path}/nodes.csv", "r", encoding="utf-8") as retweetTime:
        src = path.split("\\")[-1]

        for i, retweet in enumerate(retweetTime.readlines()):
            if i > 0:
                split = retweet.split(",")
                trg = split[0]
                time = split[1][:-1]

                print(src)
                print(trg)
                print(time)
                exit(1)

                client.query(
                    "MATCH (:user {id_str: $src})<-[:created_by]-(a:tweet) MATCH (:user {id_str: $trg})<-[:created_by]-(b:tweet) CREATE (a)<-[:retweet {time: $time}]-(b)",
                    {"src": src, "trg": trg, "time": time},
                )

def main():
    client = neo4jClient(URI, USERNAME, PASSWORD)

    # Delete all data
    # client.query("MATCH (n) DETACH DELETE n")
    mongo = importMongo.mongo()
    mongo.connect()

    countInt = 0

    for dir in os.scandir("./Archive"):
        countInt += 1
        print(f"{countInt}\t{countInt / 3.3}%")

        #r = createJSONFile(f"{dir.path}/users.json", "tmp.json")
        #if (r == "empty"):
        #    continue
        #addUserData(client, mongo, "tmp.json")
        #os.remove("tmp.json")

        #addFollowernetwork(dir.path, client)

        addRetweetsRelationship(dir.path, client)

    client.close()

if __name__ == "__main__":
    main()
