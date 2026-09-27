import {
  AlertCircle,
  Copy,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import type { DisplayMessage } from '../types/chat'
import { cn, iconBtn, logoMark } from '../lib/cn'
import CodeBlock from './CodeBlock'
import MarkdownMessage from './MarkdownMessage'

const DEMO_CODE = `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Clicked \${count} times\`;
  }, [count]); // re-run only when count changes

  return <button onClick={() => setCount(count + 1)}>+1</button>;
}`

const prose =
  '[&_p+_p]:mt-2.5 [&_p+_ul]:mt-2.5 [&_ul+_p]:mt-2.5 [&_pre+_p]:mt-2.5 [&_.code-block+_p]:mt-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_li]:marker:text-brand [&_code]:rounded-[5px] [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:text-[13px]'

type MessageProps = {
  message: DisplayMessage
}

export default function Message({ message }: MessageProps) {
  if (message.role === 'user') {
    return (
      <div className="mb-7 flex animate-rise justify-end gap-3.5">
        <div className="max-w-[90%] rounded-2xl rounded-br-md bg-user px-4 py-2.5 text-user-fg md:max-w-[80%]">
          {message.content}
        </div>
      </div>
    )
  }

  const markdown =
    !message.error && typeof message.content === 'string'
      ? message.content
      : null

  return (
    <div className="mb-7 flex animate-rise gap-3.5">
      <div className={logoMark}>
        <Sparkles size={16} />
      </div>
      <div className={cn('min-w-0 flex-1 pt-1', !message.error && prose)}>
        <div className="mb-1 text-sm font-semibold">Nova</div>
        {message.typing ? (
          <div className="inline-flex gap-1.5 py-2.5" aria-label="Nova is typing">
            <i className="size-1.5 animate-blink rounded-full bg-fg-3 [animation-delay:0s]" />
            <i className="size-1.5 animate-blink rounded-full bg-fg-3 [animation-delay:0.15s]" />
            <i className="size-1.5 animate-blink rounded-full bg-fg-3 [animation-delay:0.3s]" />
          </div>
        ) : (
          <>
            {message.error ? (
              <ErrorReply
                text={
                  typeof message.content === 'string'
                    ? message.content
                    : 'Something went wrong.'
                }
              />
            ) : markdown != null ? (
              <MarkdownMessage
                content={markdown}
                isAnimating={Boolean(message.streaming)}
              />
            ) : (
              message.content
            )}
            {!message.streaming && !message.error && (
              <div className="-ml-2 mt-2.5 flex gap-0.5">
                <button
                  type="button"
                  className={cn(iconBtn, 'size-7.5')}
                  aria-label="Copy"
                >
                  <Copy size={15} />
                </button>
                <button
                  type="button"
                  className={cn(iconBtn, 'size-7.5')}
                  aria-label="Good response"
                >
                  <ThumbsUp size={15} />
                </button>
                <button
                  type="button"
                  className={cn(iconBtn, 'size-7.5')}
                  aria-label="Bad response"
                >
                  <ThumbsDown size={15} />
                </button>
                <button
                  type="button"
                  className={cn(iconBtn, 'size-7.5')}
                  aria-label="Regenerate"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

type ErrorReplyProps = {
  text: string
}

export function ErrorReply({ text }: ErrorReplyProps) {
  return (
    <div
      className="flex gap-2.5 rounded-xl border border-[#d94848]/28 bg-[#d94848]/08 px-3.5 py-3"
      role="alert"
    >
      <AlertCircle
        size={16}
        className="mt-0.5 shrink-0 text-[#d94848]"
        aria-hidden
      />
      <p className="m-0 text-[14px] leading-relaxed text-fg-2">{text}</p>
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
