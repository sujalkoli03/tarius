import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Story from "@/components/story/Story";
import Quality from "@/components/quality/Quality";
import Faq from "@/components/faq/Faq";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Story id="story" />
        <Quality id="quality" />
        <Faq id="faq" />
        <Contact id="contact" />
      </main>
    </>
  );
}