import Navbar from "@/components/global/Navbar";
import FormContainer from "@/components/pages/FormContainer";
import Container from "@/components/shared/Container";
import GptBadge from "@/components/shared/GptBadge";
import Header from "@/components/shared/Header";

export default async function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Container className="mt-40">
        <Header
      title= "Make Studying Fun and Effective!"
      description= "Turn your notes or study materials into interactive quizzes to boost learning retention."
        />
      </Container>
      <FormContainer />
      <GptBadge />
    </main>
  );
}
