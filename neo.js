const neo4j = require('neo4j-driver');

function connect(dbName) {
    console.log(dbName);
    this.dbName = dbName;
    this.driver = neo4j.driver(
        process.env.NEO4J_URL,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
}

function session() {
    console.log(this.dbName);
    return this.driver.session();
}

module.exports = {
    connect,
    session,
    makeFriend: 'MERGE(user1:User{id:$user1Id}) MERGE(user2: User{ id: $user2Id }) MERGE(user1)- [friends:FRIENDSWITH] -> (user2) RETURN collect(DISTINCT friends) AS friendship',
    removeFriend: 'MATCH(:User{id:$user1Id})-[relation:FRIENDSWITH]-(:User{id:$user2Id}) DELETE relation',
    getFriends: 'MATCH(:User{id:$id})-[:FRIENDSWITH]-(users:User) RETURN collect(DISTINCT users.id) AS userIds',
    getFriendRecommendations: 'MATCH(:User{id:$id})-[:FRIENDSWITH]-(users:User)-[:FRIENDSWITH]-(recommended:User) WHERE NOT (user)-[]-(recommended) RETURN collect(DISTINCT recommended.id) AS userIds',
    makeRequest: 'MERGE(user1:User{id:$user1Id}) MERGE(user2: User{ id: $user2Id }) MERGE(user1)- [friends:FRIEND_REQUESTED] -> (user2) RETURN collect(DISTINCT friends) AS friendship',
    acceptRequest: 'MATCH(user:User{id: $user1Id})-[relation:FRIEND_REQUESTED]-(user2:User{id: $user2Id}) CALL apoc.refactor.setType(relation, "FRIENDSWITH") YIELD input, output RETURN input, output',
    ignoreRequest: 'MATCH(user:User{id: $user1Id})-[relation:FRIEND_REQUESTED]-(user2:User{id: $user2Id}) REMOVE relation',
    getRequests: 'MATCH(user1:User{id: $user1Id})<-[:FRIEND_REQUESTED]-(user2:User) RETURN collect(DISTINCT user2.id) AS userIds'
}