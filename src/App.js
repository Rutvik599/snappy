import { Button } from '@radix-ui/themes';
import './App.css';

function App() {
  return (
    <>
    <div className='maindiv'>

     <h1 className="font-bold  text-red-300 px-5" id='h1'>
      Hello world!
    </h1>
    <Button variant="outline" className='text-zinc-500'>Button</Button>
    </div>
    </>
  );
}

export default App;
