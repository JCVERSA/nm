import { MessageCircle } from "lucide-react";
export default function ChatBubble({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-900/40 flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer ring-2 ring-indigo-400/30" aria-label="Chat bubble" title="Open chat">
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}
