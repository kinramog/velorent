import Link from "next/link";

export default function HomePage() {
  return (
    <>

      {/* HERO */}
      <section className="bg-velobone py-32">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-velodeep">
            Аренда велосипедов по всей России
          </h1>

          <p className="mt-4 text-lg text-velodeep/80 max-w-2xl mx-auto">
            Удобно, быстро и доступно. Находим ближайший пункт проката и
            отправляемся в путь!
          </p>

          <div className="mt-8">
            <Link
              href="/bicycle"
              className="px-6 py-3 bg-veloprimary text-white text-lg rounded-md hover:bg-velodeep transition"
            >
              Выбрать велосипед
            </Link>
          </div>
        </div>
      </section>

      {/* Блок преимуществ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="font-semibold text-xl text-velodeep">
              Большой выбор велосипедов
            </h3>
            <p className="text-velodeep/70 mt-2">
              Городские, горные, электровелосипеды и многое другое.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-velodeep">
              Удобные пункты проката
            </h3>
            <p className="text-velodeep/70 mt-2">
              В каждом районе — выбирайте любой.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-velodeep">
              Доступные цены
            </h3>
            <p className="text-velodeep/70 mt-2">
              Прозрачная система аренды без скрытых платежей.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
