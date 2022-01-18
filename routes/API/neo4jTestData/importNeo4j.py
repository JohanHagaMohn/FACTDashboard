import os
import json
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../../.env")

URI = os.getenv("NEO4J_DB_URI")
USERNAME = os.getenv("NEO4J_DB_USERNAME")
PASSWORD = os.getenv("NEO4J_DB_PASSWORD")

PATH = "./Archive/"


class neo4jClient:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def query(self, query, data=None):
        with self.driver.session() as session:
            session.run(query, data)
    
    def tweetExists(self, id):
        with self.driver.session() as session:
            result = session.run(
                "MATCH (n:tweet {id_str:$id_str}) RETURN n", id_str=id
            )
            return (result.single() != None)

    def addTweet(self, tweet, userId):
        tweetId = tweet["id_str"]

        if (self.tweetExists(tweetId)):
            return
        
        with self.driver.session() as session:
            session.run(
                "CREATE (n:tweet {id_str: $id_str})",
                {
                    "id_str": tweetId,
                }
            )

            session.run(
                """
                MATCH (t:tweet {id_str: $tweet_id})
                MATCH (u:user {id_str: $user_id})
                CREATE (t)-[:created_by]->(u)
                """,
                {
                    "tweet_id": tweetId,
                    "user_id": userId
                }
            )

    def userExists(self, id):
        with self.driver.session() as session:
            result = session.run(
                "MATCH (n:user {id_str:$id_str}) RETURN n", id_str=id
            )
            return result.single() != None

    def addUser(self, id):
        if (self.userExists(id)):
            return
        
        with self.driver.session() as session:
            session.run(
                "CREATE (n:user {id_str: $id_str})", id_str=id
            )



def readUsersJson(filename):
    ret = []
    with open(filename, "r", encoding="utf-8") as file:
        for line in file.readlines():
            data = json.loads(line)
            ret.append(data)
    
    return ret

def readEdgesFile(filename):
    ret = []
    with open(filename, "r", encoding="utf-8") as file:
        for i, line in enumerate(file.readlines()):
            if (i > 0):
                splitted = line.split(",")
                ret.append({
                    "src": splitted[0],
                    "trg": splitted[1][:-1]
                })
    
    return ret

def readNodesFile(filename):
    src = None
    ret = []
    with open(filename, "r", encoding="utf-8") as file:
        for i, line in enumerate(file.readlines()):
            if (i > 0):
                splitted = line.split(",")
                id = splitted[0]
                time = int(splitted[1])
                if (time == 0):
                    src = id
                else:
                    ret.append({
                        "id": id,
                        "time": time
                    })
    
    return src, ret

def addUsersWithTweet(users, client):
    for user in users:
        client.addUser(user["id_str"])
        
        if (not "status" in user):
            continue

        client.addTweet(user["status"], user["id_str"])

def addFollowerNetwork(network, client):
    for i in network:
        client.query(
            "MATCH (a:user {id_str: $src}) MATCH (b:user {id_str: $trg}) CREATE (a)-[:FOLLOW]->(b)",
            i,
        )

def createRetweetMap(uSrc, users, retweetTimes):
    
    def tweetIdFromUserId(uId):
        for user in users:
            if (user["id_str"] == uId):

                if (not "status" in user):
                    return None

                return user["status"]["id_str"]
    
    src = tweetIdFromUserId(uSrc)

    ret = []
    for i in retweetTimes:
        id = tweetIdFromUserId(i["id"])
        if (id):
            ret.append({
                "id": id,
                "time": i["time"]
            })
    
    return src, ret

def addRetweets(src, retweets, client):
    for i in retweets:
        #print(src + " -> " + i[0] + " @ " + str(i[1]))

        client.query(
            "MATCH (a:tweet {id_str: $src}) MATCH (b:tweet {id_str: $trg}) CREATE (a)<-[:retweet {time: $time}]-(b)",
            {"src": src, "trg": i["id"], "time": i["time"]},
        )

def importDir(path, client):
    users = readUsersJson(f"{path}/users.json") # User info
    followerNetwork = readEdgesFile(f"{path}/edges.csv")  # Follower network
    uSrc, retweetTimes = readNodesFile(f"{path}/nodes.csv")  # Retweet times

    # add users and tweet to neo4j, and bind them together
    addUsersWithTweet(users, client)
    # Add followernetwork
    addFollowerNetwork(followerNetwork, client)
    # Bind retweets
    src, retweets = createRetweetMap(uSrc, users, retweetTimes)
    addRetweets(src, retweets, client)



def main():
    client = neo4jClient(URI, USERNAME, PASSWORD)

    # Delete all data
    client.query("MATCH (n) DETACH DELETE n")

    countInt = 0

    for dir in os.scandir("./Archive"):
        countInt += 1
        print(f"{countInt}\t{countInt / 3.3}%")

        importDir(dir.path, client)

    client.close()

if __name__ == "__main__":
    main()
