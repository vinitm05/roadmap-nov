"use client";
import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-11-01T00:00:00");
const START_DATE = new Date("2026-05-11T00:00:00");

const PHASES = [
  {
    id: 1,
    name: "Phase 1 — Foundations",
    weeks: "Weeks 1–6",
    color: "#1D9E75",
    badgeBg: "#E1F5EE",
    badgeColor: "#0F6E56",
    badge: "DSA only",
    detail: "No system design yet. Build pattern recognition. Weekdays: 1 topic + 2 problems. Weekend: 3 topics + 6–8 problems + 1 solo mock.",
    tip: "After every problem, write one sentence explaining the core insight. This builds pattern recognition — not volume.",
    focus: ["Arrays & hashing","Two pointers","Sliding window","Stacks & queues","Linked lists","Binary search","Trees"],
  },
  {
    id: 2,
    name: "Phase 2 — Core depth",
    weeks: "Weeks 7–14",
    color: "#185FA5",
    badgeBg: "#E6F1FB",
    badgeColor: "#185FA5",
    badge: "DSA + System design",
    detail: "60% DSA (harder topics), 40% system design. Start DDIA. Begin designing: URL shortener, rate limiter, cache.",
    tip: "The first 4 chapters of DDIA are more valuable than any YouTube playlist. Read slowly, take notes.",
    focus: ["Graphs","Dynamic programming","Heaps & tries","Backtracking","DDIA reading","Gaurav Sen / ByteByteGo","Design fundamentals"],
  },
  {
    id: 3,
    name: "Phase 3 — Interview mode",
    weeks: "Weeks 15–20",
    color: "#BA7517",
    badgeBg: "#FAEEDA",
    badgeColor: "#854F0B",
    badge: "Mock interviews",
    detail: "Simulate real interviews. DSA is revision + hard problems under time pressure. System design sessions should be spoken aloud.",
    tip: "Start applying during week 18. Don't wait until you feel ready — the first few interviews are calibration.",
    focus: ["Timed mocks (45 min)","Full system design sessions","Design: Slack, Uber, Twitter","Hard problem revision","Pramp / Interviewing.io"],
  },
  {
    id: 4,
    name: "Phase 4 — Active applications",
    weeks: "Weeks 21–24",
    color: "#993C1D",
    badgeBg: "#FAECE7",
    badgeColor: "#993C1D",
    badge: "Apply + close",
    detail: "Lighter study, heavier execution. Every application tailored. Behavioral prep matters a lot for remote-first companies.",
    tip: "GitLab and Deel specifically value async communication. Your cover letter carries more weight than you'd expect.",
    focus: ["2–3 applications/week","STAR behavioral prep","Async writing practice","Resume + LinkedIn polish","Luna blog post live","Negotiate offers"],
  },
];

const WEEKS = [
  { w:1, phase:1, title:"Arrays & hashing", detail:"Contains Duplicate, Valid Anagram, Two Sum, Group Anagrams, Top K Frequent" },
  { w:2, phase:1, title:"Two pointers + sliding window", detail:"Valid Palindrome, 3Sum, Container With Water, Longest Substring" },
  { w:3, phase:1, title:"Stack & binary search", detail:"Valid Parentheses, Min Stack, Find Min Rotated, Search Rotated Array" },
  { w:4, phase:1, title:"Linked lists", detail:"Reverse Linked List, Merge Two Lists, Reorder List, LRU Cache" },
  { w:5, phase:1, title:"Trees (basics)", detail:"Invert Binary Tree, Max Depth, Level Order, Validate BST, Kth Smallest" },
  { w:6, phase:1, title:"Trees (advanced) + revision", detail:"LCA, Serialize/Deserialize, Binary Tree Max Path. Full Phase 1 mock." },
  { w:7, phase:2, title:"Heap & priority queue", detail:"Kth Largest Element, K Closest Points, Task Scheduler, Median Finder" },
  { w:8, phase:2, title:"Graphs (basics)", detail:"Number of Islands, Clone Graph, Course Schedule, Pacific Atlantic" },
  { w:9, phase:2, title:"Graphs (advanced)", detail:"Word Ladder, Alien Dictionary, Swim in Rising Water, Dijkstra" },
  { w:10, phase:2, title:"DDIA — Part 1", detail:"Chapters 1–4: Data models, storage engines, encoding. Take notes." },
  { w:11, phase:2, title:"DP (basics)", detail:"Climbing Stairs, House Robber, Coin Change, Longest Common Subsequence" },
  { w:12, phase:2, title:"DP (2D) + DDIA Part 2", detail:"Unique Paths, Edit Distance, Interleaving String. DDIA Ch 5–7: Replication." },
  { w:13, phase:2, title:"Tries + intervals", detail:"Implement Trie, Word Search II, Insert Interval, Meeting Rooms II" },
  { w:14, phase:2, title:"Backtracking + DDIA Part 3", detail:"Subsets, Permutations, N-Queens. DDIA Ch 8–9: Distributed systems." },
  { w:15, phase:3, title:"Mock week 1", detail:"Full timed mocks daily. Design: URL shortener, rate limiter." },
  { w:16, phase:3, title:"Mock week 2", detail:"Hard problems only. Design: key-value store, distributed cache." },
  { w:17, phase:3, title:"Mock week 3", detail:"Pramp sessions. Design: Slack / chat system, notification service." },
  { w:18, phase:3, title:"Mock week 4 + start applying", detail:"First 3 applications out. Design: Uber / ride-sharing, newsfeed." },
  { w:19, phase:3, title:"Mock week 5 + applications", detail:"Design: YouTube, typeahead search. 3 more applications." },
  { w:20, phase:3, title:"Mock week 6 + applications", detail:"Weak spots revision. 3 more applications. Full behavioral prep." },
  { w:21, phase:4, title:"Active applications", detail:"GitLab, Deel, Stripe applications. Luna blog post must be live." },
  { w:22, phase:4, title:"Active applications", detail:"Shopify, Airbnb, remote boards. Follow up on week 18–19 applications." },
  { w:23, phase:4, title:"Interviews + light prep", detail:"Maintain sharpness. No new topics. Review based on interview feedback." },
  { w:24, phase:4, title:"Final push", detail:"Close open loops. Negotiate any offers. Decide before going home." },
];

const COMPANIES = {
  remote: [
    { name:"GitLab", tag:"DevSecOps · fully remote", sal:"$90k–$130k" },
    { name:"Deel", tag:"HR/payroll infra · remote", sal:"$80k–$120k" },
    { name:"Stripe", tag:"Payments infra · remote", sal:"$110k–$160k" },
    { name:"Shopify", tag:"Commerce platform · remote", sal:"$95k–$140k" },
    { name:"Airbnb", tag:"Travel · remote roles", sal:"$120k–$175k" },
  ],
  india: [
    { name:"Razorpay", tag:"Fintech · Bangalore", sal:"28–40 LPA" },
    { name:"CRED", tag:"Fintech · Bangalore", sal:"30–45 LPA" },
    { name:"Zepto", tag:"Q-commerce · growing fast", sal:"25–35 LPA" },
    { name:"Groww", tag:"Fintech · Bangalore", sal:"25–38 LPA" },
    { name:"Google / Microsoft IDC", tag:"Big tech · Bangalore", sal:"35–60 LPA" },
  ],
};

const SUGGESTED_PROBLEMS = [
  { name:"Contains Duplicate", topic:"Arrays & Hashing", difficulty:"Easy", week:1, url:"https://leetcode.com/problems/contains-duplicate/" },
  { name:"Valid Anagram", topic:"Arrays & Hashing", difficulty:"Easy", week:1, url:"https://leetcode.com/problems/valid-anagram/" },
  { name:"Two Sum", topic:"Arrays & Hashing", difficulty:"Easy", week:1, url:"https://leetcode.com/problems/two-sum/" },
  { name:"Group Anagrams", topic:"Arrays & Hashing", difficulty:"Medium", week:1, url:"https://leetcode.com/problems/group-anagrams/" },
  { name:"Top K Frequent Elements", topic:"Arrays & Hashing", difficulty:"Medium", week:1, url:"https://leetcode.com/problems/top-k-frequent-elements/" },
  { name:"Valid Palindrome", topic:"Two Pointers", difficulty:"Easy", week:2, url:"https://leetcode.com/problems/valid-palindrome/" },
  { name:"3Sum", topic:"Two Pointers", difficulty:"Medium", week:2, url:"https://leetcode.com/problems/3sum/" },
  { name:"Container With Most Water", topic:"Two Pointers", difficulty:"Medium", week:2, url:"https://leetcode.com/problems/container-with-most-water/" },
  { name:"Longest Substring Without Repeating", topic:"Sliding Window", difficulty:"Medium", week:2, url:"https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { name:"Valid Parentheses", topic:"Stack", difficulty:"Easy", week:3, url:"https://leetcode.com/problems/valid-parentheses/" },
  { name:"Min Stack", topic:"Stack", difficulty:"Medium", week:3, url:"https://leetcode.com/problems/min-stack/" },
  { name:"Search in Rotated Sorted Array", topic:"Binary Search", difficulty:"Medium", week:3, url:"https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { name:"Find Minimum in Rotated Sorted Array", topic:"Binary Search", difficulty:"Medium", week:3, url:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { name:"Reverse Linked List", topic:"Linked List", difficulty:"Easy", week:4, url:"https://leetcode.com/problems/reverse-linked-list/" },
  { name:"Merge Two Sorted Lists", topic:"Linked List", difficulty:"Easy", week:4, url:"https://leetcode.com/problems/merge-two-sorted-lists/" },
  { name:"Reorder List", topic:"Linked List", difficulty:"Medium", week:4, url:"https://leetcode.com/problems/reorder-list/" },
  { name:"LRU Cache", topic:"Linked List", difficulty:"Medium", week:4, url:"https://leetcode.com/problems/lru-cache/" },
  { name:"Invert Binary Tree", topic:"Trees", difficulty:"Easy", week:5, url:"https://leetcode.com/problems/invert-binary-tree/" },
  { name:"Maximum Depth of Binary Tree", topic:"Trees", difficulty:"Easy", week:5, url:"https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { name:"Binary Tree Level Order Traversal", topic:"Trees", difficulty:"Medium", week:5, url:"https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { name:"Validate Binary Search Tree", topic:"Trees", difficulty:"Medium", week:5, url:"https://leetcode.com/problems/validate-binary-search-tree/" },
  { name:"LCA of Binary Tree", topic:"Trees", difficulty:"Medium", week:6, url:"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  { name:"Serialize and Deserialize Binary Tree", topic:"Trees", difficulty:"Hard", week:6, url:"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  { name:"Kth Largest Element in Array", topic:"Heap", difficulty:"Medium", week:7, url:"https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { name:"K Closest Points to Origin", topic:"Heap", difficulty:"Medium", week:7, url:"https://leetcode.com/problems/k-closest-points-to-origin/" },
  { name:"Task Scheduler", topic:"Heap", difficulty:"Medium", week:7, url:"https://leetcode.com/problems/task-scheduler/" },
  { name:"Number of Islands", topic:"Graphs", difficulty:"Medium", week:8, url:"https://leetcode.com/problems/number-of-islands/" },
  { name:"Clone Graph", topic:"Graphs", difficulty:"Medium", week:8, url:"https://leetcode.com/problems/clone-graph/" },
  { name:"Course Schedule", topic:"Graphs", difficulty:"Medium", week:8, url:"https://leetcode.com/problems/course-schedule/" },
  { name:"Word Ladder", topic:"Graphs", difficulty:"Hard", week:9, url:"https://leetcode.com/problems/word-ladder/" },
  { name:"Climbing Stairs", topic:"Dynamic Programming", difficulty:"Easy", week:11, url:"https://leetcode.com/problems/climbing-stairs/" },
  { name:"House Robber", topic:"Dynamic Programming", difficulty:"Medium", week:11, url:"https://leetcode.com/problems/house-robber/" },
  { name:"Coin Change", topic:"Dynamic Programming", difficulty:"Medium", week:11, url:"https://leetcode.com/problems/coin-change/" },
  { name:"Longest Common Subsequence", topic:"Dynamic Programming", difficulty:"Medium", week:11, url:"https://leetcode.com/problems/longest-common-subsequence/" },
  { name:"Unique Paths", topic:"Dynamic Programming", difficulty:"Medium", week:12, url:"https://leetcode.com/problems/unique-paths/" },
  { name:"Edit Distance", topic:"Dynamic Programming", difficulty:"Hard", week:12, url:"https://leetcode.com/problems/edit-distance/" },
  { name:"Implement Trie", topic:"Tries", difficulty:"Medium", week:13, url:"https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { name:"Word Search II", topic:"Tries", difficulty:"Hard", week:13, url:"https://leetcode.com/problems/word-search-ii/" },
  { name:"Insert Interval", topic:"Intervals", difficulty:"Medium", week:13, url:"https://leetcode.com/problems/insert-interval/" },
  { name:"Meeting Rooms II", topic:"Intervals", difficulty:"Medium", week:13, url:"https://leetcode.com/problems/meeting-rooms-ii/" },
  { name:"Subsets", topic:"Backtracking", difficulty:"Medium", week:14, url:"https://leetcode.com/problems/subsets/" },
  { name:"Permutations", topic:"Backtracking", difficulty:"Medium", week:14, url:"https://leetcode.com/problems/permutations/" },
  { name:"N-Queens", topic:"Backtracking", difficulty:"Hard", week:14, url:"https://leetcode.com/problems/n-queens/" },
];

const DIFFICULTY_COLORS = {
  Easy: { bg:"#E1F5EE", color:"#0F6E56" },
  Medium: { bg:"#E6F1FB", color:"#185FA5" },
  Hard: { bg:"#FAECE7", color:"#993C1D" },
};

const TABS = ["Overview","Roadmap","Problem tracker","Companies"];

const STORAGE_KEY = "vinit_roadmap_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function useCountdown() {
  const calc = () => {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();
    if (diff <= 0) return { months:0, weeks:0, days:0, pct:100, currentWeek:24, done:true };
    const totalDays = Math.floor(diff / 86400000);
    const months = Math.floor(totalDays / 30);
    const weeks = Math.floor((totalDays % 30) / 7);
    const days = totalDays % 7;
    const elapsed = (now.getTime() - START_DATE.getTime()) / 86400000;
    const total = (TARGET_DATE.getTime() - START_DATE.getTime()) / 86400000;
    const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    const currentWeek = Math.min(24, Math.max(1, Math.ceil(elapsed / 7)));
    return { months, weeks, days, pct, currentWeek, done: false };
  };
  const [cd, setCd] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setCd(calc()), 60000);
    return () => clearInterval(t);
  }, []);
  return cd;
}

export default function App() {
  const [tab, setTab] = useState("Overview");
  const [openPhases, setOpenPhases] = useState({ 1:true });
  const [openWeekPhases, setOpenWeekPhases] = useState({ 1:true });
  const cd = useCountdown();

  const saved = loadState();
  const [solved, setSolved] = useState(saved?.solved || {});
  const [notes, setNotes] = useState(saved?.notes || {});
  const [customProblems, setCustomProblems] = useState(saved?.customProblems || []);
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterWeek, setFilterWeek] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [addingCustom, setAddingCustom] = useState(false);
  const [newProblem, setNewProblem] = useState({ name:"", topic:"", difficulty:"Medium", week:"1", url:"", note:"" });
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    saveState({ solved, notes, customProblems });
  }, [solved, notes, customProblems]);

  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("vinit_theme") === "dark"; } catch { return false; }
  });

  useEffect(() => {
    document.body.style.background = isDark ? "#111111" : "#ffffff";
    document.body.style.color = isDark ? "#eeeeee" : "#111111";
    try { localStorage.setItem("vinit_theme", isDark ? "dark" : "light"); } catch {}
  }, [isDark]);

  const c = {
    bg:          isDark ? "#111111" : "#ffffff",
    surface:     isDark ? "#1a1a1a" : "#ffffff",
    surfaceAlt:  isDark ? "#222222" : "#f6f6f4",
    border:      isDark ? "#2e2e2e" : "#e5e5e5",
    borderLight: isDark ? "#252525" : "#f0f0f0",
    borderInput: isDark ? "#333333" : "#e0e0e0",
    text:        isDark ? "#eeeeee" : "#111111",
    textMuted:   isDark ? "#aaaaaa" : "#555555",
  };

  const allProblems = [...SUGGESTED_PROBLEMS, ...customProblems];
  const topics = ["All", ...Array.from(new Set(allProblems.map(p => p.topic))).sort()];
  const weeks = ["All", ...Array.from(new Set(allProblems.map(p => String(p.week)))).sort((a,b)=>+a-+b)];

  const filtered = allProblems.filter(p => {
    if (filterTopic !== "All" && p.topic !== filterTopic) return false;
    if (filterDiff !== "All" && p.difficulty !== filterDiff) return false;
    if (filterWeek !== "All" && String(p.week) !== filterWeek) return false;
    if (filterStatus === "Solved" && !solved[p.name]) return false;
    if (filterStatus === "Unsolved" && solved[p.name]) return false;
    return true;
  });

  const solvedCount = Object.values(solved).filter(Boolean).length;
  const totalCount = allProblems.length;

  const toggleSolved = (name) => setSolved(s => ({ ...s, [name]: !s[name] }));

  const startNote = (name, existing) => {
    setEditingNote(name);
    setNoteText(existing || "");
  };

  const saveNote = () => {
    if (editingNote) {
      setNotes(n => ({ ...n, [editingNote]: noteText }));
      setEditingNote(null);
      setNoteText("");
    }
  };

  const addCustom = () => {
    if (!newProblem.name.trim()) return;
    const p = { ...newProblem, week: parseInt(newProblem.week) || 1, custom: true };
    setCustomProblems(cp => [...cp, p]);
    setNewProblem({ name:"", topic:"", difficulty:"Medium", week:"1", url:"", note:"" });
    setAddingCustom(false);
  };

  const deleteCustom = (name) => {
    setCustomProblems(cp => cp.filter(p => p.name !== name));
    setSolved(s => { const n={...s}; delete n[name]; return n; });
    setNotes(n => { const m={...n}; delete m[name]; return m; });
  };

  const phaseColor = { 1:"#1D9E75", 2:"#185FA5", 3:"#BA7517", 4:"#993C1D" };

  const s = {
    wrap: { fontFamily:"system-ui,sans-serif", maxWidth:900, margin:"0 auto", padding:"0 1rem 3rem", background:c.bg, minHeight:"100vh" },
    header: { borderBottom:`0.5px solid ${c.border}`, paddingBottom:"1.5rem", marginBottom:"1.5rem" },
    headerTop: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"1rem", flexWrap:"wrap" as const, paddingTop:"1.5rem" },
    h1: { fontSize:22, fontWeight:500, color:c.text, margin:0 },
    sub: { fontSize:14, color:"#888", marginTop:4 },
    cdBox: { background:c.surfaceAlt, border:`0.5px solid ${c.borderInput}`, borderRadius:12, padding:"1rem 1.25rem", minWidth:260 },
    cdLabel: { fontSize:12, color:"#888", marginBottom:8, textTransform:"uppercase" as const, letterSpacing:"0.05em" },
    cdUnits: { display:"flex", gap:12, alignItems:"center" },
    cdUnit: { textAlign:"center" as const },
    cdNum: { fontSize:28, fontWeight:500, color:c.text, lineHeight:1 },
    cdUnitLabel: { fontSize:11, color:"#888", marginTop:3 },
    cdSep: { fontSize:24, fontWeight:300, color:"#bbb", marginTop:-4 },
    progressWrap: { marginTop:"1.25rem" },
    progressLabel: { display:"flex", justifyContent:"space-between", fontSize:13, color:"#888", marginBottom:6 },
    progressBar: { height:6, background:c.borderInput, borderRadius:999, overflow:"hidden" },
    progressFill: { height:"100%", borderRadius:999, background:"#1D9E75", transition:"width 0.4s" },
    tabs: { display:"flex", gap:4, marginBottom:"1.5rem", borderBottom:`0.5px solid ${c.border}`, paddingBottom:0 },
    tab: (active) => ({ padding:"8px 16px", fontSize:14, fontWeight: active ? 500 : 400, color: active ? c.text : "#888", background:"none", border:"none", borderBottom: active ? `2px solid ${c.text}` : "2px solid transparent", cursor:"pointer", marginBottom:-1 }),
    sectionTitle: { fontSize:13, fontWeight:500, color:"#888", letterSpacing:"0.06em", textTransform:"uppercase" as const, marginBottom:"1rem" },
    card: { background:c.surface, border:`0.5px solid ${c.border}`, borderRadius:12, overflow:"hidden", marginBottom:"0.75rem" },
    phaseHeader: { display:"flex", alignItems:"center", gap:12, padding:"1rem 1.25rem", cursor:"pointer", userSelect:"none" as const },
    dot: (color) => ({ width:10, height:10, borderRadius:"50%", background:color, flexShrink:0 }),
    phaseName: { fontSize:15, fontWeight:500, color:c.text },
    phaseSub: { fontSize:13, color:"#888", marginTop:2 },
    badge: (bg, color) => ({ fontSize:12, padding:"3px 10px", borderRadius:6, fontWeight:500, background:bg, color }),
    phaseBody: { padding:"1rem 1.25rem", borderTop:`0.5px solid ${c.border}` },
    focusPills: { display:"flex", flexWrap:"wrap" as const, gap:6, marginTop:10 },
    pill: { fontSize:12, padding:"3px 10px", borderRadius:999, border:`0.5px solid ${c.border}`, color: isDark ? "#999" : "#666" },
    tip: { borderLeft:"2px solid #1D9E75", padding:"0.75rem 1rem", background:c.surfaceAlt, borderRadius:"0 8px 8px 0", marginTop:"1rem", fontSize:13, color:c.textMuted, lineHeight:1.6 },
    weekGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:8, marginTop:"1rem" },
    weekItem: { background:c.surfaceAlt, borderRadius:8, padding:"10px 12px" },
    weekLabel: { fontSize:12, color:"#888", marginBottom:4 },
    weekTitle: { fontSize:13, fontWeight:500, color:c.text },
    weekDetail: { fontSize:12, color:"#888", marginTop:3, lineHeight:1.4 },
    twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2rem" },
    companyCard: { background:c.surface, border:`0.5px solid ${c.border}`, borderRadius:12, padding:"1rem 1.25rem" },
    companyHead: { fontSize:13, fontWeight:500, color:"#888", marginBottom:10, letterSpacing:"0.05em", textTransform:"uppercase" as const },
    companyRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`0.5px solid ${c.borderLight}` },
    companyName: { fontSize:14, fontWeight:500, color:c.text },
    companyTag: { fontSize:12, color:"#888", marginTop:1 },
    salRemote: { fontSize:13, fontWeight:500, color:"#185FA5" },
    salIndia: { fontSize:13, fontWeight:500, color:"#1D9E75" },
    salBox: { background:c.surfaceAlt, borderRadius:12, padding:"1rem 1.25rem", marginBottom:"2rem" },
    salRow: { display:"flex", gap:"1rem", flexWrap:"wrap" as const },
    salItem: { flex:1, minWidth:140 },
    salItemLabel: { fontSize:12, color:"#888", marginBottom:4 },
    salItemVal: { fontSize:20, fontWeight:500 },
    salItemSub: { fontSize:12, color:"#888", marginTop:2 },
    metricGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:12, marginBottom:"1.5rem" },
    metric: { background:c.surfaceAlt, borderRadius:8, padding:"1rem" },
    metricLabel: { fontSize:12, color:"#888", marginBottom:4 },
    metricVal: { fontSize:22, fontWeight:500, color:c.text },
    filterRow: { display:"flex", gap:8, flexWrap:"wrap" as const, marginBottom:"1rem", alignItems:"center" },
    select: { fontSize:13, padding:"6px 10px", border:`0.5px solid ${c.borderInput}`, borderRadius:8, background:c.surface, color:c.text, cursor:"pointer" },
    table: { width:"100%", borderCollapse:"collapse" as const, minWidth:560 },
    th: { fontSize:12, fontWeight:500, color:"#888", textAlign:"left" as const, padding:"8px 12px", borderBottom:`0.5px solid ${c.border}`, textTransform:"uppercase" as const, letterSpacing:"0.05em" },
    td: { fontSize:13, padding:"10px 12px", borderBottom:`0.5px solid ${c.borderLight}`, verticalAlign:"middle" as const },
    diffBadge: (d) => ({ fontSize:11, padding:"2px 8px", borderRadius:999, fontWeight:500, ...DIFFICULTY_COLORS[d] }),
    checkBtn: (done) => ({ width:20, height:20, borderRadius:4, border:`1.5px solid ${done?"#1D9E75":c.borderInput}`, background: done ? "#1D9E75" : "transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }),
    noteBtn: { fontSize:12, padding:"3px 8px", border:`0.5px solid ${c.borderInput}`, borderRadius:6, background:c.surface, color:c.textMuted, cursor:"pointer" },
    addBtn: { fontSize:13, padding:"8px 16px", border:`0.5px solid ${c.borderInput}`, borderRadius:8, background:c.surface, color:c.text, cursor:"pointer", display:"flex", alignItems:"center", gap:6 },
    primaryBtn: { fontSize:13, padding:"8px 16px", borderRadius:8, background: isDark ? "#eeeeee" : "#111111", color: isDark ? "#111111" : "#ffffff", border:"none", cursor:"pointer" },
    input: { fontSize:13, padding:"7px 10px", border:`0.5px solid ${c.borderInput}`, borderRadius:8, background:c.surface, color:c.text, width:"100%" },
    textarea: { fontSize:13, padding:"8px 10px", border:`0.5px solid ${c.borderInput}`, borderRadius:8, background:c.surface, color:c.text, width:"100%", minHeight:80, resize:"vertical" as const, fontFamily:"inherit" },
    formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 },
    formLabel: { fontSize:12, color:"#888", marginBottom:3 },
    noteModal: { position:"fixed" as const, inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 },
    noteBox: { background:c.surface, borderRadius:12, padding:"1.5rem", width:400, maxWidth:"90vw", border:`0.5px solid ${c.border}` },
    noteTitle: { fontSize:15, fontWeight:500, marginBottom:"1rem", color:c.text },
    phaseDot: (phase) => ({ width:6, height:6, borderRadius:"50%", background: phaseColor[phase], display:"inline-block", marginRight:6, flexShrink:0 }),
    themeBtn: { fontSize:13, padding:"6px 12px", border:`0.5px solid ${c.borderInput}`, borderRadius:8, background:c.surfaceAlt, color:c.text, cursor:"pointer" },
  };

  const togglePhase = (id) => setOpenPhases(p => ({ ...p, [id]: !p[id] }));
  const toggleWeekPhase = (id) => setOpenWeekPhases(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={s.wrap}>
      {editingNote && (
        <div style={s.noteModal} onClick={(e) => e.target === e.currentTarget && saveNote()}>
          <div style={s.noteBox}>
            <div style={s.noteTitle}>Note — {editingNote}</div>
            <textarea style={s.textarea} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="What did you learn? What was the trick?" autoFocus />
            <div style={{ display:"flex", gap:8, marginTop:"1rem", justifyContent:"flex-end" }}>
              <button style={s.noteBtn} onClick={() => setEditingNote(null)}>Cancel</button>
              <button style={s.primaryBtn} onClick={saveNote}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={s.header}>
        <div style={s.headerTop}>
          <div>
            <h1 style={s.h1}>Interview prep roadmap</h1>
            <p style={s.sub}>Backend → remote/international · May → November 2026</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column" as const, alignItems:"flex-end", gap:8 }}>
            <button style={s.themeBtn} onClick={() => setIsDark(d => !d)}>{isDark ? "☀︎ Light" : "◑ Dark"}</button>
          <div style={s.cdBox}>
            <div style={s.cdLabel}>⏱ Time remaining</div>
            {cd.done ? (
              <div style={{fontSize:16,fontWeight:500,color:"#1D9E75",paddingTop:4}}>Goal date reached</div>
            ) : (
              <div style={s.cdUnits}>
                <div style={s.cdUnit}><div style={s.cdNum}>{cd.months}</div><div style={s.cdUnitLabel}>months</div></div>
                <div style={s.cdSep}>:</div>
                <div style={s.cdUnit}><div style={s.cdNum}>{cd.weeks}</div><div style={s.cdUnitLabel}>weeks</div></div>
                <div style={s.cdSep}>:</div>
                <div style={s.cdUnit}><div style={s.cdNum}>{cd.days}</div><div style={s.cdUnitLabel}>days</div></div>
              </div>
            )}
          </div>
          </div>
        </div>
        <div style={s.progressWrap}>
          <div style={s.progressLabel}>
            <span>Week {cd.currentWeek} of 24</span>
            <span>{cd.pct}% complete</span>
          </div>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width:`${cd.pct}%` }} />
          </div>
        </div>
      </div>

      <div style={s.tabs}>
        {TABS.map(t => (
          <button key={t} style={s.tab(tab===t)} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <div>
          <div style={s.metricGrid}>
            <div style={s.metric}><div style={s.metricLabel}>Problems solved</div><div style={s.metricVal}>{solvedCount}<span style={{fontSize:14,color:"#888",fontWeight:400}}>/{totalCount}</span></div></div>
            <div style={s.metric}><div style={s.metricLabel}>Current week</div><div style={s.metricVal}>{cd.currentWeek}</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Days remaining</div><div style={s.metricVal}>{cd.months*30+cd.weeks*7+cd.days}</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Completion</div><div style={s.metricVal}>{cd.pct}%</div></div>
          </div>

          <div style={s.sectionTitle}>The plan at a glance</div>
          {PHASES.map(p => (
            <div key={p.id} style={s.card}>
              <div style={s.phaseHeader} onClick={() => togglePhase(p.id)}>
                <div style={s.dot(p.color)} />
                <div style={{flex:1}}>
                  <div style={s.phaseName}>{p.name}</div>
                  <div style={s.phaseSub}>{p.weeks}</div>
                </div>
                <span style={s.badge(p.badgeBg, p.badgeColor)}>{p.badge}</span>
                <span style={{color:"#888",fontSize:16,marginLeft:8}}>{openPhases[p.id]?"▲":"▼"}</span>
              </div>
              {openPhases[p.id] && (
                <div style={s.phaseBody}>
                  <p style={{fontSize:14,color:"#555",marginTop:"1rem",lineHeight:1.6}}>{p.detail}</p>
                  <div style={s.focusPills}>{p.focus.map(f => <span key={f} style={s.pill}>{f}</span>)}</div>
                  <div style={s.tip}><strong style={{color:"#111"}}>Note: </strong>{p.tip}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "Roadmap" && (
        <div>
          <div style={s.sectionTitle}>Week by week</div>
          {[1,2,3,4].map(phaseId => {
            const phaseWeeks = WEEKS.filter(w => w.phase === phaseId);
            const ph = PHASES.find(p => p.id === phaseId);
            return (
              <div key={phaseId} style={s.card}>
                <div style={s.phaseHeader} onClick={() => toggleWeekPhase(phaseId)}>
                  <div style={s.dot(ph.color)} />
                  <div style={{flex:1}}>
                    <div style={s.phaseName}>{ph.name}</div>
                    <div style={s.phaseSub}>{ph.weeks}</div>
                  </div>
                  <span style={{color:"#888",fontSize:16}}>{openWeekPhases[phaseId]?"▲":"▼"}</span>
                </div>
                {openWeekPhases[phaseId] && (
                  <div style={s.phaseBody}>
                    <div style={s.weekGrid}>
                      {phaseWeeks.map(w => (
                        <div key={w.w} style={{...s.weekItem, borderLeft:`3px solid ${ph.color}`}}>
                          <div style={s.weekLabel}>Week {w.w}</div>
                          <div style={s.weekTitle}>{w.title}</div>
                          <div style={s.weekDetail}>{w.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "Problem tracker" && (
        <div>
          <div style={s.metricGrid}>
            <div style={s.metric}><div style={s.metricLabel}>Total</div><div style={s.metricVal}>{totalCount}</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Solved</div><div style={{...s.metricVal,color:"#1D9E75"}}>{solvedCount}</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Remaining</div><div style={s.metricVal}>{totalCount - solvedCount}</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Progress</div><div style={s.metricVal}>{totalCount ? Math.round(solvedCount/totalCount*100) : 0}%</div></div>
          </div>

          <div style={{ marginBottom:"1rem" }}>
            <div style={{ height:6, background:"#eee", borderRadius:999, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${totalCount ? Math.round(solvedCount/totalCount*100) : 0}%`, background:"#1D9E75", borderRadius:999, transition:"width 0.4s" }} />
            </div>
          </div>

          <div style={s.filterRow}>
            <select style={s.select} value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
              {topics.map(t => <option key={t}>{t}</option>)}
            </select>
            <select style={s.select} value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
              {["All","Easy","Medium","Hard"].map(d => <option key={d}>{d}</option>)}
            </select>
            <select style={s.select} value={filterWeek} onChange={e => setFilterWeek(e.target.value)}>
              {weeks.map(w => <option key={w}>{w === "All" ? "All weeks" : `Week ${w}`}</option>)}
            </select>
            <select style={s.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {["All","Solved","Unsolved"].map(s => <option key={s}>{s}</option>)}
            </select>
            <button style={s.addBtn} onClick={() => setAddingCustom(a => !a)}>
              {addingCustom ? "✕ Cancel" : "+ Add problem"}
            </button>
          </div>

          {addingCustom && (
            <div style={{...s.card, marginBottom:"1rem"}}>
              <div style={{padding:"1rem 1.25rem"}}>
                <div style={{fontSize:14,fontWeight:500,marginBottom:"1rem",color:"#111"}}>Add custom problem</div>
                <div style={s.formGrid}>
                  <div>
                    <div style={s.formLabel}>Problem name</div>
                    <input style={s.input} placeholder="e.g. Two Sum" value={newProblem.name} onChange={e => setNewProblem(p => ({...p,name:e.target.value}))} />
                  </div>
                  <div>
                    <div style={s.formLabel}>Topic</div>
                    <input style={s.input} placeholder="e.g. Arrays" value={newProblem.topic} onChange={e => setNewProblem(p => ({...p,topic:e.target.value}))} />
                  </div>
                  <div>
                    <div style={s.formLabel}>Difficulty</div>
                    <select style={s.select} value={newProblem.difficulty} onChange={e => setNewProblem(p => ({...p,difficulty:e.target.value}))}>
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <div style={s.formLabel}>Week</div>
                    <input style={s.input} type="number" min="1" max="24" value={newProblem.week} onChange={e => setNewProblem(p => ({...p,week:e.target.value}))} />
                  </div>
                </div>
                <div style={{marginBottom:8}}>
                  <div style={s.formLabel}>LeetCode URL (optional)</div>
                  <input style={s.input} placeholder="https://leetcode.com/problems/..." value={newProblem.url} onChange={e => setNewProblem(p => ({...p,url:e.target.value}))} />
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.75rem"}}>
                  <button style={s.primaryBtn} onClick={addCustom}>Add problem</button>
                </div>
              </div>
            </div>
          )}

          <div style={{overflowX:"auto"}}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}></th>
                  <th style={s.th}>Problem</th>
                  <th style={s.th}>Topic</th>
                  <th style={s.th}>Difficulty</th>
                  <th style={s.th}>Week</th>
                  <th style={s.th}>Note</th>
                  <th style={s.th}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.name + i} style={{opacity: solved[p.name] ? 0.55 : 1}}>
                    <td style={s.td}>
                      <button style={s.checkBtn(solved[p.name])} onClick={() => toggleSolved(p.name)} aria-label={solved[p.name]?"Mark unsolved":"Mark solved"}>
                        {solved[p.name] && <span style={{color:"#fff",fontSize:12,lineHeight:1}}>✓</span>}
                      </button>
                    </td>
                    <td style={s.td}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={s.phaseDot(p.phase || WEEKS.find(w=>w.w===p.week)?.phase || 1)} />
                        {p.url ? (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{color:"#185FA5",textDecoration:"none",fontWeight:500}}>{p.name}</a>
                        ) : (
                          <span style={{fontWeight:500}}>{p.name}</span>
                        )}
                        {p.custom && <span style={{fontSize:11,color:"#888",padding:"1px 6px",border:"0.5px solid #e0e0e0",borderRadius:4}}>custom</span>}
                      </div>
                    </td>
                    <td style={s.td}><span style={{color:"#555"}}>{p.topic}</span></td>
                    <td style={s.td}><span style={s.diffBadge(p.difficulty)}>{p.difficulty}</span></td>
                    <td style={s.td}><span style={{color:"#888"}}>W{p.week}</span></td>
                    <td style={s.td}>
                      {notes[p.name] ? (
                        <button style={{...s.noteBtn,color:"#1D9E75",borderColor:"#1D9E75"}} onClick={() => startNote(p.name, notes[p.name])}>
                          Edit note
                        </button>
                      ) : (
                        <button style={s.noteBtn} onClick={() => startNote(p.name, "")}>Add note</button>
                      )}
                    </td>
                    <td style={s.td}>
                      {p.custom && (
                        <button style={{...s.noteBtn,color:"#993C1D",borderColor:"#f0c0b0"}} onClick={() => deleteCustom(p.name)}>✕</button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{...s.td,textAlign:"center",color:"#888",padding:"2rem"}}>No problems match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Companies" && (
        <div>
          <div style={s.sectionTitle}>Target salary</div>
          <div style={s.salBox}>
            <div style={s.salRow}>
              <div style={s.salItem}>
                <div style={s.salItemLabel}>Remote / international (USD)</div>
                <div style={{...s.salItemVal,color:"#185FA5"}}>$80k – $130k</div>
                <div style={s.salItemSub}>GitLab, Deel, Stripe, Shopify</div>
              </div>
              <div style={s.salItem}>
                <div style={s.salItemLabel}>India premium (INR)</div>
                <div style={{...s.salItemVal,color:"#1D9E75"}}>25 – 40 LPA</div>
                <div style={s.salItemSub}>Only if deal is exceptional</div>
              </div>
            </div>
          </div>

          <div style={s.sectionTitle}>Remote-first international</div>
          <div style={{...s.card,marginBottom:"1.5rem"}}>
            {COMPANIES.remote.map((c,i) => (
              <div key={c.name} style={{...s.companyRow, borderBottom: i===COMPANIES.remote.length-1?"none":"0.5px solid #f0f0f0", padding:"12px 1.25rem"}}>
                <div>
                  <div style={s.companyName}>{c.name}</div>
                  <div style={s.companyTag}>{c.tag}</div>
                </div>
                <div style={s.salRemote}>{c.sal}</div>
              </div>
            ))}
          </div>

          <div style={s.sectionTitle}>India — only exceptional deals</div>
          <div style={s.card}>
            {COMPANIES.india.map((c,i) => (
              <div key={c.name} style={{...s.companyRow, borderBottom: i===COMPANIES.india.length-1?"none":"0.5px solid #f0f0f0", padding:"12px 1.25rem"}}>
                <div>
                  <div style={s.companyName}>{c.name}</div>
                  <div style={s.companyTag}>{c.tag}</div>
                </div>
                <div style={s.salIndia}>{c.sal}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}