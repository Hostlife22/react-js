import { PageLayout } from './components/PageLayout';
import { FilmIntro } from './features/film/FilmIntro';
import { FilmExperience } from './features/film/FilmExperience';
import './styles.css';

export default function App() {
  return (
    <PageLayout>
      <FilmIntro />
      <FilmExperience />
    </PageLayout>
  );
}
