import { GetStartedLabel } from "./components/components/GetStartedLabel";
import { Posts } from "./components/components/Posts";
import { QuickActions } from "./components/components/QuickActions";
import { RandomConnect } from "./components/components/RandomConnect";

export const Home = () => {
  return (
    <div className="flex flex-col gap-6">
      <GetStartedLabel />

      <QuickActions />
      <div className="flex flex-col lg:flex-row gap-6">
        <Posts />
        <RandomConnect />
      </div>
    </div>
  );
};
