
import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString
  } from "graphql";
  
  const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLID },
      email: { type: GraphQLString },
      username: { type: GraphQLString },
      password: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    }),
  });
  
  export default UserType;