import Link from "next/link";

export default function HomePage() {
  return (
    <>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Фон */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero-bike.jpg')",
          }}
        />

        {/* Затемнение */}
        <div className="absolute inset-0 bg-velodeep/60" />

        {/* Контент */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Аренда велосипедов
            <br />
            по всей России
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/90">
            Быстро. Удобно. Рядом с вами.
            <br />
            Выбирайте велосипед и отправляйтесь в путь уже сегодня.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/bicycle"
              className="px-8 py-4 bg-veloprimary text-white text-lg rounded-md hover:bg-velosecondary transition shadow-lg"
            >
              Выбрать велосипед
            </Link>
          </div>
        </div>
      </section>

      {/* Блок преимуществ */}
            {/* Преимущества */}
      <section className="py-28 bg-velobone">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-velodeep mb-16">
            Почему выбирают нас
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl mb-4">🚲</div>
              <h3 className="font-semibold text-xl text-velodeep">
                Большой выбор велосипедов
              </h3>
              <p className="text-velodeep/70 mt-3">
                Городские, горные, электровелосипеды и другие модели.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-semibold text-xl text-velodeep">
                Удобные пункты проката
              </h3>
              <p className="text-velodeep/70 mt-3">
                Пункты в каждом районе — выбирайте ближайший.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold text-xl text-velodeep">
                Прозрачные цены
              </h3>
              <p className="text-velodeep/70 mt-3">
                Никаких скрытых платежей и неожиданных доплат.
              </p>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
