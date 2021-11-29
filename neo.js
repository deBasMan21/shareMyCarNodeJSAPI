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
    getFriends: 'MATCH(:User{id:$id})-[:FRIENDSWITH]-(users:User) RETURN collect(DISTINCT users.id) AS userIds',
    getFriendRecommendations: 'MATCH(:User{id:$id})-[:FRIENDSWITH]-(users:User)-[:FRIENDSWITH]-(recommended:User) RETURN collect(DISTINCT recommended.id) AS userIds',
    removeFriend: 'MATCH(:User{id:$user1Id})-[relation:FRIENDSWITH]-(:User{id:$user2Id}) DELETE relation'
}