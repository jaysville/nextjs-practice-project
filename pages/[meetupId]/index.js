import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";

const MeetupDetails = ({ meetupData }) => {
  const { title, image, address, description } = meetupData;
  return (
    <MeetupDetail
      title={title}
      image={image}
      address={address}
      description={description}
    />
  );
};

export const getStaticPaths = async () => {
  const url = process.env.NEXT_PUBLIC_DB_URL;

  const client = new MongoClient(url);

  const dbName = "react-meetups";

  await client.connect();

  console.log("server connection established!");

  const db = client.db(dbName);
  const collection = db.collection("meetups");

  const meetups = await collection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  const { meetupId } = context.params;
  const url = process.env.NEXT_PUBLIC_DB_URL;

  const client = new MongoClient(url);

  const dbName = "react-meetups";

  await client.connect();

  console.log("server connection established!");

  const db = client.db(dbName);
  const collection = db.collection("meetups");

  const selectedMeetup = await collection.findOne({ _id: ObjectId(meetupId) });
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetails;
