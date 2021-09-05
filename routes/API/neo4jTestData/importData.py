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
        with self.driver.session() as session:
            result = session.run(
                "MATCH (n:tweet {id_str:$id_str}) RETURN n", id_str=tweet["id_str"]
            )
            if result.single() == None:
                session.run(
                    "CREATE (n:tweet {id_str: $id_str, full_text: $full_text, created_at: $created_at})",
                    {
                        "id_str": tweet["id_str"],
                        "full_text": tweet["full_text"],
                        "created_at": tweet["created_at"],
                    },
                )

    def addUser(self, user):
        with self.driver.session() as session:
            result = session.run(
                "MATCH (n:user {id_str:$id_str}) RETURN n", id_str=user["id_str"]
            )
            if result.single() == None:

                session.run(
                    "CREATE (n:user {id_str: $id_str, name: $name, screen_name: $screen_name, created_at: $created_at, full_text: $full_text, profile_image_url_https: $profile_image_url_https})",
                    {
                        "id_str": user["id_str"],
                        "name": user["name"],
                        "screen_name": user["screen_name"],
                        "created_at": user["status"]["created_at"],
                        "full_text": user["status"]["full_text"],
                        "profile_image_url_https": user["profile_image_url_https"],
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
    with open("tmp.json", encoding="utf-8") as json_file:
        tweetData = json.load(json_file)
        for tweet in tweetData:
            client.addUser(tweet)
            mongo.addUser(tweet)


def main():
    client = neo4jClient(URI, USERNAME, PASSWORD)

    # Delete all data
    client.query("MATCH (n) DETACH DELETE n")

    createJSONFile("./1099560067370704896/users.json", "tmp.json")
    mongo = importMongo.mongo()
    mongo.connect()
    addUserData(client, mongo, "tmp.json")
    os.remove("tmp.json")

    with open("./1099560067370704896/edges.csv", "r", encoding="utf-8") as edges:

        for i, edge in enumerate(edges.readlines()):
            if i > 0:
                split = edge.split(",")
                src = split[0]
                trg = split[1][:-1]

                client.query(
                    "MATCH (a:user {id_str: $src}) MATCH (b:user {id_str: $trg}) CREATE (a)-[:FOLLOW]->(b)",
                    {"src": src, "trg": trg},
                )

    client.close()


def fromFolder(client):

    for dir in findDirs(PATH):
        createJSONFile(PATH + dir + "/users.json", "tmp.json")
        addUserData(client, "tmp.json")

        os.remove("tmp.json")

        with open(PATH + dir + "/edges.csv", "r", encoding="utf-8") as edges:

            for i, edge in enumerate(edges.readlines()):
                if i > 0:
                    split = edge.split(",")
                    src = split[0]
                    trg = split[1][:-1]

                    client.query(
                        "MATCH (a:user {id_str: $src}) MATCH (b:user {id_str: $trg}) CREATE (a)-[:FOLLOW]->(b)",
                        {"src": src, "trg": trg},
                    )

        break


if __name__ == "__main__":
    main()
