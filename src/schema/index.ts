import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
  } from "graphql";
  import UserType from "./User";
  import User from "../models/User";
  import { hashPassword, verifyPassword } from "../utils/passwordUtils";
  
  // Queries
  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      // Query to get all users
      users: {
        type: new GraphQLList(UserType),
        resolve: async () => {
          try {
            const users = await User.find();
            return users.map((user) => ({
              ...user.toObject(),
              id: user._id,
              createdAt: user.createdAt.toISOString(), // Format createdAt as ISO 8601
              updatedAt: user.updatedAt.toISOString(), // Format createdAt as ISO 8601
            }));
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
  
      // Query to get a user by ID
      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(GraphQLString) } },
        resolve: async (_, args) => {
          try {
            const user = await User.findById(args.id);
            return {
              ...user.toObject(),
              id: user._id,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
            };
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
    },
  });
  
  // Mutations
  const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      // Mutation to add a new user
      addUser: {
        type: UserType,
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          username: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
  
        resolve: async (_, args) => {
          try {
            // Destructure password
            const { password, ...others } = args;
  
            //   Send a hashed password
            const hashedPassword = await hashPassword(password);
  
            console.log(hashPassword);
  
            const user = new User({
              password: hashedPassword,
              ...others,
            });
            const savedUser = await user.save();


      return savedUser;
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
  
      // Mutation to update a user by ID
      updateUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          username: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (_, args) => {
          try {
            return await User.findByIdAndUpdate(args.id, args, { new: true });
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
  
      // Mutation to delete a user by ID
      deleteUser: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(GraphQLString) } },
        resolve: async (_, args) => {
          try {
            return await User.findByIdAndDelete(args.id);
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
      login: {
        type: GraphQLString, // We'll return the token as a string
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, { email, password }) => {
          try {
            // Find user by email
            const user:any = await User.findOne({ email });
  
            if (!user) {
              throw new Error("Invalid email or password");
            }
  
            // Compare password (you should hash the password to check)
            const isPasswordValid = await verifyPassword(password, user.password);
  
            if (!isPasswordValid) {
              throw new Error("Invalid email or password");
            }
  
            // Generate JWT token
            const token = hashPassword(user._id);
  
            return token; // Return the token
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
    },
  });
  
  export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
  });
  