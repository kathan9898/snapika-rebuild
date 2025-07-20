import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./stranger-things.css";
import { useNavigate } from "react-router-dom";


const squad = [
  {
    name: "Kathan",
    nickname: "The Einstein of Bad Luck",
    img: "/friends/kathu.jpeg",
    ability: "Big Brain Energy, Zero Game",
    icon: "🧠",
    shortRoast: "Has the IQ of Einstein but the dating luck of a cursed amulet. Can solve complex equations but can't solve why girls run away.",
    detailedRoast: {
      title: "🎯 The Master of Overthinking",
      intro: "Behold! The guy who can calculate the trajectory to Mars but can't navigate a simple 'Hello' to a girl!",
      roasts: [
        "🧮 Can solve calculus in his head but can't solve why his crush left him on read",
        "📚 Reads 5 books a week but still can't read social cues", 
        "🎲 Has worse luck with girls than a broken slot machine in Vegas",
        "🔬 Studies quantum physics but his love life exists in a parallel universe",
        "💡 Brilliant mind, but when it comes to dating, the lights are definitely not on upstairs"
      ],
      heavenlyVerdict: "In Heaven's dating department, Kathan would be the guy asking 'Did I do something wrong?' while cupid facepalms infinitely! 😇💔"
    },
    gradient: "from-red-400 via-red-500 to-red-600",
    glitch: true
  },
  {
    name: "Manu",
    nickname: "The Love Magnet",
    img: "/friends/manu.jpeg", 
    ability: "Professional Heart Collector",
    icon: "💘",
    shortRoast: "The Casanova who somehow convinced everyone he's smooth. Girls fall for him like they're under Mind Flayer control.",
    detailedRoast: {
      title: "👑 The King of Smooth Talk",
      intro: "Ladies and gentlemen, presenting the guy who could charm a brick wall into a date!",
      roasts: [
        "💋 Has more girlfriends than Netflix has shows",
        "🎭 Could sell ice to penguins and still get their number",
        "📱 His phone contacts look like a phone book from heaven",
        "💫 Makes other guys wonder if he's using cheat codes in the game of love",
        "🌟 So smooth that even mirrors ask for his autograph"
      ],
      heavenlyVerdict: "If love was a video game, Manu would be playing on creative mode while the rest of us struggle on hardcore difficulty! 😂👼"
    },
    gradient: "from-pink-400 via-purple-500 to-red-500",
    glitch: false
  },
  {
    name: "Jayu",
    nickname: "The Buffalo Champion",
    img: "/friends/jayu.jpeg",
    ability: "PUBG Legend & Love Winner",
    icon: "🎮",
    shortRoast: "Looks like a buffalo, plays like a pro, engaged like a boss. First to get engaged because someone actually said yes!",
    detailedRoast: {
      title: "🏆 The Unlikely Champion",
      intro: "The guy who proved that looks don't matter when you've got skills that kill!",
      roasts: [
        "🐃 Built like a buffalo but fights like a lion in PUBG",
        "🎯 Can headshot enemies from 500m but took years to shoot his shot with love",
        "💍 First to get engaged - proving miracles do happen in heaven!",
        "🏅 Chicken dinner champion who finally got his real-life winner winner moment",
        "🎪 Looks like he belongs in a circus but performs like he belongs in esports hall of fame"
      ],
      heavenlyVerdict: "Angels in heaven are still confused how this buffalo became the first to cross the finish line in love! But hey, legends are made, not born! 🎮💕"
    },
    gradient: "from-green-400 via-emerald-500 to-green-600",
    glitch: false
  },
  {
  name: "Niku",
  nickname: "Pinki the Pro Thakor",
  img: "/friends/niko.jpeg",
  ability: "First Virginity Stealer & Chapri King",
  icon: "💄",
  shortRoast: "He may look like a chapri, but he's got moves that would make even TikTok blush. First to steal hearts (and innocence) — beware, Pinki's on the prowl!",
  detailedRoast: {
    title: "💘 The Legend of Pinki",
    intro: "Introducing Niku, the guy who looks like every girl's 'bad decision' but somehow convinces them it's a good idea!",
    roasts: [
      "👑 Became the first 'Virginity Stealer' and still flexes like he won a Nobel Prize",
      "🎬 Has more Thakor style than a Gujarati serial villain — and twice the drama",
      "🚬 Rocks the chapri look so hard, even the local paanwala asks for style tips",
      "💔 Breaks hearts faster than he breaks traffic rules on his splendor",
      "😂 Still waiting for his own Netflix show: 'Keeping Up with the Pinkis'"
    ],
    heavenlyVerdict: "If heaven had a bouncer, Pinki would be the guy sneaking in with a fake ID and a killer wink. Even Cupid double-checks his arrows around this one! 😈💗"
  },
  gradient: "from-pink-500 via-fuchsia-600 to-purple-700",
  glitch: true
},
  {
    name: "Flavian",
    nickname: "Karu the Eternal Optimist",
    img: "/friends/fm.png",
    ability: "Professional Heartbreak Artist",
    icon: "💔",
    shortRoast: "Sweet guy who thinks every girl is 'the one' - plot twist: she's always someone else's one! Naughty, careless, and hilariously delusional.",
    detailedRoast: {
      title: "🎨 The Picasso of Heartbreak",
      intro: "Meet the guy who collects broken hearts like they're rare trading cards!",
      roasts: [
        "💕 Falls in love faster than WiFi connects (and disconnects just as quick)",
        "🎭 Thinks every girl is his soulmate - spoiler alert: they're someone else's Netflix password",
        "🤡 So naughty and careless that even chaos asks him to calm down",
        "🎪 Lives in a fantasy world where every crush is mutual (narrator: it never is)",
        "💸 Spends more money on gifts for girls who friendzone him than on himself"
      ],
      heavenlyVerdict: "Heaven's love department has a special file for Karu titled 'Bless His Heart - He Tries So Hard!' 😂😇"
    },
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    glitch: true
  },
  {
    name: "Gulabo",
    nickname: "The Broken Smile Warrior",
    img: "/friends/hetu.jpeg",
    ability: "Double Damage Specialist",
    icon: "🦷",
    shortRoast: "Two front teeth broken, heart shattered - this guy's a walking disaster movie. But hey, at least he's consistent!",
    detailedRoast: {
      title: "⚡ The Master of Misfortune",
      intro: "The guy who took 'breaking bad' a little too literally - teeth, heart, everything!",
      roasts: [
        "🦷 Lost his front teeth and his game at the same time - talk about efficiency!",
        "💔 Heart broken more times than his teeth (and that's saying something)",
        "🎪 Smile looks like a jack-o'-lantern but personality shines brighter than his missing teeth",
        "🎲 Has luck so bad that fortune cookies apologize to him personally",
        "😬 Dentist recommended braces, therapist recommended tissues - he needed both!"
      ],
      heavenlyVerdict: "Angels in heaven are taking turns trying to fix this guy's luck, but even divine intervention has its limits! 😂🦷"
    },
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    glitch: true
  },
  {
    name: "Dholu & Bholu",
    nickname: "The Fake Gangster Duo",
    img: "/friends/dholu.jpeg",
    ability: "Professional Cute Pretenders",
    icon: "👯‍♂️",
    shortRoast: "Two Gujarati 'kalakars' who think they're badass but are actually just cute teddy bears in disguise. So scary... NOT! 😂",
    detailedRoast: {
      title: "🐻 The Teddy Bear Mafia",
      intro: "Presenting the most adorable 'gangsters' who couldn't intimidate a butterfly!",
      roasts: [
        "😤 Think they're gangsters but look like they belong in a Disney movie",
        "🧸 So cute that even their attempts at being tough make people want to hug them",
        "🎭 Gujarati kalakars who perform 'tough guy' better than actual tough guys perform cute",
        "🍼 Probably argue over who gets the last piece of dhokla more than territory",
        "👶 Scariest thing about them is how adorably they think they're intimidating"
      ],
      heavenlyVerdict: "Heaven's security department tried to recruit them but they were too busy being adorable to notice! These 'bad boys' couldn't scare a cloud! ☁️😂"
    },
    gradient: "from-orange-400 via-amber-500 to-yellow-500",
    glitch: false
  },
  {
    name: "Circuit",
    nickname: "The Human Command Prompt",
    img: "/friends/pb.png",
    ability: "Requires Manual Input",
    icon: "🤖",
    shortRoast: "Named Circuit because his brain literally needs commands to function. 'Circuit.exe has stopped working' is his default state.",
    detailedRoast: {
      title: "💻 The Living Computer Bug",
      intro: "The guy who makes Siri look spontaneous and Alexa seem independent!",
      roasts: [
        "🔌 Needs to be plugged in and given instructions to do basic human activities",
        "💾 Operates on Windows 95 while everyone else is on iOS 17",
        "⌨️ Requires step-by-step commands to understand jokes (still buffering...)",
        "🖥️ Has more lag than a potato computer trying to run Cyberpunk 2077",
        "🔄 Constantly needs rebooting - 'Have you tried turning Circuit off and on again?'"
      ],
      heavenlyVerdict: "Heaven's IT department is still trying to figure out how to update Circuit's software. Current status: 'Installation failed, please try again!' 🤖😇"
    },
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glitch: true
  }
];
// (Paste your original squad array here, unchanged.)

const FloatingParticles = () => {
   const particles = Array.from({ length: 25 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-blue-400/40 rounded-full shadow-sm shadow-blue-400/60"
      initial={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
      }}
      animate={{
        y: -100,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        opacity: [0, 0.8, 0.4, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: Math.random() * 12 + 6,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 8,
      }}
    />
  ));
  // (You can keep your existing FloatingParticles for extra ambient effect.)
  return <div style={{ display: "none" }}>{particles}</div>;
};

const GlitchText = ({ children }) => (
  <span className="stranger-glitch">{children}</span>
);

const DetailedRoastModal = ({ member, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="stranger-modal-bg" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 180 }}
          className="stranger-modal-card"
          onClick={e => e.stopPropagation()}
        >
          <button className="stranger-close-btn" onClick={onClose}>×</button>
          <div style={{ textAlign: "center" }}>
            <div className="squad-avatar" style={{ marginBottom: 16 }}>
              {member.img
                ? <img src={member.img} alt={member.name} />
                : <span style={{ fontSize: "2rem" }}>{member.icon}</span>
              }
            </div>
            <div className="flicker" style={{ fontSize: "2rem", marginBottom: 8 }}>
              {member.name}
            </div>
            <div style={{ fontSize: "1.2rem", color: "#ccc", marginBottom: 10 }}>
              “{member.nickname}”
            </div>
            <div style={{
              fontSize: "1.25rem", fontWeight: 700,
              color: "#ff0033", margin: "18px 0 16px 0"
            }}>{member.detailedRoast.title}</div>
            <div className="roast-panel" style={{ marginBottom: 18 }}>
              {member.detailedRoast.intro}
            </div>
            <div style={{ marginBottom: 18 }}>
              {member.detailedRoast.roasts.map((r, i) => (
                <div className="roast-panel" key={i} style={{
                  background: "#27102c99",
                  color: "#fff",
                  border: "1.2px solid #c4023b60"
                }}>{r}</div>
              ))}
            </div>
            <div className="roast-panel" style={{
              background: "#1d182880",
              border: "1.3px solid #ffd900bb",
              color: "#ffd900",
              fontWeight: 600,
              fontSize: "1.1rem"
            }}>
              {member.detailedRoast.heavenlyVerdict}
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const SquadCard = ({ member, onClick }) => (
  <motion.div className="squad-card" whileHover={{ scale: 1.04, y: -10 }} onClick={onClick}>
    <div className="squad-card-content">
      <div className="squad-avatar">
        {member.img
          ? <img src={member.img} alt={member.name} />
          : <span style={{ fontSize: "2rem" }}>{member.icon}</span>
        }
      </div>
      <div className="flicker" style={{ fontSize: "1.7rem", marginBottom: 6 }}>
        {member.name}
      </div>
      <div style={{
        color: "#00f2ff",
        fontWeight: 700,
        marginBottom: 7
      }}>{member.nickname}</div>
      <div style={{
        fontSize: "1.17rem",
        fontWeight: 700,
        background: "linear-gradient(90deg,#ff0033,#00f2ff)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        marginBottom: 7
      }}>{member.ability}</div>
      <div className="short-roast" style={{ marginBottom: 9 }}>{member.shortRoast}</div>
      <div style={{
        color: "#00f2ff", fontSize: "0.85rem", margin: "7px auto", opacity: 0.75
      }}>
        🎭 Click for the FULL ROAST EXPERIENCE!
      </div>
    </div>
  </motion.div>
);

export default function EnhancedSquadRoastHeaven() {
    const navigate = useNavigate();
  const [currentMember, setCurrentMember] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);

  const nextMember = () => setCurrentMember(prev => (prev + 1) % squad.length);
  const prevMember = () => setCurrentMember(prev => (prev - 1 + squad.length) % squad.length);
  const openModal = (member) => setSelectedMember(member);
  const closeModal = () => setSelectedMember(null);

  return (
    <div className="stranger-bg" style={{ minHeight: "100vh", position: "relative" }}>
      <div className="stranger-mist" />
      <FloatingParticles />

      <header style={{ padding: "5rem 0 2.5rem 0", textAlign: "center" }}>
        <GlitchText>SNAPIKA</GlitchText>
        <div style={{
          fontSize: "2rem",
          color: "#ff0033",
          fontWeight: 700,
          margin: "1.1rem 0 0.5rem 0",
          textShadow: "0 0 12px #ff003388, 0 0 7px #00f2ff88"
        }}>
          🏛️ HEAVENLY ROAST PALACE 🏛️
        </div>
        <div style={{
          fontSize: "1.15rem",
          maxWidth: 600,
          margin: "1rem auto",
          color: "#fff",
          background: "#15171a",
          borderRadius: 16,
          border: "1.4px solid #00356666",
          padding: "1rem 2.3rem",
          boxShadow: "0 0 20px #00356633"
        }}>
          Where friendship burns eternal and roasts are served by angels! ✨🔥
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto 3rem auto" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "2.5rem", marginBottom: "2.6rem"
        }}>
          <div className="squad-carousel">
          <button className="stranger-arrow-btn" onClick={prevMember}>←</button>
          <div style={{ flex: 1, minWidth: 220 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMember}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
              >
                <SquadCard
                  member={squad[currentMember]}
                  onClick={() => openModal(squad[currentMember])}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <button className="stranger-arrow-btn" onClick={nextMember}>→</button>
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <span style={{
            fontFamily: "Roboto Mono, monospace",
            color: "#fff", background: "#191b24", borderRadius: 14,
            padding: "0.7rem 2rem", fontSize: "1.13rem", border: "1.4px solid #00356666"
          }}>
            🎭 Roasting {currentMember + 1} of {squad.length} Angels 👼
          </span>
        </div>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          {squad.map((_, i) => (
            <span key={i}
              className={"stranger-dot" + (i === currentMember ? " active" : "")}
              style={{ cursor: "pointer" }}
              onClick={() => setCurrentMember(i)}
            />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1150, margin: "0 auto", textAlign: "center", marginBottom: "2.5rem" }}>
        <GlitchText>
          <div style={{ fontSize: "2.2rem", margin: "2.5rem 0 1.5rem 0" }}>
            📊 HEAVENLY STATISTICS
          </div>
        </GlitchText>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginBottom: 32
        }}>
          {[
            { icon: "💔", stat: "99.9%", desc: "Heartbreak Success Rate" },
            { icon: "🎮", stat: "1", desc: "Buffalo PUBG Champion" },
            { icon: "🤖", stat: "∞", desc: "Commands Required Daily" },
            { icon: "👑", stat: "1", desc: "Actual Love Master" }
          ].map((s, i) => (
            <div className="heaven-stat" key={i}>
              <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{
                fontSize: "1.8rem", fontWeight: 800,
                background: "linear-gradient(90deg,#ff0033,#00f2ff)",
                WebkitBackgroundClip: "text", color: "transparent",
                marginBottom: 4
              }}>{s.stat}</div>
              <div style={{ color: "#aee0ff", fontSize: "1rem" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      <button
        className="stranger-cta-btn"
        onClick={() => navigate("/dashboard")}
      >
        ENTER THE UPSIDE DOWN 🔥
      </button>
      </div>
      <DetailedRoastModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={closeModal}
      />
    </div>
  );
}
