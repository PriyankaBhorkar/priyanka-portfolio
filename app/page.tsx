import dynamic from "next/dynamic";
import { AnimatedBackground } from "@/components/animated-background";
import { MotionProvider } from "@/components/motion-provider";
import { ChatProvider } from "@/components/chat/chat-provider";
import { Navbar } from "@/components/navbar";
import { BackToTop } from "@/components/back-to-top";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

// The chat panel is only needed once a visitor opens it, so it loads separately.
const ChatWidget = dynamic(() => import("@/components/chat/chat-widget").then((m) => m.ChatWidget));

export default function HomePage() {
  return (
    <MotionProvider>
      <AnimatedBackground />
      <ChatProvider>
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Education />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <ChatWidget />
      </ChatProvider>
    </MotionProvider>
  );
}
