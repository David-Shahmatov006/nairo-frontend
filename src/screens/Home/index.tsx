import { GetStartedLabel } from "./components/GetStartedLabel";
import { QuickActions } from "./components/QuickActions";

const postsMock = [
  { id: 1, author: "Alice", content: "My first post!" },
  { id: 2, author: "Bob", content: "Hello world!" },
  { id: 3, author: "Charlie", content: "Loving Nairo coins!" },
];

export const Home = () => {
  return (
    <div className="flex flex-col gap-6">
      <GetStartedLabel />

        <QuickActions />
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="flex-1 flex flex-col gap-4">
          {postsMock.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <p className="font-semibold">{post.author}</p>
              <p>{post.content}</p>
            </div>
          ))}
        </div>

        {/* Random Connect */}
        <div className="hidden lg:flex flex-col gap-3 lg:w-1/4">
          <h2 className="text-lg font-semibold">Random Connect</h2>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p>Meet a new friend!</p>
            <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
