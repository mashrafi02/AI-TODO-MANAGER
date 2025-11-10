
import CollectionBar from "./components/CollectionBar";
import TodoWindow from "./components/TodoWindow";
import { Toaster } from "react-hot-toast";


export default function App() {

  return (
      <>
            <Toaster
                position="top-center"
                reverseOrder={false}
              />
            <div className="grid grid-cols-[1fr_4fr] gap-x-1">
                <CollectionBar />
                <TodoWindow />
            </div>
      </>
  );
}

