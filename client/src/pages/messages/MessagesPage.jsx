import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, MessageSquare, ArrowLeft, Circle } from 'lucide-react';
import { messageApi } from '../../api/message.api';
import useAuth from '../../hooks/useAuth';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import { timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

function ThreadItem({ thread, active, onClick }) {
  const { partner, lastMessage, lastAt, unread } = thread;
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all',
        active
          ? 'bg-indigo-50 dark:bg-indigo-500/10'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60',
      )}
    >
      <div className="relative shrink-0">
        <Avatar name={partner.name} size="md" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 font-mono text-[9px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className={cn('font-sans text-sm truncate', unread > 0 ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300')}>
            {partner.name}
          </p>
          <span className="font-mono text-[10px] text-slate-400 shrink-0">{timeAgo(lastAt)}</span>
        </div>
        <p className={cn('font-sans text-xs truncate mt-0.5', unread > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400')}>
          {lastMessage}
        </p>
        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-300 dark:text-slate-600">{partner.role}</span>
      </div>
    </button>
  );
}

function Bubble({ msg, isMe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-2 max-w-[78%]', isMe ? 'ml-auto flex-row-reverse' : '')}
    >
      {!isMe && <Avatar name={msg.from?.name} size="sm" className="shrink-0 mt-auto" />}
      <div className={cn('flex flex-col gap-0.5', isMe ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 font-sans text-sm leading-relaxed',
            isMe
              ? 'rounded-tr-sm bg-indigo-600 text-white'
              : 'rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200',
          )}
        >
          {msg.body}
        </div>
        <span className="font-mono text-[10px] text-slate-400 px-1">{timeAgo(msg.createdAt)}</span>
      </div>
    </motion.div>
  );
}

export default function MessagesPage() {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(paramUserId || null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const inputRef = useRef(null);

  const loadThreads = useCallback(async () => {
    try {
      const res = await messageApi.threads();
      setThreads(res?.data || []);
    } catch { /* silent */ }
    finally { setLoadingThreads(false); }
  }, []);

  const loadConversation = useCallback(async (uid, { showLoading = true } = {}) => {
    if (!uid) return;
    if (showLoading) {
      setLoadingMsgs(true);
    } else {
      setRefreshing(true);
    }

    try {
      const res = await messageApi.conversation(uid);
      setMessages(res?.data || []);
    } catch { toast.error('Failed to load messages'); }
    finally {
      if (showLoading) setLoadingMsgs(false);
      else setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => { loadThreads(); }, [loadThreads]);

  // Load conversation when active changes
  useEffect(() => {
    if (activeId) {
      loadConversation(activeId);
      navigate(`/messages/${activeId}`, { replace: true });
    }
  }, [activeId, loadConversation, navigate]);

  // Poll for new messages periodically
  useEffect(() => {
    if (!activeId) return;
    pollRef.current = setInterval(() => {
      loadConversation(activeId, { showLoading: false });
      loadThreads();
    }, 10000);
    return () => clearInterval(pollRef.current);
  }, [activeId, loadConversation, loadThreads]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeId) return;
    setSending(true);
    const body = draft.trim();
    setDraft('');
    try {
      const res = await messageApi.send(activeId, body);
      setMessages((prev) => [...prev, res.data]);
      loadThreads();
    } catch (err) {
      toast.error(err?.message || 'Failed to send');
      setDraft(body);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const activeThread = threads.find((t) => t.partner._id === activeId);
  const filtered = threads.filter((t) =>
    t.partner.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div className={cn(
        'flex flex-col border-r border-slate-100 dark:border-slate-800 w-full sm:w-72 shrink-0',
        activeId ? 'hidden sm:flex' : 'flex',
      )}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-3">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-2 font-sans text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loadingThreads ? (
            <div className="flex justify-center py-10"><Spinner className="text-indigo-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4">
              <MessageSquare size={28} className="text-slate-200 dark:text-slate-700 mb-2" />
              <p className="font-serif text-sm font-semibold text-slate-400">No conversations yet</p>
              <p className="font-sans text-xs text-slate-300 dark:text-slate-600 mt-1">
                Messages from recruiters will appear here
              </p>
            </div>
          ) : (
            filtered.map((t) => (
              <ThreadItem
                key={t.partner._id}
                thread={t}
                active={activeId === t.partner._id}
                onClick={() => setActiveId(t.partner._id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Conversation ────────────────────────────────────────────────── */}
      <div className={cn('flex-1 flex flex-col min-w-0', !activeId ? 'hidden sm:flex' : 'flex')}>
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 mb-4">
              <MessageSquare size={28} className="text-indigo-400" />
            </div>
            <p className="font-serif text-xl font-bold text-slate-700 dark:text-slate-300">Select a conversation</p>
            <p className="font-sans text-sm text-slate-400 mt-1 max-w-xs">
              Pick a thread on the left to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <button
                className="sm:hidden rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                onClick={() => setActiveId(null)}
              >
                <ArrowLeft size={16} />
              </button>
              {activeThread && (
                <>
                  <Avatar name={activeThread.partner.name} size="sm" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-slate-900 dark:text-white">{activeThread.partner.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{activeThread.partner.role}</p>
                  </div>
                </>
              )}
              <div className="ml-auto flex items-center gap-1.5">
                <Circle size={8} className="text-emerald-500 fill-emerald-500" />
                <span className="font-mono text-[10px] text-slate-400">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center py-10"><Spinner className="text-indigo-500" /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-serif text-base font-semibold text-slate-400">No messages yet</p>
                  <p className="font-sans text-xs text-slate-300 dark:text-slate-600 mt-1">Say hello 👋</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <Bubble
                      key={msg._id}
                      msg={msg}
                      isMe={msg.from?._id === user?._id || msg.from === user?._id}
                    />
                  ))}
                </AnimatePresence>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                  }}
                  placeholder="Type a message… (Enter to send)"
                  className="flex-1 resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 font-sans text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-32"
                  style={{ minHeight: '42px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim() || sending}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  {sending ? <Spinner size="sm" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
