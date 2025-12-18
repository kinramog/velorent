"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-veloprimary p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl bg-velobone rounded-xl shadow p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center">Об авторе</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">ФИО</h2>
          <p>Гомарник Сергей Александрович</p>

          <h2 className="text-2xl font-semibold">Группа</h2>
          <p>ДПИ23-1</p>

          <h2 className="text-2xl font-semibold">Контактные данные</h2>
          <ul className="list-disc list-inside">
            <li>Email: 233314@edu.fa.ru</li>
            <li>Личный Email: serg.gomarnik@gmail.com</li>
            <li>Телефон: +7 (916) 466 63 11</li>
          </ul>

          <h2 className="text-2xl font-semibold">Опыт работы с технологиями</h2>
          <p>
            Основные технологии, используемые в рамках проекта: <strong>Next.js, NestJS, TypeORM, PostgreSQL, TailwindCSS, TypeScript</strong>. 
            Работа включает в себя разработку интерфейсов, API, интеграцию с базой данных и управление состоянием.
          </p>

          <h2 className="text-2xl font-semibold">Даты проекта</h2>
          <p>Начало: 31.10.2025 | Завершение: 18.12.2025</p>
        </section>
      </div>
    </div>
  );
}
