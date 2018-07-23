const typeDefs = `
  type User @mongo(name:"users") {
    _id: ID!
    firstName: String
    lastName: String
    posts: [Post] @link(to: "author")
    comments: [Comment] @link(to: "user")
  }

  type Post @mongo(name:"posts") {
    _id: ID!
    name: String
    author: User @link(field: "authorId")
    authorId: String
    comments: [Comment] @link(to: "post")
  }

  type Comment @mongo(name:"comments") {
    _id: ID!
    text: String
    user: User @link(field: "userId")
    post: Post @link(field: "postId")
  }
`;

export { typeDefs };
