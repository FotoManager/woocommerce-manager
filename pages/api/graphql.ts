import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../apollo/schema";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { ServerResponse } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  schema,
  context(ctx: any) {
    return ctx;
  },    
});

const startServer = apolloServer.start();

export default async function handler(req:MicroRequest, res: ServerResponse) {

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}