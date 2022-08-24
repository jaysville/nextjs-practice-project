import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>REACT MEETUPS</title>
        <meta
          name="description"
          content="Browse a huge list of active meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

// export const getServerSideProps = (context) => {
//   //can fetch data from an api
//   //runs only on the server
//   //it runs for every incoming request

//   const req = context.req;
//   const res = context.res;

//   return {
//     props: { meetups: DUMMY_MEETUPS },
//   };
// };

export const getStaticProps = async () => {
  const url = process.env.NEXT_PUBLIC_DB_URL;

  const client = new MongoClient(url);

  const dbName = "react-meetups";

  await client.connect();

  console.log("server connection established!");

  const db = client.db(dbName);
  const collection = db.collection("meetups");

  const meetups = await collection.find().toArray();

  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
};
export default HomePage;
