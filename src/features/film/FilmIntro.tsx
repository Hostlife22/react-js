import { CHAPTERS, VIDEO } from '../../timeline';

export function FilmIntro() {
  return (
    <section className="intro" aria-labelledby="title">
      <div>
        <p className="eyebrow">A short story through art history</p>
        <h1 id="title">
          Eras change.
          <br />
          <em>Cats remain.</em>
        </h1>
      </div>
      <div className="intro-note">
        <p>
          From cave walls to contemporary illustration. One table, one cup, and a very curious cat.
        </p>
        <div className="film-spec">
          <span>{`${CHAPTERS.length} eras`}</span>
          <span>{`${VIDEO.duration} seconds`}</span>
          <span>With sound</span>
        </div>
      </div>
    </section>
  );
}
