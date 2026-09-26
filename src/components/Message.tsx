import {
  Copy,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import type { DisplayMessage } from '../types/chat'
import CodeBlock from './CodeBlock'

const DEMO_CODE = `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Clicked \${count} times\`;
  }, [count]); // re-run only when count changes

  return <button onClick={() => setCount(count + 1)}>+1</button>;
}`

type MessageProps = {
  message: DisplayMessage
}

export default function Message({ message }: MessageProps) {
  if (message.role === 'user') {
    return (
      <div className="msg user">
        <div className="bubble">{message.content}</div>
      </div>
    )
  }

  return (
    <div className="msg bot">
      <div className="bot-avatar">
        <Sparkles size={16} />
      </div>
      <div className="content">
        <div className="name">Nova</div>
        {message.typing ? (
          <div className="typing" aria-label="Nova is typing">
            <i />
            <i />
            <i />
          </div>
        ) : (
          <>
            {message.content}
            <div className="msg-actions">
              <button type="button" className="icon-btn" aria-label="Copy">
                <Copy size={15} />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Good response"
              >
                <ThumbsUp size={15} />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Bad response"
              >
                <ThumbsDown size={15} />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Regenerate"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function DemoBotReply() {
  return (
    <>
      <p>
        Sure! Think of hooks as a way to give a function component{' '}
        <b>memory</b> and <b>side effects</b>:
      </p>
      <ul>
        <li>
          <code>useState</code> — stores a value that, when changed, re-renders
          the component.
        </li>
        <li>
          <code>useEffect</code> — runs code <i>after</i> render, like fetching
          data or subscribing to events.
        </li>
      </ul>
      <CodeBlock language="jsx">{DEMO_CODE}</CodeBlock>
      <p>
        A quick rule: if it&apos;s <b>data you display</b>, use state. If
        it&apos;s <b>something that happens because data changed</b>, use an
        effect.
      </p>
    </>
  )
}

type PlaceholderReplyProps = {
  text: string
}

export function PlaceholderReply({ text }: PlaceholderReplyProps) {
  return (
    <p>
      This is a design preview, so I&apos;m not connected to a model yet. Once
      you wire up the backend, the answer to <b>&ldquo;{text}&rdquo;</b> will
      stream in here.
    </p>
  )
}
