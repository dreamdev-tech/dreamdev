import { createSignal,createEffect ,onMount, onCleanup, For} from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = createSignal(0)
  createEffect(()=>{
    console.log('count:',count())
  },[
    
  ])
  onMount(()=>{
    console.log('onMount')
  }
)
onCleanup(()=>{
    console.log('onCleanup')
})
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <For each={[]} fallback={<div>np</div>}>
      {(item, index) => <div data-index={index()}>{item}</div>}

      </For>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  )
}

export default App
